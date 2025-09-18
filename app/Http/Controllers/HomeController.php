<?php

namespace App\Http\Controllers;

use App\Models\Banners;
use App\Models\User;
use App\Models\Category;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $products = Product::with(['merk', 'category'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('merk', function ($q) use ($search) {
                        $q->where('merk_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('category_name', 'like', "%{$search}%");
                    });
            })
            ->limit(12)
            ->get();

        return Inertia::render('products/list-product', [
            'products' => $products,
            'search'   => $search,
        ]);
    }
    public function featuredProducts($limit = 5, $category = 'Handphone')
    {
        $products = Product::with(['merk', 'category'])
            ->whereHas('category', function ($query) use ($category) {
                $query->where('category_name', $category);
            })
            ->latest()
            ->limit($limit)
            ->get();

        $products->transform(function ($product) {
            if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
                $product->image = Storage::url($product->image);
            }
            return $product;
        });

        return $products;
    }

    public function homePage(Request $request)
    {
        $search = $request->query('search', '');
        $user   = auth()->user();

        $categories = Category::select('id_category', 'category_name', 'image')->get();
        $productsByCategory = [];
        foreach ($categories as $category) {
            $query = Product::with(['merk', 'category'])
                ->whereHas('category', fn($q) => $q->where('category_name', $category->category_name))
                ->latest()
                ->limit(8);
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }
            $productsByCategory[$category->category_name] = $query->get();
        }
        if ($user?->hasRole('admin')) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('homepage2', [
            'user'              => $user,
            'categories'        => $categories,
            'productsByCategory' => $productsByCategory,
        ]);
    }
    public function homePage2()
    {
        $search = $request->query('search', '');
        $user   = auth()->user();

        $categories = Category::select('id_category', 'category_name', 'image')->get();
        $productsByCategory = [];
        $banners = Banners::all();

        foreach ($categories as $category) {
            $query = Product::with(['merk', 'category'])
                ->whereHas('category', fn($q) => $q->where('category_name', $category->category_name))
                ->latest()
                ->limit(8);
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }
            $productsByCategory[$category->category_name] = $query->get();
        }
        if ($user?->hasRole('admin')) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('homepage2', [
            'user'              => $user,
            'categories'        => $categories,
            'productsByCategory' => $productsByCategory,
            'banners' => $banners,
        ]);
    }

    public function suggestions(Request $request)
    {
        try {
            $q = trim($request->get('q', ''));

            if ($q === '') {
                return response()->json([]);
            }

            $products = Product::with(['merk', 'category'])
                ->where('name', 'like', "%{$q}%")
                ->orWhereHas('merk', function ($query) use ($q) {
                    $query->where('merk_name', 'like', "%{$q}%");
                })
                ->orWhereHas('category', function ($query) use ($q) {
                    $query->where('category_name', 'like', "%{$q}%");
                })
                ->orderBy('name')
                ->limit(10)
                ->get()
                ->map(function ($p) {
                    return [
                        'id'       => $p->id_product ?? $p->id,
                        'name'     => $p->name,
                        'price'    => (int) $p->price,
                        'brand'    => optional($p->merk)->merk_name ?? '-',
                        'category' => optional($p->category)->category_name ?? '-',
                    ];
                })
                ->toArray();

            if (empty($products)) {
                $products[] = [
                    'id'       => null,
                    'name'     => "Lihat semua produk \"{$q}\"",
                    'price'    => null,
                    'brand'    => null,
                    'category' => null,
                    'redirect'      => route('product.index', ['search' => $q]),
                ];
            }

            return response()->json($products);
        } catch (\Throwable $e) {
            \Log::error('Search suggestions error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
    public function dashboard()
    {
        $stats = [
            'products'       => Product::count(),
            'pending_orders' => Invoice::where('status', 'Pending')->count(),
            'paid_orders'    => Invoice::where('status', 'Sudah dibayar')->count(),
            'users'          => User::count(),
            'revenue'        => Invoice::where('status', 'Sudah dibayar')->sum('payment_amount'),
        ];

        // Ambil semua invoice detail paid sekali saja dengan eager load
        $invoiceDetails = InvoiceDetail::with(['product.category', 'product.merk'])
            ->whereHas('invoice', fn($q) => $q->where('status', 'Sudah dibayar'))
            ->get();

        // Top by category
        $categoryPurchases = $invoiceDetails
            ->groupBy(fn($d) => $d->product->category->id_category)
            ->map(fn($g, $id) => [
                'id_category'    => (int)$id,
                'name'           => $g->first()->product->category->category_name ?? null,
                'total_quantity' => $g->sum('quantity'),
            ])
            ->sortByDesc('total_quantity')
            ->values()
            ->toArray();

        // Top products
        $topProducts = $invoiceDetails
            ->groupBy('product_id')
            ->map(fn($g, $id) => [
                'id_product'     => (int)$id,
                'name'           => $g->first()->product->name ?? null,
                'total_quantity' => $g->sum('quantity'),
            ])
            ->sortByDesc('total_quantity')
            ->take(10)
            ->values()
            ->toArray();

        // Monthly filter
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear   = Carbon::now()->endOfYear();

        // Category monthly
        $categoryMonthly = $invoiceDetails
            ->whereBetween('created_at', [$startOfYear, $endOfYear])
            ->groupBy(fn($d) => Carbon::parse($d->created_at)->format('Y-m'))
            ->map(fn($group, $month) => [
                'month'      => $month,
                'year'       => (int)substr($month, 0, 4),
                'categories' => collect($group)->groupBy(fn($d) => $d->product->category->id_category)
                    ->map(fn($items) => $items->sum('quantity'))
                    ->toArray(),
            ])
            ->values()
            ->toArray();
        // Popular brands
        $popularBrands = $invoiceDetails
            ->groupBy(fn($d) => $d->product->merk->id_merk ?? null)
            ->map(fn($g, $id) => [
                'id_brand'       => $id !== null ? (int)$id : null,
                'brand_name'     => $g->first()->product->merk->merk_name ?? null,
                'total_quantity' => $g->sum('quantity'),
            ])
            ->sortByDesc('total_quantity')
            ->values()
            ->toArray();
        // Brand monthly
        $merkMonthly = $invoiceDetails
            ->whereBetween('created_at', [$startOfYear, $endOfYear])
            ->groupBy(fn($d) => Carbon::parse($d->created_at)->format('Y-m'))
            ->map(fn($items, $month) => [
                'month' => $month,
                'merks' => collect($items)
                    ->groupBy(fn($d) => $d->product->merk->id_merk ?? null)
                    ->map(fn($g, $id) => [
                        'id_brand'       => $id,
                        'brand_name'     => $g->first()->product->merk->merk_name ?? null,
                        'total_quantity' => $g->sum('quantity'),
                    ])
                    ->values()
                    ->toArray(),
            ])
            ->values()
            ->toArray();
        return Inertia::render('dashboard', [
            'stats'           => $stats,
            'categories'      => $categoryPurchases,
            'topProducts'     => $topProducts,
            'categoryMonthly' => $categoryMonthly,
            'merkMonthly'     => $merkMonthly,
            'popularBrands'   => $popularBrands,
        ]);
    }
}

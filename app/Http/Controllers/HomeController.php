<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function featuredProducts($limit = 5)
    {
        $products = Product::with(['merk', 'category'])
            ->latest()
            ->limit($limit)
            ->get();

        $products->transform(function ($product) {
            if ($product->image) {
                if (filter_var($product->image, FILTER_VALIDATE_URL)) {
                    $product->image = $product->image;
                } else {
                    $product->image = Storage::url($product->image);
                }
            }
            return $product;
        });
        return $products;
    }

    public function homePage(Request $request)
    {
        $search = $request->query('search', '');
        $user = auth()->user();
        $categories = Category::select('id_category', 'category_name', 'image')->get();
        if ($search) {
            $products = Product::with(['merk', 'category'])
                ->where('name', 'like', "%{$search}%")
                ->latest()
                ->limit(8)
                ->get()
                ->transform(function ($product) {
                    if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
                        $product->image = \Illuminate\Support\Facades\Storage::url($product->image);
                    }
                    return $product;
                });
        } else {
            $products = $this->featuredProducts(8);
        }
        $products = $this->featuredProducts(8);
        if ($user?->hasRole('admin')) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('homepage', ['user' => $user, "products" => $products, "categories" => $categories]);
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
                        'redirect' => route('products.show', ['id' => $p->id_product ?? $p->id]),
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
                    'redirect' => route('products.index',['search' => $q]),
                ];
            }

            return response()->json($products);
        } catch (\Throwable $e) {
            Log::error('Search suggestions error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}

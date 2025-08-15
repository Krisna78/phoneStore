<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
        $q = $request->get('q', '');

        if (trim($q) === '') {
            return response()->json([]);
        }
        $products = Product::with(['brand', 'category'])
            ->where('name', 'like', "%{$q}%")
            ->limit(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'image_url' => $p->image_url,
                    'brand' => $p->brand?->name ?? '-',
                    'category' => $p->category?->name ?? '-',
                ];
            });

        return response()->json($products);
    }
}

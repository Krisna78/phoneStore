<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                    $product->image = \Illuminate\Support\Facades\Storage::url($product->image);
                }
            }
            return $product;
        });
        return $products;
    }

    public function homePage()
    {
        $user = auth()->user();
        $products = $this->featuredProducts(8);
        if ($user?->hasRole('admin')) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('homepage', ['user' => $user, "products" => $products]);
    }
}

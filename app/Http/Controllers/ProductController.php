<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Merk;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['merk', 'category'])->get();
        return Inertia::render("admin/products/product", ["products" => $products]);
    }
    public function featuredProducts($limit = 5)
    {
        $products = Product::with(['merk', 'category'])
            ->latest()
            ->limit($limit)
            ->get();

        $products->transform(function ($product) {
            if ($product->image) {
                $product->image = \Illuminate\Support\Facades\Storage::url($product->image);
            }
            return $product;
        });

        return Inertia::render("admin/products/product", ["products" => $products]);
    }
    public function create()
    {
        $merk = Merk::select('id_merk', 'merk_name')->get();
        $category = Category::select('id_category', 'category_name')->get();
        return Inertia::render('admin/products/add-product', [
            'merk' => $merk,
            'category' => $category,
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ["required", "string"],
            'description' => ["required", "string"],
            'price' => ["required", "numeric"],
            'image' => ["sometimes", "image"],
            'merk_id' => ["required", "exists:merks,id_merk"],
            'category_id' => ["required", "exists:categories,id_category"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = $validator->validated();
        if ($request->hasFile('image')) {
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('products', $fileName, 'public');
            $data['image'] = $path;
        }
        Product::create($data);
        return redirect()->route('product.index')->with('success', "Product berhasil ditambahkan");
    }
    public function edit($id)
    {
        $product = Product::with('merk', 'category')->findOrFail($id);
        $merk = Merk::all();
        $category = Category::all();
        return Inertia::render("admin/products/edit-product", [
            "product" => $product,
            'merk' => $merk,
            'category' => $category,
        ]);
    }
    public function update(Request $request, Product $product, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ["required", "string"],
            'description' => ["required", "string"],
            'price' => ["required", "numeric"],
            'image' => ["sometimes", "image"],
            'merk_id' => ["required", "exists:merks,id_merk"],
            'category_id' => ["required", "exists:categories,id_category"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $product = Product::findOrFail($id);
        $data = $request->only(['name', 'description', 'price', 'merk_id', 'category_id']);

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('products', $fileName, 'public');
            $data['image'] = $path;
        }
        $product->update($data);
        return redirect()->route('product.index')->with('success', "Produk berhasil diperbaharui");
    }
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json([
            'message' => 'Product berhasil dihapus'
        ], 200);
    }
    public function detailProduct($id)
    {
        $product = Product::with('merk', 'category')->findOrFail($id);
        $merk = Merk::select('id_merk', 'merk_name')->get();
        $category = Category::select('id_category', 'category_name')->get();
        return Inertia::render("products/detail-product", [
            "product" => $product,
            'merk' => $merk,
            'category' => $category,
        ]);
    }
}

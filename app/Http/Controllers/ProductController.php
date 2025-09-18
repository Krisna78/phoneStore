<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Merk;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show()
    {
        $product = Product::with(['merk', 'category']);
        return Inertia::render("products/list-product", ['products' => $product]);
    }
    public function index(Request $request)
    {
        $query = Product::with(['merk', 'category']);
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('merk', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('category', function ($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    });
            });
        }
        $products = $query->get();
        $merk = $products->pluck('merk')->filter()->unique('id_merk')->values();
        $category = $products->pluck('category')->filter()->unique('id_category')->values();
        return Inertia::render("admin/products/product", [
            "products" => $products,
            "filters"  => $request->only('search'),
            "merk"     => $merk,
            "category" => $category,
        ]);
    }
    public function featuredProducts($limit = 5)
    {
        $products = Product::with(['merk', 'category'])
            ->latest()
            ->limit($limit)
            ->get();

        $products->transform(function ($product) {
            if ($product->image) {
                $product->image = Storage::url($product->image);
            }
            return $product;
        });

        return Inertia::render("admin/products/product", ["products" => $products]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ["required", "string","unique:products,name"],
            'description' => ["required", "string"],
            'price' => ["required", "numeric"],
            'image' => ["sometimes", "image"],
            'merk_id' => ["required", "exists:merks,id_merk"],
            'category_id' => ["required", "exists:categories,id_category"],
        ],[
            "name.unique" => "Nama Product ini sudah ada"
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
    public function update(Request $request, Product $product, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ["required", "string",Rule::unique("products","name")->ignore($id,"id_product")],
            'description' => ["required", "string"],
            'price' => ["required", "numeric"],
            'image' => ["sometimes", "image"],
            'merk_id' => ["required", "exists:merks,id_merk"],
            'category_id' => ["required", "exists:categories,id_category"],
        ],[
            "name.unique" => "Nama Product ini sudah ada"
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
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('product.index')->with('success', 'Product berhasil dihapus');
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
    public function listProduct($categoryId)
    {
        $products = Product::with(['merk', 'category'])
            ->where('category_id', $categoryId)
            ->get();

        return Inertia::render("products/list-product", [
            "products"   => $products,
            "categoryId" => $categoryId,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $category = Category::all();
        return Inertia::render('admin/categories/category', ['categories' => $category]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => ['required', 'string', "unique:categories,category_name"],
            'image' => ["sometimes", "image"],
        ], [
            'category_name.unique' => 'Kategori dengan nama ini sudah ada.'
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = $validator->validated();
        if ($request->hasFile('image')) {
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('categories', $fileName, 'public');
            $data['image'] = $path;
        }
        Category::create($data);
        return redirect()->route('category.index')
            ->with('success', 'Kategori berhasil ditambahkan');
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => ['required', 'string', "unique:categories,category_name," . $id],
            'image' => ["sometimes", "image"],
        ], [
            'category_name.unique' => `Kategori dengan nama ini sudah ada`,
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $category = Category::findOrFail($id);
        $data = $request->only(['category_name', 'image']);
        if ($request->hasFile('image')) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('categories', $fileName, 'public');
            $data['image'] = $path;
        }
        $category->update($data);
        return redirect()->route('category.index')->with('success', 'Invoice Berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();
        return redirect()->route("category.index")->with("success", "Kategori Berhasil di hapus");
    }
}

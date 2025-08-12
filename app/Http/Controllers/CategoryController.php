<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $category = Category::all();
        return Inertia::render('category.index', ['category' => $category]);
    }
    public function create()
    {
        $category = Category::all();
        return Inertia::render('user.create', ['category' => $category]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => ['required', 'string'],
            'image' => ["required", "image"],
        ]);
        if ($request->hasFile('image')) {
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('categories', $fileName, 'public');
            $data['image'] = $path;
        }
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        Category::create($validator->validated());
        return redirect()->route('user.index')->with('success', 'Kategori berhasil ditambahkan');
    }
    public function edit($id)
    {
        $category = Category::findOrFail($id);
        return Inertia::render('category.edit', ['category' => $category]);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => ['required', 'string'],
            'image' => ["required", "image"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $category = Category::findOrFail($id);
        if ($request->hasFile('image')) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('categories', $fileName, 'public');
            $data['image'] = $path;
        }
        $category->update($validator->validated());
        return redirect()->route('invoice.index')->with('success', 'Invoice Berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return redirect()->route("category.index")->with("success", "Kategori Berhasil di hapus");
    }
}

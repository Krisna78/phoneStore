<?php

namespace App\Http\Controllers;

use App\Models\Merk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MerkController extends Controller
{
    public function index()
    {
        $merk = Merk::all();
        return Inertia::render("merk.index", ["merk" => $merk]);
    }
    public function create()
    {
        $merk = Merk::all();
        return Inertia::render("merk.create", ["merk" => $merk]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "merk_name" => ["required", "string"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        Merk::create($validator->validated());
        return redirect()->route('merk.index')->with("success", "Merk berhasil ditambahkan");
    }
    public function edit($id)
    {
        $merk = Merk::findOrFail($id);
        return Inertia::render("merk.edit", ["merk" => $merk]);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "merk_name" => ["required", "string"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $invoice = Merk::findOrFail($id);
        $invoice->update($validator->validated());
        return redirect()->route('merk.index')->with('success', 'Merk berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $merk = Merk::findOrFail($id);
        $merk->delete();

        return redirect()->route('merk.index')->with('success', 'Merk berhasil dihapus');
    }
}

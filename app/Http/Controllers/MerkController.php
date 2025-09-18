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
        return Inertia::render("admin/merks/merk", ["merks" => $merk]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "merk_name" => ["required", "string","unique:merks,merk_name"],
        ],[
            "merk_name.unique" => "Nama merk ini sudah ada"
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        Merk::create($validator->validated());
        return redirect()->route('merk.index')->with("success", "Merk berhasil ditambahkan");
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "merk_name" => ["required", "string","unique:merks,merk_name,".$id],
        ],[
            "merk_name.unique" => "Nama merk ini sudah ada"
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $merk = Merk::findOrFail($id);
        $merk->update($validator->validated());
        return redirect()->route('merk.index')->with('success', 'Merk berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $merk = Merk::findOrFail($id);
        $merk->delete();

        return redirect()->route('merk.index')->with('success', 'Merk berhasil dihapus');
    }
}

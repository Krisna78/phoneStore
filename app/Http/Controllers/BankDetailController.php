<?php

namespace App\Http\Controllers;

use App\Models\BankDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BankDetailController extends Controller
{
    public function index()
    {
        $bankDetail = BankDetail::all();
        return Inertia::render("bankDetail.index", ["bankDetail" => $bankDetail]);
    }
    public function create()
    {
        $bankDetail = BankDetail::all();
        return Inertia::render("bankDetail.create", ["bankDetail" => $bankDetail]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bank_name' => ["required", "string"],
            "account_number" => ["required", "numeric"],
            "name" => ["required", "string"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        BankDetail::create($validator->validated());
        return redirect()->route('invoice.index')->with('success', "Bank Detail berhasil ditambahkan");
    }
    public function edit($id)
    {
        $bankDetail = BankDetail::findOrFail($id);
        return Inertia::render("bankDetail.edit", ["bankDetail" => $bankDetail]);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'bank_name' => ["required", "string"],
            "account_number" => ["required", "numeric"],
            "name" => ["required", "string"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $bankDetail = BankDetail::findOrFail($id);
        $bankDetail->update($validator->validated());
        return redirect()->route('bankDetail.index')->with('success', 'Bank Detail berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $bankDetail = BankDetail::findOrFail($id);
        $bankDetail->delete();
        return redirect()->route('bankDetail.index')->with('success', 'Bank Detail berhasil dihapus');
    }
}

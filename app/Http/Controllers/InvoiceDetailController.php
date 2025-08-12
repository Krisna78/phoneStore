<?php

namespace App\Http\Controllers;

use App\Models\InvoiceDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class InvoiceDetailController extends Controller
{
    public function index()
    {
        $invoiceDetail = InvoiceDetail::all();
        return Inertia::render("invoiceDetail.index", ["invoiceDetail" => $invoiceDetail]);
    }
    public function create()
    {
        $invoiceDetail = InvoiceDetail::all();
        return Inertia::render("invoiceDetail.create", ["invoiceDetail" => $invoiceDetail]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => ["required", "integer"],
            'line_total' => ["required", "integer"],
            'invoice_id' => ["required", "exists:invoices,id_invoice"],
            'product_id' => ["required", "exists:products,id_product"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        InvoiceDetail::create($request->all());
        return redirect()->route('invoiceDetail.index')->with('success', "Detail Invoice berhasil ditambahkan");
    }
    public function edit($id)
    {
        $invoiceDetail = InvoiceDetail::findOrFail($id);
        return Inertia::render("invoiceDetail.edit", ["invoiceDetail" => $invoiceDetail]);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => ["required", "integer"],
            'line_total' => ["required", "integer"],
            'invoice_id' => ["required", "exists:invoices,id_invoice"],
            'product_id' => ["required", "exists:products,id_product"],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $invoiceDetail = InvoiceDetail::findOrFail($id);
        $invoiceDetail->update($validator->validated());
        return redirect()->route('invoice.index')->with('success', 'Detail Invoice berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $invoiceDetail = InvoiceDetail::findOrFail($id);
        $invoiceDetail->delete;

        return redirect()->route('invoiceDetail.index')->with('success', "Detail Invoice berhasil dihapus");
    }
}

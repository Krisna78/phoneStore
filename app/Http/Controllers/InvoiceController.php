<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;

class InvoiceController extends Controller
{
    var $apiInstance;
    public function index()
    {
        $invoices = Invoice::with(['user', 'invoiceDetail'])->paginate(10);

        return Inertia::render('admin/invoices/invoice', ['invoices']);
    }
    public function create()
    {
        $users = User::all();
        return Inertia::render('admin/invoices/add-invoice', ['users']);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invoice_date' => ['required', 'date'],
            'status' => ['required', 'string'],
            'checkout_link' => ['required', "string"],
            'external_id' => ['required', 'string'],
            'payment_date' => ['required', 'date'],
            'payment_amount' => ['required', 'integer'],
            'user_id' => ['required', 'exists:users,id_user'],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        Invoice::create($validator->validated());
        return redirect()->route('invoice.index')->with('success', 'Invoice berhasil ditambahkan');
    }
    public function edit($id)
    {
       $invoice = Invoice::with(['user', 'invoiceDetail'])->findOrFail($id);
       $users = User::all();
       return view('invoice.edit', compact('invoice', 'users'));
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'invoice_date' => ['required', 'date'],
            'status' => ['required', 'string'],
            'checkout_link' => ['required', "string"],
            'external_id' => ['required', 'string'],
            'payment_date' => ['required', 'date'],
            'payment_amount' => ['required', 'integer'],
            'user_id' => ['required', 'exists:users,id_user'],
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $invoice = Invoice::findOrFail($id);
        $invoice->update($validator->validated());
        return redirect()->route('invoice.index')->with('success', 'Invoice Berhasil diperbaharui');
    }
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return redirect()->route('invoice.index')->with('success', 'Invoice berhasil dihapus');
    }
    var $invoiceApi = null;
    // ! Test For Payment Gateaway Xendit
    public function __construct()
    {
        Configuration::setXenditKey(env('XENDIT_SECRET_KEY'));
        $this->invoiceApi = new InvoiceApi();
    }

    public function createInvoice(Request $request)
    {
        $create_invoice_request = new \Xendit\Invoice\CreateInvoiceRequest([
            'external_id' => (string) Str::uuid(),
            'description' => $request->description,
            'amount' => $request->amount,
            'payer_email' => $request->payer_email,
        ]);
        $result = $this->invoiceApi->createInvoice($create_invoice_request);
        Invoice::create([
            'invoice_date' => now(),
            'status' => $result->getStatus(),
            // 'user_id' => $result->getId(),
            'user_id' => "6e7f47e5-6424-4f98-8530-5e6c660c8f88",
            'external_id' => $result->getExternalId(),
            'checkout_link' => $result->getInvoiceUrl(),
            'payment_date' => now(),
            'payment_amount' => $result->getAmount(),
            'description' => $result->getDescription(),
        ]);
        return response()->json($result);
    }

    public function webhook(Request $request)
    {
        $result = $this->invoiceApi->getInvoices(null, $request->external_id);
        // Ambil invoice dari database
        $payment = Invoice::where('external_id', $request->external_id)->firstOrFail();
        // Kalau sudah dibayar sebelumnya, tidak perlu proses lagi
        if ($payment->status === 'Sudah dibayar') {
            return response()->json("Payment anda telah diproses sebelumnya");
        }
        // Mapping status API ke status di database
        $statusMap = [
            'pending' => 'Pending',
            'settled' => 'Sudah dibayar',
            'paid'    => 'Sudah dibayar',
            'unpaid'  => 'Belum dibayar',
            'failed'  => 'Belum dibayar'
        ];

        $apiStatus = strtolower($result[0]['status']);
        $payment->status = $statusMap[$apiStatus] ?? $payment->status;
        $payment->save();

        return response()->json("Payment anda telah diproses");
    }
}

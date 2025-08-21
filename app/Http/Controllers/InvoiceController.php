<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
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

    public function createInvoicePay(Request $request)
    {
        $auth_id = auth()->id();
        $externalId = (string) Str::uuid();
        $create_invoice_request = new \Xendit\Invoice\CreateInvoiceRequest([
            'external_id' => $externalId,
            'description' => $request->description,
            'amount' => $request->amount,
            'payer_email' => $request->payer_email,
            'success_redirect_url' => route('invoice.receipt', ['external_id' => $externalId]),
            // 'failure_redirect_url' => route('invoice.failed'),
        ]);
        $result = $this->invoiceApi->createInvoice($create_invoice_request);
        $invoice = Invoice::create([
            'invoice_date' => now(),
            'status' => $result->getStatus(),
            'user_id' => $request->user_id ?? $auth_id,
            'external_id' => $externalId,
            'checkout_link' => $result->getInvoiceUrl(),
            'payment_date' => now(),
            'payment_amount' => $result->getAmount(),
            'description' => $result->getDescription(),
        ]);
        InvoiceDetail::create([
            'invoice_id' => $invoice->id_invoice,
            'product_id' => $request->product_id,
            'quantity'   => $request->quantity,
            'line_total' => $request->quantity * $request->price,
        ]);
        return Inertia::location($result->getInvoiceUrl());
    }

    public function createInvoice(Request $request)
    {
        $auth_id = auth()->id();
        $cartItemIds = $request->id_cart_item;
        $cart = Cart::where('user_id',$auth_id)
            ->with(['cartItems' => function ($query) use ($cartItemIds) {
                $query->whereIn('id_cart_item',$cartItemIds)->lockForUpdate();
            }])->firstOrFail();
        $cartItems = $cart->cartItems;
        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Tidak ada barang yang dipilih.');
        }
        $totalAmount = $cartItems->sum(fn($item) => $item->quantity * $item->product->price);
        $externalId = (string) Str::uuid();
        $create_invoice_request = new \Xendit\Invoice\CreateInvoiceRequest([
            'external_id' => $externalId,
            'description' => $request->description,
            'amount' => $totalAmount,
            'payer_email' => $request->payer_email,
            'success_redirect_url' => route('invoice.receipt', ['external_id' => $externalId]),
        ]);
        $result = $this->invoiceApi->createInvoice($create_invoice_request);
        $invoice = Invoice::create([
            'invoice_date' => now(),
            'status' => $result->getStatus(),
            'user_id' => $request->user_id ?? $auth_id,
            'external_id' => $externalId,
            'checkout_link' => $result->getInvoiceUrl(),
            'payment_date' => now(),
            'payment_amount' => $result->getAmount(),
            'description' => $result->getDescription(),
        ]);
        foreach ($cartItems as $item) {
            InvoiceDetail::create([
                'invoice_id' => $invoice->id_invoice,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'line_total' => $item->quantity * $item->product->price,
            ]);
        }
        CartItem::whereIn('id_cart_item', $cartItemIds)->delete();
        return Inertia::location($result->getInvoiceUrl());
    }

    public function webhook(Request $request)
    {
        $result = $this->invoiceApi->getInvoices(null, $request->external_id);
        $payment = Invoice::where('external_id', $request->external_id)->first();
        if (!$payment) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }
        if ($payment->status === 'Sudah dibayar') {
            return response()->json("Payment anda telah diproses sebelumnya");
        }
        $statusMap = [
            'pending' => 'Pending',
            'settled' => 'Sudah dibayar',
            'paid'    => 'Sudah dibayar',
            'unpaid'  => 'Menunggu Pembayaran',
            'failed'  => 'Batal'
        ];
        $apiStatus = strtolower($result[0]['status']);
        $payment->status = $statusMap[$apiStatus] ?? $payment->status;
        $payment->save();
        return response()->json("Payment anda telah diproses");
    }
    public function receipt($external_id)
    {
        $details = InvoiceDetail::with(['product', 'invoice'])
            ->whereRelation('invoice', 'external_id', $external_id)
            ->whereRelation('invoice', 'status', 'Sudah dibayar')
            ->get();
        $invoice = optional($details->first())->invoice
            ?? abort(404, 'Invoice tidak ditemukan');
        $items = $details->map(fn($detail) => [
            'id'        => $detail->id_detail_invoice,
            'name'      => $detail->product->name,
            'image_url' => $detail->product->image,
            'quantity'  => $detail->quantity,
            'price'     => $detail->line_total / max(1, $detail->quantity),
        ]);
        return Inertia::render('invoices/receipt-invoice', [
            'invoice' => array_merge(
                $invoice->only([
                    'invoice_date',
                    'external_id',
                    'description',
                    'status',
                    'payment_amount',
                    'payment_date',
                ]),
                ['items' => $items]
            )
        ]);
    }
}

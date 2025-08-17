<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total produk terjual (dari invoice sudah dibayar)
        $soldProducts = Invoice::where('status', 'Sudah dibayar')
            ->with('items.product')
            ->get()
            ->flatMap->items
            ->groupBy('product_id')
            ->map(function ($items) {
                $product = $items->first()->product;
                $soldQty = $items->sum('quantity');
                return [
                    'name' => $product->name,
                    'sold' => $soldQty,
                    'stock' => $product->stock,
                ];
            })
            ->values();

        // Invoice pending
        $pendingInvoices = Invoice::where('status', 'Pending')->count();

        // Invoice sudah dibayar
        $paidInvoices = Invoice::where('status', 'Sudah dibayar')->count();

        return Inertia::render('Dashboard', [
            'soldProducts' => $soldProducts,
            'pendingInvoices' => $pendingInvoices,
            'paidInvoices' => $paidInvoices,
        ]);
    }
}

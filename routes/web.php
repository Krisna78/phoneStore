<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MerkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', "role:admin"])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');
    Route::controller(ProductController::class)->group(function () {
        Route::get('/product', 'index')->name('product.index');
        Route::post('/product/store', 'store')->name('product.store');
        Route::post('/product/{id}/update', 'update')->name('product.update');
        Route::delete('/product/{id}', 'destroy')->name('product.destroy');
    });
    Route::controller(InvoiceController::class)->group(function () {
        Route::get('/invoice', 'index')->name('invoice.index');
    });
    Route::controller(CategoryController::class)->group(function () {
        Route::get('/category', 'index')->name('category.index');
        Route::post('/category/store', 'store')->name('category.store');
        Route::post("/category/{id}/update", "update")->name('category.update');
        Route::delete("/category/{id}", "destroy")->name('category.destroy');
    });
    Route::controller(MerkController::class)->group(function () {
        Route::get('/merk', 'index')->name('merk.index');
        Route::post('/merk/store', 'store')->name('merk.store');
        Route::post("/merk/{id}/update", "update")->name('merk.update');
        Route::delete("/merk/{id}", "destroy")->name('merk.destroy');
    });
});
Route::get('/', [HomeController::class, 'homePage2'])->name('homepage');
Route::controller(ProductController::class)->group(function () {
    Route::get('/detail_product/{id}', 'detailProduct')->name('products.show.details');
    Route::get('/list_product/{categoryId}', 'listProduct')->name('products.list.categories');
});
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('carts.index');
    Route::post('/cart/add', 'addToCart')->name("carts.add")->middleware('auth');
    Route::delete('/cart/item/{id}', 'destroy')->name('carts.destroy');
    Route::post('/card/update/{id}', 'update')->name('carts.update');
});
Route::controller(InvoiceController::class)->group(function () {
    Route::post('/invoice/create', 'createInvoice')->name('invoice.create');
    Route::post('/invoice/create-pay', 'createInvoicePay')->name('invoice.createPay');
    Route::get('/invoice/receipt/{external_id}', 'receipt')->name('invoice.receipt');
});
Route::controller(CategoryController::class)->group(function () {
    Route::get('/category/{name}', 'index')->name("categories.user.index");
});
Route::get('/products', [HomeController::class, 'index'])->name('products.index');
Route::get('/search-suggestions', [HomeController::class, 'suggestions'])->name('search.suggestions');
Route::middleware(['auth'])->group(function () {
    Route::get('/purchase', [InvoiceController::class, 'purchase'])->name('invoice.purchase');
    Route::post('/invoices/{id}/cancel', [InvoiceController::class, 'cancelInvoice'])->name('invoice.cancel');
});

// Route::get('/homepage2', [HomeController::class, 'homePage2'])->name('homepage2');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

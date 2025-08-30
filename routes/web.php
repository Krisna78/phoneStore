<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth',"role:admin"])->group(function () {
    Route::get('/dashboard',[HomeController::class,'dashboard'])->name('dashboard');
    Route::controller(ProductController::class)->group(function() {
        Route::get('/product','index')->name('product.index');
        Route::get('/product/add','create')->name('product.create');
        Route::post('/product/store','store')->name('product.store');
        Route::get('/product/{id}/edit','edit')->name('product.edit');
        Route::post('/product/{id}/update','update')->name('product.update');
        Route::delete('/product/{id}','destroy')->name('product.destroy');
    });
    Route::controller(InvoiceController::class)->group(function() {
        Route::get('/invoice','index')->name('invoice.index');
        // Route::get('/invoice/add','create')->name('invoice.create');
        // Route::post('/invoice/store','store')->name('invoice.store');
    });
});
Route::get('/',[HomeController::class,'homePage'])->name('homepage');
Route::controller(ProductController::class)->group(function() {
    Route::get('/detail_product/{id}','detailProduct')->name('products.show.details');
    Route::get('/list_product/{categoryId}','listProduct')->name('products.list.categories');
});
Route::controller(CartController::class)->group(function () {
    Route::get('/cart','index')->name('carts.index');
    Route::post('/cart/add', 'addToCart')->name("carts.add")->middleware('auth');
    Route::delete('/cart/item/{id}','destroy')->name('carts.destroy');
    Route::post('/card/update/{id}','update')->name('carts.update');
});
Route::controller(InvoiceController::class)->group(function () {
    Route::post('/invoice/create','createInvoice')->name('invoice.create');
    Route::post('/invoice/create-pay','createInvoicePay')->name('invoice.createPay');
    Route::get('/invoice/receipt/{external_id}', 'receipt')->name('invoice.receipt');
});
Route::controller(CategoryController::class)->group(function () {
    Route::get('/category/{name}','index')->name("categories.user.index");
});
Route::get('/products', [HomeController::class, 'index'])->name('products.index');
Route::get('/search-suggestions', [HomeController::class, 'suggestions'])->name('search.suggestions');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

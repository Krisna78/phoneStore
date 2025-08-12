<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

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
    // Route::get('/invoice/{id}/edit','edit')->name('invoice.edit');
    // Route::put('/invoice/{id}/update','update')->name('invoice.update');
    // Route::delete('/invoice/{id}','destroy')->name('invoice.destroy');
});
Route::get('/',function (){
    return Inertia::render('homepage');
})->name("home");

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

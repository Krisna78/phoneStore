<?php

use App\Http\Controllers\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/invoice/webhook',[InvoiceController::class,'webhook'])->name('invoice.webhook');

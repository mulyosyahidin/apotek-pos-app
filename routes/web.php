<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::post('/cashier', [\App\Http\Controllers\CashierController::class, 'store'])->name('cashier.store');
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{transaction}', [\App\Http\Controllers\ReportController::class, 'show'])->name('reports.show');

    Route::resource('suppliers', \App\Http\Controllers\SupplierController::class)->except('show');
    Route::resource('product-groups', \App\Http\Controllers\ProductGroupController::class)->except('show');
    Route::resource('products', \App\Http\Controllers\ProductController::class);
});

require __DIR__ . '/auth.php';

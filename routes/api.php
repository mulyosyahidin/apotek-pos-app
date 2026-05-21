<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'role:admin,cashier'])->group(function () {
    Route::get('/product-groups/search', [\App\Http\Controllers\API\ProductGroupController::class, 'search'])->name('api.product-groups.search');
    Route::get('/suppliers/search', [\App\Http\Controllers\API\SupplierController::class, 'search'])->name('api.suppliers.search');
    Route::get('/suppliers/{supplier}', [\App\Http\Controllers\API\SupplierController::class, 'show'])->name('api.suppliers.show');
    Route::get('/products/search', [\App\Http\Controllers\API\ProductController::class, 'search'])->name('api.products.search');
});

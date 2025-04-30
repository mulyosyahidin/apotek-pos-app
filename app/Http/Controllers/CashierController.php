<?php

namespace App\Http\Controllers;

use App\Enums\StockTransactionType;
use App\Models\Product;
use App\Models\Product_stock_history;
use App\Models\Transaction;
use Illuminate\Http\Request;

class CashierController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:32',
            'phone_number' => 'nullable|max:16',
            'customer_type' => 'required|string|in:general,medical',
            'payment_type' => 'required|string|in:paid-off',
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ], [
            'name.required' => 'Nama pelanggan tidak boleh kosong',
            'name.string' => 'Nama pelanggan harus berupa teks',
            'name.max' => 'Nama pelanggan maksimal 32 karakter',

            'phone_number.max' => 'Nomor telepon maksimal 16 karakter',

            'customer_type.required' => 'Tipe pelanggan tidak boleh kosong',
            'customer_type.string' => 'Tipe pelanggan harus berupa teks',
            'customer_type.in' => 'Tipe pelanggan harus salah satu dari: general, medical',

            'payment_type.required' => 'Tipe pembayaran tidak boleh kosong',
            'payment_type.string' => 'Tipe pembayaran harus berupa teks',
            'payment_type.in' => 'Tipe pembayaran harus "paid-off"',

            'items.required' => 'Daftar item tidak boleh kosong',
            'items.array' => 'Format items harus berupa array',

            'items.*.id.required' => 'ID produk pada setiap item tidak boleh kosong',
            'items.*.id.integer' => 'ID produk harus berupa angka',
            'items.*.id.exists' => 'Produk dengan ID tersebut tidak ditemukan',

            'items.*.quantity.required' => 'Jumlah item tidak boleh kosong',
            'items.*.quantity.integer' => 'Jumlah item harus berupa angka',
            'items.*.quantity.min' => 'Jumlah item minimal 1',
        ]);

        foreach ($request->items as $item) {
            $getProduct = Product::find($item['id']);

            $currentStock = $getProduct->stock;
            if ($currentStock < $item['quantity']) {
                return redirect()->back()->with('info', 'Stok produk ' . $getProduct->name . ' tidak mencukupi. Stok saat ini: ' . $currentStock);
            }
        }

        $totalPrice = 0;
        $totalItems = 0;

        foreach ($request->items as $item) {
            $productId = $item['id'];
            $product = $this->findProductById($productId);

            $totalPrice += $item['quantity'] * ($request->customer_type === 'general' ? $product->general_sell_price : $product->medical_sell_price);
            $totalItems += $item['quantity'];
        }

        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'date' => now(),
            'customer_name' => $request->name,
            'customer_phone_number' => $request->phone_number,
            'total_price' => $totalPrice,
            'total_items' => $totalItems,
            'payment_type' => $request->payment_type,
            'customer_type' => $request->customer_type,
        ]);

        foreach ($request->items as $item) {
            $productId = $item['id'];
            $product = $this->findProductById($productId);

            $transaction->items()->create([
                'product_id' => $product->id,
                'price' => $request->customer_type === 'general' ? $product->general_sell_price : $product->medical_sell_price,
                'quantity' => $item['quantity'],
                'unit' => $product->unit,
            ]);

            $getProduct = Product::find($productId);

            $beforeStock = $getProduct->stock;
            $afterStock = $getProduct->stock - $item['quantity'];
            $stockChange = $beforeStock - $afterStock;

            Product::where('id', $productId)->update([
                'stock' => $afterStock,
            ]);

            Product_stock_history::create([
                'user_id' => $request->user()->id,
                'product_id' => $productId,
                'transaction_type' => StockTransactionType::SALE->value,
                'action_id' => $transaction->id,
                'stock_before' => $beforeStock,
                'stock_after' => $afterStock,
                'stock_change' => $stockChange,
                'description' => 'User ' . $request->user()->name . ' melakukan penjualan',
            ]);
        }

        return redirect()->back()->with('success', 'Berhasil menambah transaksi');
    }

    private function findProductById($productId)
    {
        if (\Cache::has('product-' . $productId)) {
            return \Cache::get('product-' . $productId);
        }

        $product = Product::findOrFail($productId);

        \Cache::put('product-' . $productId, $product, now()->addDay());

        return $product;
    }
}

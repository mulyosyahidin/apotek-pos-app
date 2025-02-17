<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;

class CashierController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:32',
            'phone_number' => 'nullable|max:16',
            'customer_type' => 'required|string|in:general',
            'payment_type' => 'required|string|in:paid-off',
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $totalPrice = 0;
        $totalItems = 0;

        foreach ($request->items as $item) {
            $productId = $item['id'];
            $product = $this->findProductById($productId);

            $totalPrice += $item['quantity'] * $product->general_sell_price;
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
                'price' => $product->general_sell_price,
                'quantity' => $item['quantity'],
                'unit' => $product->unit,
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

<?php

namespace App\Http\Controllers\API;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|min:1|max:100'
        ]);

        $search = $request->input('search');

        if (!$search) {
            return response()->json([]);
        }

        $productGroups = Product::where('name', 'like', "%$search%")
            ->where('status', ProductStatus::ACTIVE->value)
            ->select(['id', 'name', 'unit', 'general_sell_price', 'medical_sell_price', 'stock', 'expire_date'])
            ->limit(10)
            ->get();

        return response()->json($productGroups);
    }
}

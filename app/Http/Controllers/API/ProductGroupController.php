<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product_group;
use Illuminate\Http\Request;

class ProductGroupController extends Controller
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

        $productGroups = Product_group::where('name', 'like', "%$search%")
            ->select(['id', 'name', 'category'])
            ->limit(10)
            ->get();

        return response()->json($productGroups);
    }
}

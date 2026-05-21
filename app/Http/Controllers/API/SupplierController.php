<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|min:1|max:100',
        ]);

        $search = $request->input('search');

        if (! $search) {
            return response()->json([]);
        }

        $productGroups = Supplier::where('name', 'like', "%$search%")
            ->select(['id', 'name'])
            ->limit(10)
            ->get();

        return response()->json($productGroups);
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier);
    }
}

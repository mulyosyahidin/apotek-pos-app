<?php

namespace App\Http\Controllers;

use App\Enums\ProductGroupCategory;
use App\Models\Product_group;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $searchQuery = request('search');
        $perPage = request('per_page', 10);

        $productGroups = Product_group::when($searchQuery, function ($query, $searchQuery) {
            return $query->where('name', 'LIKE', '%'.$searchQuery.'%');
        })
            ->paginate($perPage);

        return Inertia::render('ProductGroups/Index', [
            'items' => $productGroups->items(),
            'meta' => [
                'current_page' => $productGroups->currentPage(),
                'total_pages' => $productGroups->lastPage(),
                'per_page' => $productGroups->perPage(),
                'total_items' => $productGroups->total(),
            ],
            'success' => session('success'),
            'searchQuery' => $searchQuery,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = ProductGroupCategory::array();

        return Inertia::render('ProductGroups/Create', [
            'categories' => $categories,
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:64',
            'category' => 'nullable|string|in:'.implode(',', ProductGroupCategory::values()),
        ], [
            'name.required' => 'Nama tidak boleh kosong',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 64 karakter',

            'category.string' => 'Kategori harus berupa teks',
            'category.in' => 'Kategori yang dipilih tidak valid',
        ]);

        Product_group::create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data grup produk');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product_group $product_group)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product_group $product_group)
    {
        $categories = ProductGroupCategory::array();

        return Inertia::render('ProductGroups/Edit', [
            'productGroup' => $product_group,
            'categories' => $categories,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product_group $product_group)
    {
        $request->validate([
            'name' => 'required|string|max:64',
            'category' => 'nullable|string|in:'.implode(',', ProductGroupCategory::values()),
        ], [
            'name.required' => 'Nama grup produk tidak boleh kosong',
            'name.string' => 'Nama grup produk harus berupa teks',
            'name.max' => 'Nama grup produk maksimal 64 karakter',

            'category.string' => 'Kategori harus berupa teks',
            'category.in' => 'Kategori yang dipilih tidak valid',
        ]);

        $product_group->update($request->all());

        return redirect()->back()->with('success', 'Berhasil memperbarui data grup produk');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product_group $product_group)
    {
        $product_group->delete();

        return redirect()->back()->with('success', 'Berhasil menghapus data grup produk');
    }
}

<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Enums\ProductType;
use App\Enums\ProductUnit;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $searchQuery = request('search');
        $perPage = request('per_page', 10);

        $products = Product::when($searchQuery, function ($query, $searchQuery) {
            return $query->where('name', 'LIKE', '%' . $searchQuery . '%');
        })
            ->with('productGroup', 'supplier')
            ->paginate($perPage);

        return Inertia::render('Products/Index', [
            'items' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'total_pages' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total_items' => $products->total(),
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
        $suppliers = Supplier::all();
        $productTypes = ProductType::array();
        $productStatuses = ProductStatus::array();
        $productUnits = ProductUnit::array();

        return Inertia::render('Products/Create', [
            'suppliers' => $suppliers,
            'productTypes' => $productTypes,
            'productStatuses' => $productStatuses,
            'productUnits' => $productUnits,
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'batch_number' => 'required|string|max:20|unique:products,batch_number',
            'pbf_number' => 'required|string|max:64|unique:products,pbf_number',
            'barcode_content' => 'nullable|string|max:64|unique:products,barcode_content',
            'name' => 'nullable|string|max:64',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|in:' . implode(',', \App\Enums\ProductUnit::values()),
            'type' => 'required|string|in:' . implode(',', \App\Enums\ProductType::values()),
            'expire_date' => 'nullable|date|after:today',
            'status' => 'required|string|in:' . implode(',', \App\Enums\ProductStatus::values()),
            'purchase_price' => 'required|numeric|min:0',
            'general_sell_price' => 'required|numeric|min:0',
            'medical_sell_price' => 'required|numeric|min:0',
            'supplier_id' => 'required|exists:suppliers,id',
            'product_group_id' => 'required|exists:product_groups,id',
        ], [
            'batch_number.required' => 'Batch number tidak boleh kosong',
            'batch_number.string' => 'Batch number harus berupa teks',
            'batch_number.max' => 'Batch number maksimal 20 karakter',
            'batch_number.unique' => 'Batch number sudah digunakan',

            'pbf_number.required' => 'Nomor PBF tidak boleh kosong',
            'pbf_number.string' => 'Nomor PBF harus berupa teks',
            'pbf_number.max' => 'Nomor PBF maksimal 64 karakter',
            'pbf_number.unique' => 'Nomor PBF sudah digunakan produk lain, gunakan PBF yang unik / berbeda',

            'barcode_content.string' => 'Isi barcode harus berupa teks',
            'barcode_content.max' => 'Isi barcode maksimal 64 karakter',
            'barcode_content.unique' => 'Isi barcode sudah digunakan, gunakan isi barcode yang unik / berbeda',

            'name.string' => 'Nama produk harus berupa teks',
            'name.max' => 'Nama produk maksimal 64 karakter',

            'stock.required' => 'Stok tidak boleh kosong',
            'stock.integer' => 'Stok harus berupa angka bulat',
            'stock.min' => 'Stok minimal 0',

            'unit.required' => 'Satuan produk tidak boleh kosong',
            'unit.string' => 'Satuan produk harus berupa teks',
            'unit.in' => 'Satuan produk tidak valid',

            'type.required' => 'Tipe produk tidak boleh kosong',
            'type.string' => 'Tipe produk harus berupa teks',
            'type.in' => 'Tipe produk tidak valid',

            'expire_date.date' => 'Tanggal kadaluarsa harus berupa tanggal yang valid',
            'expire_date.after' => 'Tanggal kadaluarsa harus setelah hari ini',

            'status.required' => 'Status tidak boleh kosong',
            'status.string' => 'Status harus berupa teks',
            'status.in' => 'Status tidak valid',

            'purchase_price.required' => 'Harga beli tidak boleh kosong',
            'purchase_price.numeric' => 'Harga beli harus berupa angka',
            'purchase_price.min' => 'Harga beli minimal 0',

            'general_sell_price.required' => 'Harga jual umum tidak boleh kosong',
            'general_sell_price.numeric' => 'Harga jual umum harus berupa angka',
            'general_sell_price.min' => 'Harga jual umum minimal 0',

            'medical_sell_price.required' => 'Harga jual medis tidak boleh kosong',
            'medical_sell_price.numeric' => 'Harga jual medis harus berupa angka',
            'medical_sell_price.min' => 'Harga jual medis minimal 0',

            'supplier_id.required' => 'Supplier tidak boleh kosong',
            'supplier_id.exists' => 'Supplier tidak ditemukan di database',

            'product_group_id.required' => 'Grup produk tidak boleh kosong',
            'product_group_id.exists' => 'Grup produk tidak ditemukan di database',
        ]);

        Product::create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data produk');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('supplier', 'productGroup');

        return Inertia::render('Products/Show', [
            'product' => $product,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load('supplier', 'productGroup');

        $suppliers = Supplier::all();
        $productTypes = ProductType::array();
        $productStatuses = ProductStatus::array();
        $productUnits = ProductUnit::array();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'suppliers' => $suppliers,
            'productTypes' => $productTypes,
            'productStatuses' => $productStatuses,
            'productUnits' => $productUnits,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'batch_number' => 'required|string|max:20|unique:products,batch_number,' . $product->id,
            'pbf_number' => 'required|string|max:64|unique:products,pbf_number,' . $product->id,
            'barcode_content' => 'nullable|string|max:64|unique:products,barcode_content,' . $product->id,
            'name' => 'nullable|string|max:64',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|in:' . implode(',', \App\Enums\ProductUnit::values()),
            'type' => 'required|string|in:' . implode(',', \App\Enums\ProductType::values()),
            'expire_date' => 'nullable|date|after:today',
            'status' => 'required|string|in:' . implode(',', \App\Enums\ProductStatus::values()),
            'purchase_price' => 'required|numeric|min:0',
            'general_sell_price' => 'required|numeric|min:0',
            'medical_sell_price' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'product_group_id' => 'nullable|exists:product_groups,id',
        ], [
            'batch_number.required' => 'Batch number tidak boleh kosong',
            'batch_number.string' => 'Batch number harus berupa teks',
            'batch_number.max' => 'Batch number maksimal 20 karakter',
            'batch_number.unique' => 'Batch number sudah digunakan',

            'pbf_number.required' => 'Nomor PBF tidak boleh kosong',
            'pbf_number.string' => 'Nomor PBF harus berupa teks',
            'pbf_number.max' => 'Nomor PBF maksimal 64 karakter',
            'pbf_number.unique' => 'Nomor PBF sudah digunakan produk lain, gunakan PBF yang unik / berbeda',

            'barcode_content.string' => 'Isi barcode harus berupa teks',
            'barcode_content.max' => 'Isi barcode maksimal 64 karakter',
            'barcode_content.unique' => 'Isi barcode sudah digunakan produk lain, gunakan isi barcode yang unik / berbeda',

            'name.string' => 'Nama produk harus berupa teks',
            'name.max' => 'Nama produk maksimal 64 karakter',

            'stock.required' => 'Stok tidak boleh kosong',
            'stock.integer' => 'Stok harus berupa angka bulat',
            'stock.min' => 'Stok minimal 0',

            'unit.required' => 'Satuan produk tidak boleh kosong',
            'unit.string' => 'Satuan produk harus berupa teks',
            'unit.in' => 'Satuan produk tidak valid',

            'type.required' => 'Tipe produk tidak boleh kosong',
            'type.string' => 'Tipe produk harus berupa teks',
            'type.in' => 'Tipe produk tidak valid',

            'expire_date.date' => 'Tanggal kadaluarsa harus berupa tanggal yang valid',
            'expire_date.after' => 'Tanggal kadaluarsa harus setelah hari ini',

            'status.required' => 'Status tidak boleh kosong',
            'status.string' => 'Status harus berupa teks',
            'status.in' => 'Status tidak valid',

            'purchase_price.required' => 'Harga beli tidak boleh kosong',
            'purchase_price.numeric' => 'Harga beli harus berupa angka',
            'purchase_price.min' => 'Harga beli minimal 0',

            'general_sell_price.required' => 'Harga jual umum tidak boleh kosong',
            'general_sell_price.numeric' => 'Harga jual umum harus berupa angka',
            'general_sell_price.min' => 'Harga jual umum minimal 0',

            'medical_sell_price.required' => 'Harga jual medis tidak boleh kosong',
            'medical_sell_price.numeric' => 'Harga jual medis harus berupa angka',
            'medical_sell_price.min' => 'Harga jual medis minimal 0',

            'supplier_id.exists' => 'Supplier tidak ditemukan',
            'product_group_id.exists' => 'Grup produk tidak ditemukan',
        ]);

        $data = $request->all();

        $data['supplier_id'] = $data['supplier_id'] ?? $product->supplier_id;
        $data['product_group_id'] = $data['product_group_id'] ?? $product->product_group_id;

        $product->update($data);

        \Cache::forget('product-' . $product->id);

        return redirect()->back()->with('success', 'Berhasil memperbarui data produk');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Berhasil menghapus produk');
    }
}

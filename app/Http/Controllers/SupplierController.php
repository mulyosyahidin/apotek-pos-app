<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Regency;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $searchQuery = request('search');

        $suppliers = Supplier::with('province', 'regency')
            ->when($searchQuery, function ($query, $searchQuery) {
                return $query->where(function ($q) use ($searchQuery) {
                    $q->where('name', 'LIKE', '%' . $searchQuery . '%')
                        ->orWhereHas('province', function ($q) use ($searchQuery) {
                            $q->where('name', 'LIKE', '%' . $searchQuery . '%');
                        })
                        ->orWhereHas('regency', function ($q) use ($searchQuery) {
                            $q->where('name', 'LIKE', '%' . $searchQuery . '%');
                        });
                });
            })
            ->paginate();

        return Inertia::render('Suppliers/Index', [
            'items' => $suppliers->items(),
            'meta' => [
                'current_page' => $suppliers->currentPage(),
                'total_pages' => $suppliers->lastPage(),
                'per_page' => $suppliers->perPage(),
                'total_items' => $suppliers->total(),
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
        $provinces = Province::all();
        $regencies = Regency::all();

        return Inertia::render('Suppliers/Create', [
            'provinces' => $provinces,
            'regencies' => $regencies,
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:96',
            'address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:16',
            'email' => 'nullable|string|email|max:100',
            'province_id' => 'nullable|exists:provinces,id',
            'regency_id' => 'nullable|exists:regencies,id',
        ], [
            'name.required' => 'Nama tidak boleh kosong',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 96 karakter',

            'address.string' => 'Alamat harus berupa teks',
            'address.max' => 'Alamat maksimal 255 karakter',

            'phone_number.string' => 'Nomor telepon harus berupa teks',
            'phone_number.max' => 'Nomor telepon maksimal 16 karakter',

            'email.string' => 'Email harus berupa teks',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 100 karakter',

            'province_id.exists' => 'Provinsi tidak ditemukan di database',
            'regency_id.exists' => 'Kabupaten/Kota tidak ditemukan di database',
        ]);

        Supplier::create($request->all());

        return redirect()->route('suppliers.create')->with('success', 'Berhasil menambah data supplier');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        $provinces = Province::all();
        $regencies = Regency::all();

        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name' => 'required|string|max:96',
            'address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:16',
            'email' => 'nullable|string|email|max:100',
            'province_id' => 'nullable|exists:provinces,id',
            'regency_id' => 'nullable|exists:regencies,id',
        ], [
            'name.required' => 'Nama tidak boleh kosong',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 96 karakter',

            'address.string' => 'Alamat harus berupa teks',
            'address.max' => 'Alamat maksimal 255 karakter',

            'phone_number.string' => 'Nomor telepon harus berupa teks',
            'phone_number.max' => 'Nomor telepon maksimal 16 karakter',

            'email.string' => 'Email harus berupa teks',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 100 karakter',

            'province_id.exists' => 'Provinsi tidak ditemukan',
            'regency_id.exists' => 'Kabupaten/Kota tidak ditemukan',
        ]);

        $supplier->update($request->all());

        return redirect()->route('suppliers.edit', $supplier)->with('success', 'Berhasil memperbarui data supplier');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('suppliers.index')->with('success', 'Berhasil menghapus data supplier');
    }
}

<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class CashierUserController extends Controller
{
    /**
     * Display a listing of cashier users.
     */
    public function index()
    {
        $searchQuery = request('search');

        $cashiers = User::query()
            ->where('role', UserRole::CASHIER->value)
            ->when($searchQuery, function ($query, $searchQuery) {
                $query->where(function ($query) use ($searchQuery) {
                    $query->where('name', 'LIKE', '%'.$searchQuery.'%')
                        ->orWhere('email', 'LIKE', '%'.$searchQuery.'%');
                });
            })
            ->latest()
            ->paginate();

        return Inertia::render('Cashiers/Index', [
            'items' => $cashiers->items(),
            'meta' => [
                'current_page' => $cashiers->currentPage(),
                'total_pages' => $cashiers->lastPage(),
                'per_page' => $cashiers->perPage(),
                'total_items' => $cashiers->total(),
            ],
            'success' => session('success'),
            'searchQuery' => $searchQuery,
        ]);
    }

    /**
     * Show the form for creating a cashier user.
     */
    public function create()
    {
        return Inertia::render('Cashiers/Create', [
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created cashier user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'name.required' => 'Nama tidak boleh kosong',
            'email.required' => 'Email tidak boleh kosong',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'password.required' => 'Password tidak boleh kosong',
            'password.confirmed' => 'Konfirmasi password tidak sesuai',
        ]);

        User::create([
            ...$validated,
            'role' => UserRole::CASHIER,
        ]);

        return redirect()->route('cashiers.create')->with('success', 'Berhasil menambah data kasir');
    }

    /**
     * Display the specified cashier user.
     */
    public function show(User $cashier)
    {
        abort_unless($cashier->role === UserRole::CASHIER, 404);

        return Inertia::render('Cashiers/Show', [
            'cashier' => $cashier,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified cashier user.
     */
    public function edit(User $cashier)
    {
        abort_unless($cashier->role === UserRole::CASHIER, 404);

        return Inertia::render('Cashiers/Edit', [
            'cashier' => $cashier,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified cashier user in storage.
     */
    public function update(Request $request, User $cashier)
    {
        abort_unless($cashier->role === UserRole::CASHIER, 404);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$cashier->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ], [
            'name.required' => 'Nama tidak boleh kosong',
            'email.required' => 'Email tidak boleh kosong',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'password.confirmed' => 'Konfirmasi password tidak sesuai',
        ]);

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $cashier->update([
            ...$validated,
            'role' => UserRole::CASHIER,
        ]);

        return redirect()->route('cashiers.edit', $cashier)->with('success', 'Berhasil memperbarui data kasir');
    }
}

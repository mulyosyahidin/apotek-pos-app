<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $time = $request->get('time');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $searchQuery = $request->get('search');

        // time
        // 1: hari ini
        // 2: minggu ini
        // 3: bulan ini
        // 4: tahun ini
        // 5: semua
        // 6: custom

        $query = Transaction::query();

        if ($time == "1") {
            $query->whereBetween('date', [Carbon::today()->startOfDay(), Carbon::today()->endOfDay()]);
        } elseif ($time == "2") {
            $query->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        } elseif ($time == "3") {
            $query->whereBetween('date', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()]);
        } elseif ($time == "4") {
            $query->whereBetween('date', [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()]);
        } elseif ($time == "6") {
            if ($startDate && $endDate) {
                $query->whereBetween('date', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ]);
            }
        } elseif ($time == "7") {
            $query->whereBetween('date', [Carbon::yesterday()->startOfDay(), Carbon::yesterday()->endOfDay()]);
        }

        $totalSales = $query->sum('total_price');
        $reports = $query
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where('customer_name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('customer_phone_number', 'like', '%' . $searchQuery . '%');
            })
            ->with('cashier')
            ->latest()
            ->paginate($perPage);

        $timeAsText = match ($time) {
            '1' => 'Hari Ini ('. Carbon::now()->format('d/m/Y') . ')',
            '2' => 'Minggu Ini ('. Carbon::now()->startOfWeek()->format('d/m/Y') . ' - ' . Carbon::now()->endOfWeek()->format('d/m/Y') . ')',
            '3' => 'Bulan Ini ('. Carbon::now()->startOfMonth()->format('d/m/Y') . ' - ' . Carbon::now()->endOfMonth()->format('d/m/Y') . ')',
            '4' => 'Tahun Ini ('. Carbon::now()->startOfYear()->format('d/m/Y') . ' - ' . Carbon::now()->endOfYear()->format('d/m/Y') . ')',
            '5' => 'Semua Waktu',
            '6' => Carbon::parse($startDate)->format('d/m/Y') . ' - ' . Carbon::parse($endDate)->format('d/m/Y'),
            '7' => 'Kemarin ('. Carbon::yesterday()->format('d/m/Y') . ')',
            default => 'Semua Waktu',
        };

        return Inertia::render('Reports/Index', [
            'time' => $time,
            'defaultStartDate' => $startDate,
            'defaultEndDate' => $endDate,
            'totalSales' => $totalSales,
            'items' => $reports->items(),
            'meta' => [
                'current_page' => $reports->currentPage(),
                'total_pages' => $reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total_items' => $reports->total(),
            ],
            'timeAsText' => $timeAsText,
            'searchQuery' => $searchQuery,
            'defaultPerPage' => $perPage,
        ]);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load('items.product', 'cashier');

        return Inertia::render('Reports/Show', [
            'transaction' => $transaction,
        ]);
    }
}

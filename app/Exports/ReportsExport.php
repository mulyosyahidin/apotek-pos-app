<?php

namespace App\Exports;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ReportsExport implements FromQuery, WithHeadings, WithMapping
{
    private int $rowNumber = 0;

    public function __construct(private readonly Builder $query) {}

    public function query(): Builder
    {
        return $this->query;
    }

    public function headings(): array
    {
        return [
            '#',
            'Customer',
            'Total',
            'Tanggal',
            'Kasir',
            'Status Bayar',
        ];
    }

    /**
     * @param  \App\Models\Transaction  $report
     */
    public function map($report): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $report->customer_name,
            (float) $report->total_price,
            Carbon::parse($report->date)->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            $report->cashier?->name,
            match ($report->payment_type) {
                'paid-off' => 'Lunas',
                'debt' => 'Hutang',
                default => 'Tidak Diketahui',
            },
        ];
    }
}

import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    ArrowDownTrayIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/Components/Catalyst/button';
import { Heading } from '@/Components/Catalyst/heading';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/Catalyst/table';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDateWithTime } from '@/utils.js';

const statusClassName = (status) => {
    switch (status) {
        case 'completed':
            return 'text-green-600 dark:text-green-400';
        case 'failed':
            return 'text-red-600 dark:text-red-400';
        case 'processing':
            return 'text-blue-600 dark:text-blue-400';
        default:
            return 'text-amber-600 dark:text-amber-400';
    }
};

export default function BackupsIndex({
    items,
    hasInProgress,
    success,
    error,
}) {
    useEffect(() => {
        if (!hasInProgress) {
            return undefined;
        }

        const intervalId = setInterval(() => {
            router.reload({ only: ['items', 'hasInProgress', 'success', 'error'] });
        }, 3000);

        return () => clearInterval(intervalId);
    }, [hasInProgress]);

    const handleCreateBackup = () => {
        router.post(route('backups.store'));
    };

    return (
        <>
            <Head title="Backup Data" />

            <AdminLayout>
                <div className="flex items-center justify-between">
                    <Heading>Backup Data</Heading>
                    <Button
                        onClick={handleCreateBackup}
                        disabled={hasInProgress}
                        className="cursor-pointer"
                    >
                        {hasInProgress ? 'Sedang Backup...' : 'Buat Backup'}
                    </Button>
                </div>

                {success && (
                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    Backup dijalankan di latar belakang. Setiap backup baru akan
                    menggantikan backup lama.
                </p>

                {items.length > 0 ? (
                    <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                        <TableHead>
                            <TableRow>
                                <TableHeader>#</TableHeader>
                                <TableHeader>Tanggal</TableHeader>
                                <TableHeader>Nama File</TableHeader>
                                <TableHeader>Ukuran File</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader className="text-right">
                                    Download
                                </TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.number}</TableCell>
                                    <TableCell className="text-zinc-500 dark:text-zinc-400">
                                        {formatDateWithTime(item.created_at)}
                                    </TableCell>
                                    <TableCell className="text-zinc-500 dark:text-zinc-400">
                                        {item.filename}
                                    </TableCell>
                                    <TableCell className="text-zinc-500 dark:text-zinc-400">
                                        {item.file_size_label ?? '-'}
                                    </TableCell>
                                    <TableCell
                                        className={statusClassName(item.status)}
                                    >
                                        {item.status_label}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.can_download ? (
                                            <Button
                                                outline
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    window.location.href =
                                                        route(
                                                            'backups.download',
                                                            item.id,
                                                        );
                                                }}
                                            >
                                                <ArrowDownTrayIcon />
                                                Download
                                            </Button>
                                        ) : (
                                            <span className="text-sm text-zinc-400 dark:text-zinc-500">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="mt-10 border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:bg-yellow-950/40">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon
                                    aria-hidden="true"
                                    className="h-5 w-5 text-yellow-400"
                                />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                    <strong>Belum ada backup.</strong>
                                    <br />
                                    Klik tombol Buat Backup untuk membuat
                                    cadangan database.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

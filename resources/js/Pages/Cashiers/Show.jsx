import { Head } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';
import { Button } from '@/Components/Catalyst/button';
import { Heading } from '@/Components/Catalyst/heading';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/Components/Catalyst/table';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CashiersShow({ cashier, success }) {
    return (
        <>
            <Head title={cashier.name} />

            <AdminLayout>
                <BackButton link={route('cashiers.index')} />

                <Heading className="mt-8">Detail Kasir</Heading>

                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow>
                            <TableCell>Nama</TableCell>
                            <TableCell>
                                <strong>{cashier.name}</strong>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>
                                <strong>{cashier.email}</strong>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Role</TableCell>
                            <TableCell>
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/30">
                                    Kasir
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="mt-5 flex justify-end">
                    <Button
                        href={route('cashiers.edit', cashier.id)}
                        outline
                        size="small"
                        className="cursor-pointer"
                    >
                        Edit
                    </Button>
                </div>
            </AdminLayout>
        </>
    );
}

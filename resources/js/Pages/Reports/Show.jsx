import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import { Heading, Subheading } from '@/Components/Catalyst/heading';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/Catalyst/table';
import {
    formatDateWithTime,
    formatRupiah,
    transactionCustomerType,
    transactionPaymentType,
} from '@/utils.js';
import { useEffect } from 'react';

export default function TransactionShow({ transaction }) {
    useEffect(() => {
        console.log(transaction);
    }, []);
    return (
        <>
            <Head title="Laporan Penjualan" />

            <AdminLayout>
                <BackButton link={route('reports.index')} />

                <Heading className={'mt-8'}>Laporan Penjualan</Heading>

                <Table className="mb-10 mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Nama Pelanggan</TableCell>
                            <TableCell>
                                <strong>{transaction.customer_name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>No. HP Pelanggan</TableCell>
                            <TableCell>
                                <strong>
                                    {transaction.customer_phone_number ?? '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Waktu Transaksi</TableCell>
                            <TableCell>
                                <strong>
                                    {formatDateWithTime(transaction.date)}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={4}>
                            <TableCell>Kasir</TableCell>
                            <TableCell>
                                <strong>{transaction.cashier.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={5}>
                            <TableCell>Total Transaksi</TableCell>
                            <TableCell>
                                <strong>
                                    {formatRupiah(transaction.total_price)}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={6}>
                            <TableCell>Total Items</TableCell>
                            <TableCell>
                                <strong>{transaction.total_items}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={7}>
                            <TableCell>Pembayaran</TableCell>
                            <TableCell>
                                <strong>
                                    {transactionPaymentType(
                                        transaction.payment_type,
                                    )}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={8}>
                            <TableCell>Jenis Pelanggan</TableCell>
                            <TableCell>
                                <strong>
                                    {transactionCustomerType(
                                        transaction.customer_type,
                                    )}
                                </strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Subheading>Items</Subheading>
                <Table className="[--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Produk</TableHeader>
                            <TableHeader>Harga</TableHeader>
                            <TableHeader>Jumlah</TableHeader>
                            <TableHeader>Sub Total</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transaction.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>
                                    {formatRupiah(item.price)}
                                </TableCell>
                                <TableCell>
                                    {item.quantity} {item.unit}
                                </TableCell>
                                <TableCell>
                                    {formatRupiah(item.price * item.quantity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AdminLayout>
        </>
    );
}

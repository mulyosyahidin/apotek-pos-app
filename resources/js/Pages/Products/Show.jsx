import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import { Heading } from '@/Components/Catalyst/heading';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@/Components/Catalyst/table';
import { formatDate, formatRupiah } from '@/utils.js';
import { Button } from '@/Components/Catalyst/button';
import { useMemo, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogTitle,
} from '@/Components/Catalyst/dialog';
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
} from '@/Components/Catalyst/pagination';

export default function ProductShow({ product, stockHistories, success }) {
    const { delete: destroy, processing } = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const paginationPages = useMemo(() => {
        const totalPages = stockHistories.meta.total_pages;
        const currentPage = stockHistories.meta.current_page;
        const pages = [];

        const lowerBound = Math.max(1, currentPage - 3);
        const upperBound = Math.min(totalPages, currentPage + 3);

        for (let page = lowerBound; page <= upperBound; page++) {
            pages.push({
                page,
                isCurrent: currentPage === page,
            });
        }

        return pages;
    }, [stockHistories.meta]);

    const handleDelete = () => {
        destroy(route('products.destroy', product.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={product.name} />

            <AdminLayout>
                <BackButton link={route('products.index')} />

                <Heading className={'mt-8'}>Data Produk</Heading>

                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Nama</TableCell>
                            <TableCell>
                                <strong>{product.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Barang Utama</TableCell>
                            <TableCell>
                                <strong>
                                    {product.product_group
                                        ? `${product.product_group.name} (${product.product_group.category})`
                                        : '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>No. Batch</TableCell>
                            <TableCell>
                                <strong>{product.batch_number ?? '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={4}>
                            <TableCell>No. PBF</TableCell>
                            <TableCell>
                                <strong>{product.pbf_number ?? '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={5}>
                            <TableCell>Barcode</TableCell>
                            <TableCell>
                                <strong>
                                    {product.barcode_content ?? '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={6}>
                            <TableCell>Satuan</TableCell>
                            <TableCell>
                                <strong>{product.unit}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={7}>
                            <TableCell>Stok</TableCell>
                            <TableCell>
                                <strong>{product.stock}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={8}>
                            <TableCell>Jenis</TableCell>
                            <TableCell>
                                <strong>{product.type ?? '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={9}>
                            <TableCell>Tanggal Kadaluarsa</TableCell>
                            <TableCell>
                                <strong>
                                    {product.expire_date
                                        ? formatDate(product.expire_date)
                                        : '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={10}>
                            <TableCell>Supplier</TableCell>
                            <TableCell>
                                <strong>
                                    {product.supplier
                                        ? product.supplier.name
                                        : '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={11}>
                            <TableCell>Status Jual</TableCell>
                            <TableCell>
                                {product.status === 'active' ? (
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/30">
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-200 dark:ring-yellow-500/30">
                                        Tidak Aktif
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>

                        <TableRow key={12}>
                            <TableCell>Harga Beli</TableCell>
                            <TableCell>
                                <strong>
                                    {product.purchase_price
                                        ? formatRupiah(product.purchase_price)
                                        : '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={13}>
                            <TableCell>Harga Jual Umum</TableCell>
                            <TableCell>
                                <strong>
                                    {product.general_sell_price
                                        ? formatRupiah(
                                              product.general_sell_price,
                                          )
                                        : '-'}
                                </strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={14}>
                            <TableCell>Harga Jual Medis</TableCell>
                            <TableCell>
                                <strong>
                                    {product.medical_sell_price
                                        ? formatRupiah(
                                              product.medical_sell_price,
                                          )
                                        : '-'}
                                </strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="mt-5 flex justify-end gap-1">
                    <Button
                        href={route('products.edit', product.id)}
                        size="small"
                        outline
                        className={'cursor-pointer'}
                    >
                        Edit
                    </Button>
                    <Button
                        color="rose"
                        size="small"
                        outline
                        className={'cursor-pointer'}
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

                <Heading className={'mt-8'}>Riwayat Stok</Heading>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Stok Sebelumnya</TableCell>
                            <TableCell>Stok Baru</TableCell>
                            <TableCell>Perubahan</TableCell>
                            <TableCell>Keterangan</TableCell>
                            <TableCell>Tanggal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stockHistories.items.length > 0 ? (
                            stockHistories.items.map((history, index) => (
                                <TableRow key={history.id}>
                                    <TableCell>
                                        {(stockHistories.meta.current_page -
                                            1) *
                                            stockHistories.meta.per_page +
                                            index +
                                            1}
                                    </TableCell>
                                    <TableCell>{history.user.name}</TableCell>
                                    <TableCell>
                                        {history.stock_before}
                                    </TableCell>
                                    <TableCell>{history.stock_after}</TableCell>
                                    <TableCell>{history.stock_after}</TableCell>
                                    <TableCell>{history.description}</TableCell>
                                    <TableCell>
                                        {formatDate(history.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Tidak ada riwayat stok
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {stockHistories.meta.total_items >
                    stockHistories.meta.per_page && (
                    <Pagination className="mt-6">
                        <PaginationPrevious
                            href={
                                stockHistories.meta.current_page > 1
                                    ? `?stock_page=${stockHistories.meta.current_page - 1}`
                                    : null
                            }
                        />
                        <PaginationList>
                            {paginationPages.map(({ page, isCurrent }) => (
                                <PaginationPage
                                    key={page}
                                    href={`?stock_page=${page}`}
                                    current={isCurrent}
                                >
                                    {page}
                                </PaginationPage>
                            ))}
                        </PaginationList>
                        <PaginationNext
                            href={
                                stockHistories.meta.current_page <
                                stockHistories.meta.total_pages
                                    ? `?stock_page=${stockHistories.meta.current_page + 1}`
                                    : null
                            }
                        />
                    </Pagination>
                )}
            </AdminLayout>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <DialogTitle>Hapus Produk?</DialogTitle>
                <DialogBody>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Yakin ingin menghapus produk ini? Tindakan ini tidak
                        dapat dibatalkan!
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        color={'rose'}
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Catalyst/button';
import { Heading } from '@/Components/Catalyst/heading';
import { Input } from '@/Components/Catalyst/input';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline/index.js';
import { useEffect, useMemo, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/Catalyst/table';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid/index.js';
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
import { productGroupCategory } from '@/utils.js';

export default function ProductGroupsIndex({
    items,
    meta,
    success,
    searchQuery,
}) {
    const [search, setSearch] = useState(searchQuery ?? '');
    const [perPage, setPerPage] = useState(meta.per_page);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialPerPage =
            Number(urlParams.get('per_page')) || meta.per_page;
        setPerPage(initialPerPage);
    }, []);

    const performSearch = (perPage = 10) => {
        const queryParams = { search, per_page: perPage };

        router.get(route('product-groups.index', queryParams));
    };

    // pagination: start
    const paginationPages = useMemo(() => {
        const totalPages = meta.total_pages;
        const currentPage = meta.current_page;
        const pages = [];

        const lowerBound = Math.max(1, currentPage - 3);
        const upperBound = Math.min(totalPages, currentPage + 3);

        for (let page = lowerBound; page <= upperBound; page++) {
            pages.push({
                page: page - 1,
                isCurrent: currentPage === page,
            });
        }

        return pages;
    }, [meta]);

    const handlePageChange = (page, search, perPage) => {
        const queryParams = { page, search, per_page: perPage };
        router.get(route('product-groups.index', queryParams));
    };
    // pagination: end

    // delete action: start
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        router.delete(route('product-groups.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };
    // delete action: end

    return (
        <>
            <Head title="Grup Produk" />

            <AdminLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola Grup Produk</Heading>
                    </div>
                    <Button
                        href={route('product-groups.create')}
                        className="cursor-pointer"
                    >
                        Tambah
                    </Button>
                </div>

                {success && (
                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                {items.length > 0 && (
                    <>
                        <div className="mt-5 flex items-center gap-2">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    performSearch(Number(e.target.value));
                                }}
                                className="h-10 w-20 rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white dark:*:bg-zinc-800 dark:*:text-white"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <div></div>
                            <Input
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={'Cari grup produk'}
                                value={search}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        performSearch(perPage);
                                    }
                                }}
                            />

                            <Button
                                onClick={() => performSearch(perPage)}
                                className={'h-10 cursor-pointer'}
                            >
                                <MagnifyingGlassIcon className={'h-5 w-5'} />
                            </Button>
                        </div>

                        <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                            <TableHead>
                                <TableRow>
                                    <TableHeader>#</TableHeader>
                                    <TableHeader>Nama</TableHeader>
                                    <TableHeader>Kategori</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader></TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => {
                                    const itemsPerPage = meta.per_page;
                                    const startIndex =
                                        (meta.current_page - 1) * itemsPerPage;

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {startIndex + index + 1}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 dark:text-zinc-400">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 dark:text-zinc-400">
                                                {productGroupCategory(
                                                    item.category,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 dark:text-zinc-400">
                                                {item.status === 'active' ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/30">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-200 dark:ring-yellow-500/30">
                                                        Tidak Aktif
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-1">
                                                <Button
                                                    outline={true}
                                                    href={route(
                                                        'product-groups.edit',
                                                        item.id,
                                                    )}
                                                    size="small"
                                                    className="cursor-pointer"
                                                >
                                                    <PencilSquareIcon />
                                                </Button>
                                                <Button
                                                    outline={true}
                                                    size="small"
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {meta.total_items > meta.per_page && (
                            <Pagination className="mt-6">
                                <PaginationPrevious
                                    href={
                                        meta.current_page > 1
                                            ? `?page=${meta.current_page - 1}&search=${search}&per_page=${perPage}`
                                            : null
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            meta.current_page - 1,
                                            search,
                                            perPage,
                                        )
                                    }
                                />
                                <PaginationList>
                                    {paginationPages.map(
                                        ({ page, isCurrent }) => (
                                            <PaginationPage
                                                key={page}
                                                href={`?page=${page + 1}&search=${search}&per_page=${perPage}`}
                                                current={isCurrent}
                                                onClick={() =>
                                                    handlePageChange(
                                                        page + 1,
                                                        search,
                                                        perPage,
                                                    )
                                                }
                                            >
                                                {page + 1}
                                            </PaginationPage>
                                        ),
                                    )}
                                </PaginationList>
                                <PaginationNext
                                    href={
                                        meta.current_page < meta.total_pages
                                            ? `?page=${meta.current_page + 1}&search=${search}&per_page=${perPage}`
                                            : null
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            meta.current_page + 1,
                                            search,
                                            perPage,
                                        )
                                    }
                                />
                            </Pagination>
                        )}
                    </>
                )}

                {items.length === 0 && (
                    <div className="mt-20 border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:bg-yellow-950/40">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon
                                    aria-hidden="true"
                                    className="h-5 w-5 text-yellow-400"
                                />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                    <strong>Belum ada data.</strong>
                                    <br />
                                    Anda belum menambahkan data grup produk.
                                    Silahkan tambahkan data dengan klik tombol "
                                    <strong>Tambah</strong>"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <DialogTitle>Hapus Grup Produk?</DialogTitle>
                <DialogBody>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Yakin ingin menghapus grup produk ini? Semua produk
                        dalam grup ini juga akan dihapus. Tindakan ini tidak
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

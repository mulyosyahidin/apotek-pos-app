import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid/index.js';
import {
    EyeIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline/index.js';
import { Button } from '@/Components/Catalyst/button';
import { Heading } from '@/Components/Catalyst/heading';
import { Input } from '@/Components/Catalyst/input';
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
} from '@/Components/Catalyst/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/Catalyst/table';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CashiersIndex({ items, meta, success, searchQuery }) {
    const [search, setSearch] = useState(searchQuery ?? '');
    const [perPage] = useState(meta.per_page);

    const performSearch = () => {
        router.get(route('cashiers.index', { search }));
    };

    const paginationPages = useMemo(() => {
        const totalPages = meta.total_pages;
        const currentPage = meta.current_page;
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
    }, [meta]);

    return (
        <>
            <Head title="Kasir" />

            <AdminLayout>
                <div className="flex items-center justify-between">
                    <Heading>Kelola Kasir</Heading>
                    <Button
                        href={route('cashiers.create')}
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
                        <div className="mt-5 flex gap-2">
                            <Input
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kasir"
                                value={search}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        performSearch();
                                    }
                                }}
                            />
                            <Button
                                onClick={performSearch}
                                className="cursor-pointer"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                            </Button>
                        </div>

                        <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                            <TableHead>
                                <TableRow>
                                    <TableHeader>#</TableHeader>
                                    <TableHeader>Nama</TableHeader>
                                    <TableHeader>Email</TableHeader>
                                    <TableHeader></TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => {
                                    const startIndex =
                                        (meta.current_page - 1) * meta.per_page;

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {startIndex + index + 1}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 dark:text-zinc-400">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 dark:text-zinc-400">
                                                {item.email}
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-1">
                                                <Button
                                                    outline
                                                    href={route(
                                                        'cashiers.show',
                                                        item.id,
                                                    )}
                                                    size="small"
                                                    className="cursor-pointer"
                                                >
                                                    <EyeIcon />
                                                </Button>
                                                <Button
                                                    outline
                                                    href={route(
                                                        'cashiers.edit',
                                                        item.id,
                                                    )}
                                                    size="small"
                                                    className="cursor-pointer"
                                                >
                                                    <PencilSquareIcon />
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
                                />
                                <PaginationList>
                                    {paginationPages.map(
                                        ({ page, isCurrent }) => (
                                            <PaginationPage
                                                key={page}
                                                href={`?page=${page}&search=${search}&per_page=${perPage}`}
                                                current={isCurrent}
                                            >
                                                {page}
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
                                    Anda belum menambahkan data kasir. Silahkan
                                    tambahkan data dengan klik tombol "
                                    <strong>Tambah</strong>"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

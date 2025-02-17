import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {Button} from "@/Components/Catalyst/button";
import {Heading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import {EyeIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline/index.js";
import {useEffect, useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {formatDate, formatRupiah, limitText} from "@/utils.js";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination";

export default function ProductsIndex({items, meta, success, searchQuery}) {
    const [filteredItems, setFilteredItems] = useState(items);
    const [search, setSearch] = useState(searchQuery ?? '');
    const [perPage, setPerPage] = useState(meta.per_page);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialPerPage = Number(urlParams.get('per_page')) || meta.per_page;
        setPerPage(initialPerPage);
    }, []);

    const performSearch = (perPage = 10) => {
        const queryParams = {search, per_page: perPage};

        router.get(route('products.index', queryParams), {
            onSuccess: (response) => {
                setFilteredItems(response.props.items);
            }
        });
    };

    // pagination: start
    const [currentPage, setCurrentPage] = useState(meta.current_page);

    const paginationPages = useMemo(() => {
        const totalPages = meta.total_pages;
        const currentPage = meta.current_page;
        const pages = [];

        const lowerBound = Math.max(1, currentPage - 3);
        const upperBound = Math.min(totalPages, currentPage + 3);

        for (let page = lowerBound; page <= upperBound; page++) {
            pages.push({
                page: page - 1,
                isCurrent: currentPage === page
            });
        }

        return pages;
    }, [meta]);

    const handlePageChange = (page, search, perPage) => {
        const queryParams = {page, search, per_page: perPage};
        router.get(route('products.index', queryParams), {
            onSuccess: (response) => {
                setFilteredItems(response.props.items);
            }
        });
    };
    // pagination: end

    // delete action: start
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = () => {
        router.delete(route('products.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    }
    // delete action: end

    return (
        <>
            <Head title="Produk"/>

            <AdminLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola Produk</Heading>
                    </div>
                    <Button href={route('products.create')} className="cursor-pointer">
                        Tambah
                    </Button>
                </div>

                {success && (
                    <div className="mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                {
                    items.length > 0 && (
                        <>
                            <div className='mt-5 flex gap-2 items-center'>
                                <select
                                    value={perPage}
                                    onChange={(e) => {
                                        setPerPage(Number(e.target.value));
                                        performSearch(Number(e.target.value));
                                    }}
                                    className="border border-gray-300 rounded-md p-2 w-20 h-10"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <div></div>
                                <Input
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={'Cari produk'}
                                    value={search}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            performSearch(perPage);
                                        }
                                    }}
                                />

                                <Button onClick={() => performSearch(perPage)} className={'cursor-pointer h-10'}>
                                    <MagnifyingGlassIcon className={'w-5 h-5'}/>
                                </Button>
                            </div>

                            <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>#</TableHeader>
                                        <TableHeader>No. Batch</TableHeader>
                                        <TableHeader>Nama</TableHeader>
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader>Stock</TableHeader>
                                        <TableHeader>Harga Beli</TableHeader>
                                        <TableHeader>Harga Jual Umum</TableHeader>
                                        <TableHeader>Harga Jual Medis</TableHeader>
                                        <TableHeader>Tanggal Kadaluarsa</TableHeader>
                                        <TableHeader></TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => {
                                        const itemsPerPage = meta.per_page;
                                        const startIndex = (meta.current_page - 1) * itemsPerPage;

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{startIndex + index + 1}</TableCell>
                                                <TableCell className="text-zinc-500">{item.batch_number ? limitText(item.batch_number, 12) : '-'}</TableCell>
                                                <TableCell className="text-zinc-500">{item.name ? limitText(item.name, 20) : ''}</TableCell>
                                                <TableCell className="text-zinc-500">
                                                    {
                                                        item.status === 'active' ? (
                                                            <span
                                                                className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Aktif</span>
                                                        ) : (
                                                            <span
                                                                className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Tidak Aktif</span>
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell className="text-zinc-500">{item.stock}</TableCell>
                                                <TableCell className="text-zinc-500">{formatRupiah(item.purchase_price)}</TableCell>
                                                <TableCell className="text-zinc-500">{formatRupiah(item.medical_sell_price)}</TableCell>
                                                <TableCell className="text-zinc-500">{item.expire_date ? formatDate(item.expire_date) : '-'}</TableCell>
                                                <TableCell className="flex justify-end gap-1">
                                                    <Button
                                                        outline={true}
                                                        href={route('products.show', item.id)}
                                                        size="small"
                                                        className="cursor-pointer"
                                                    >
                                                        <EyeIcon/>
                                                    </Button>
                                                    <Button
                                                        outline={true}
                                                        href={route('products.edit', item.id)}
                                                        size="small"
                                                        className="cursor-pointer"
                                                    >
                                                        <PencilSquareIcon/>
                                                    </Button>
                                                    <Button
                                                        outline={true}
                                                        size="small"
                                                        className="cursor-pointer text-red-500"
                                                        onClick={() => handleOpenDeleteDialog(item.id)}
                                                    >
                                                        <TrashIcon/>
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
                                        href={meta.current_page > 1 ? `?page=${meta.current_page - 1}&search=${search}&per_page=${perPage}` : null}
                                        onClick={() => handlePageChange(meta.current_page - 1, search, perPage)}
                                    />
                                    <PaginationList>
                                        {paginationPages.map(({page, isCurrent}) => (
                                            <PaginationPage
                                                key={page}
                                                href={`?page=${page + 1}&search=${search}&per_page=${perPage}`}
                                                current={isCurrent}
                                                onClick={() => handlePageChange(page + 1, search, perPage)}
                                            >
                                                {page + 1}
                                            </PaginationPage>
                                        ))}
                                    </PaginationList>
                                    <PaginationNext
                                        href={meta.current_page < meta.total_pages ? `?page=${meta.current_page + 1}&search=${search}&per_page=${perPage}` : null}
                                        onClick={() => handlePageChange(meta.current_page + 1, search, perPage)}
                                    />
                                </Pagination>
                            )}
                        </>
                    )
                }

                {
                    items.length === 0 && (
                        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mt-20">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-yellow-400"/>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Belum ada data.</strong>
                                        <br/>
                                        Anda belum menambahkan data produk. Silahkan tambahkan data dengan klik tombol
                                        "<strong>Tambah</strong>"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </AdminLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Produk?</DialogTitle>
                <DialogBody>
                    <p>Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan!</p>
                </DialogBody>
                <DialogActions>
                    <Button plain className="cursor-pointer" onClick={() => setIsDeleteDialogOpen(false)}>
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

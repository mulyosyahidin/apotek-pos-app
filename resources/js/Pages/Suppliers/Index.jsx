import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {Heading} from "@/Components/Catalyst/heading.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import {MagnifyingGlassIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table.jsx";
import {ExclamationTriangleIcon} from "@heroicons/react/20/solid/index.js";
import {limitText} from "@/utils.js";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog.jsx";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination.jsx";

export default function SuppliersIndex({items, meta, success, searchQuery}) {
    const [filteredItems, setFilteredItems] = useState(items);
    const [search, setSearch] = useState(searchQuery ?? '');

    const performSearch = () => {
        router.get(route('suppliers.index', {search}), {
            onSuccess: (response) => {
                setFilteredItems(response.props.items);
            }
        });
    };

    // delete action: start
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = () => {
        router.delete(route('suppliers.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    }
    // delete action: end

    const [perPage, setPerPage] = useState(meta.per_page);

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
        router.get(route('suppliers.index', queryParams), {
            onSuccess: (response) => {
                setFilteredItems(response.props.items);
            }
        });
    };
    // pagination: end

    return (
        <>
            <Head title="Suppliers"/>

            <AdminLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola Supplier</Heading>
                    </div>
                    <Button href={route('suppliers.create')} className="cursor-pointer">
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
                            <div className='mt-5 flex gap-2'>
                                <Input
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={'Cari supplier'}
                                    value={search}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            performSearch();
                                        }
                                    }}
                                />
                                <Button onClick={performSearch} className={'cursor-pointer'}>
                                    <MagnifyingGlassIcon className={'w-5 h-5'}/>
                                </Button>
                            </div>

                            <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>#</TableHeader>
                                        <TableHeader>Nama</TableHeader>
                                        <TableHeader>No. HP</TableHeader>
                                        <TableHeader>Email</TableHeader>
                                        <TableHeader>Alamat</TableHeader>
                                        <TableHeader>Provinsi / Kabupaten</TableHeader>
                                        <TableHeader>Status</TableHeader>
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
                                                <TableCell className="text-zinc-500">{item.name}</TableCell>
                                                <TableCell className="text-zinc-500">{item.phone_number ?? '-'}</TableCell>
                                                <TableCell className="text-zinc-500">{item.email ?? '-'}</TableCell>
                                                <TableCell
                                                    className="text-zinc-500">{item.address ? limitText(item.address, 16) : '-'}</TableCell>
                                                <TableCell className="text-zinc-500">
                                                    {item.province?.name || item.regency?.name ? (
                                                        <>
                                                            {item.province?.name} {item.province && item.regency && '/'} {item.regency?.name}
                                                        </>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className="text-zinc-500 text-center">
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
                                                <TableCell className="flex justify-end gap-1">
                                                    <Button
                                                        outline={true}
                                                        href={route('suppliers.edit', item.id)}
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
                                        Anda belum menambahkan data supplier. Silahkan tambahkan data dengan klik tombol
                                        "<strong>Tambah</strong>"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </AdminLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Supplier?</DialogTitle>
                <DialogBody>
                    <p>Yakin ingin menghapus supplier ini? Semua produk yang berasal dari supplier ini akan ditandai
                        sebagai "<b>Tanpa Supplier</b>". Tindakan ini tidak dapat dibatalkan!</p>
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

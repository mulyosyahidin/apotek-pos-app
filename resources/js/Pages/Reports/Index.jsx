import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {
    ExclamationTriangleIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon, TrashIcon
} from "@heroicons/react/24/outline/index.js";
import {useEffect, useMemo, useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {formatDate, formatRupiah, limitText, formatDateWithTime} from "@/utils.js";
import {Input} from "@/Components/Catalyst/input.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table.jsx";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination.jsx";

export default function ReportsIndex({time, defaultStartDate, defaultEndDate, totalSales, timeAsText, items, meta, searchQuery, defaultPerPage}) {
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(time);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    const [filteredItems, setFilteredItems] = useState(items);
    const [perPage, setPerPage] = useState(meta.per_page);
    const [search, setSearch] = useState(searchQuery ?? '');

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleFilterSubmit = () => {
        if (selectedTime === "6" && (!startDate || !endDate)) {
            alert("Mohon pilih rentang tanggal dengan benar");

            return;
        }

        if (selectedTime === "6" && new Date(startDate) > new Date(endDate)) {
            alert("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");

            return;
        }

        const params = {
            time: selectedTime,
        };

        if (selectedTime === "6") {
            params.start_date = startDate;
            params.end_date = endDate;
        }

        if (perPage != defaultPerPage) {
            params.per_page = perPage;
        }

        if (search) {
            params.search = search;
        }

        router.visit(route('reports.index', params));
    };

    const performSearch = (perPage = 10) => {
        const queryParams = {
            search: search,
        };

        if (perPage != defaultPerPage) {
            queryParams.per_page = perPage;
        }

        if (selectedTime) {
            queryParams.time = selectedTime;
        }

        if (selectedTime == 6 && startDate) {
            queryParams.start_date = startDate;
        }

        if (selectedTime == 6 && endDate) {
            queryParams.end_date = endDate
        }

        router.get(route('reports.index', queryParams), {
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
        router.get(route('reports.index', queryParams), {
            onSuccess: (response) => {
                setFilteredItems(response.props.items);
            }
        });
    };
    // pagination: end

    return (
        <>
            <Head title="Laporan"/>
            <AdminLayout>
                <div className="flex justify-between">
                    <Heading>Laporan Penjualan</Heading>

                    <a href="#" onClick={() => setIsFilterDialogOpen(true)}>
                        <FunnelIcon className="h-6 w-6 text-gray-500"/>
                    </a>
                </div>

                <div className="mt-8 mb-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    <tr key="1">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            Waktu
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                                            {timeAsText}
                                        </td>
                                    </tr>
                                    <tr key="2">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            Total Penjualan
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                                            {formatRupiah(totalSales)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

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
                                    placeholder={'Cari penjualan'}
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
                                        <TableHeader>Customer</TableHeader>
                                        <TableHeader>Total</TableHeader>
                                        <TableHeader>Tanggal</TableHeader>
                                        <TableHeader>Kasir</TableHeader>
                                        <TableHeader>Status Bayar</TableHeader>
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
                                                <TableCell className="text-zinc-500">{item.customer_name}</TableCell>
                                                <TableCell className="text-zinc-500">{formatRupiah(item.total_price)}</TableCell>
                                                <TableCell className="text-zinc-500">{formatDateWithTime(item.date)}</TableCell>
                                                <TableCell className="text-zinc-500">{item.cashier.name}</TableCell>
                                                <TableCell className="text-zinc-500">{item.payment_type}</TableCell>
                                                <TableCell className="flex justify-end gap-1">
                                                    <Button
                                                        outline={true}
                                                        href={route('reports.show', item.id)}
                                                        size="small"
                                                        className="cursor-pointer"
                                                    >
                                                        <EyeIcon/>
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
                        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mt-10">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-yellow-400"/>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Belum ada data.</strong>
                                        <br/>
                                        Belum ada data penjualan sampai saat ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </AdminLayout>

            <Dialog open={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}>
                <DialogTitle>Filter Laporan</DialogTitle>
                <DialogBody>
                    <p className="mb-5">Tanggal Hari Ini: {new Date().toLocaleDateString()}</p>
                    <div>
                        <Subheading className="mb-2">Waktu Laporan</Subheading>
                        <select
                            name="time"
                            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={selectedTime}
                            onChange={handleTimeChange}
                        >
                            <option value="">Pilih Waktu</option>
                            <option value="1">Hari Ini</option>
                            <option value="7">Kemarin</option>
                            <option value="2">Minggu Ini</option>
                            <option value="3">Bulan Ini</option>
                            <option value="4">Tahun Ini</option>
                            <option value="5">Semua</option>
                            <option value="6">Rentang Tanggal Khusus</option>
                        </select>
                    </div>

                    {selectedTime === "6" && (
                        <div className="mt-4">
                            <Subheading className="mb-2">Rentang Tanggal</Subheading>
                            <div className="flex space-x-4">
                                <div className="w-full">
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogActions>
                    <Button plain className="cursor-pointer" onClick={() => setIsFilterDialogOpen(false)}>
                        Batal
                    </Button>
                    <Button color={"blue"} className="cursor-pointer" onClick={handleFilterSubmit}
                            disabled={!selectedTime}>
                        Tampilkan
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

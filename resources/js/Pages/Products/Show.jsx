import {Head, useForm} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {formatDate, formatRupiah} from "@/utils.js";
import {Button} from "@/Components/Catalyst/button";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";

export default function ProductShow({product, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        destroy(route('products.destroy', product.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={product.name}/>

            <AdminLayout>
                <BackButton link={route('products.index')}/>

                <Heading className={'mt-8'}>Data Produk</Heading>

                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
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
                                <strong>{product.product_group ? `${product.product_group.name} (${product.product_group.category})` : '-'}</strong>
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
                                <strong>{product.barcode_content ?? '-'}</strong>
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
                                <strong>{product.expire_date ? formatDate(product.expire_date) : '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={10}>
                            <TableCell>Supplier</TableCell>
                            <TableCell>
                                <strong>{product.supplier ? product.supplier.name : '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={11}>
                            <TableCell>Status Jual</TableCell>
                            <TableCell>
                                {
                                    product.status === 'active' ? (
                                        <span
                                            className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Aktif</span>
                                    ) : (
                                        <span
                                            className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Tidak Aktif</span>
                                    )
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow key={12}>
                            <TableCell>Harga Beli</TableCell>
                            <TableCell>
                                <strong>{product.purchase_price ? formatRupiah(product.purchase_price) : '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={13}>
                            <TableCell>Harga Jual Umum</TableCell>
                            <TableCell>
                                <strong>{product.general_sell_price ? formatRupiah(product.general_sell_price) : '-'}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={14}>
                            <TableCell>Harga Jual Medis</TableCell>
                            <TableCell>
                                <strong>{product.medical_sell_price ? formatRupiah(product.medical_sell_price) : '-'}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
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
    )
}

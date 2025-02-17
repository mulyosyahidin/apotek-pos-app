import {Head, useForm} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BackButton from "@/Components/BackButton";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Divider} from "@/Components/Catalyst/divider";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {Button} from "@/Components/Catalyst/button";
import ProductGroupSelect from "@/Pages/Products/Components/ProductGroupSelect";
import SupplierSelect from "@/Pages/Products/Components/SupplierSelect";
import {useRef} from "react";

export default function ProductEdit({product, productUnits, productTypes, productStatuses, suppliers, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        batch_number: product.batch_number,
        pbf_number: product.pbf_number,
        barcode_content: product.barcode_content,
        name: product.name,
        stock: product.stock,
        unit: product.unit,
        type: product.type,
        expire_date: product.expire_date,
        status: product.status,
        purchase_price: product.purchase_price,
        general_sell_price: product.general_sell_price,
        medical_sell_price: product.medical_sell_price,
        supplier_id: product.supplier_id,
        product_group_id: product.product_group_id,
    });

    const supplierSelectRef = useRef(null);
    const productGroupSelectRef = useRef(null);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const submit = (e) => {
        e.preventDefault();

        put(route('products.update', product.id), {
            onSuccess: () => {
                if (supplierSelectRef.current) {
                    supplierSelectRef.current.reset();
                }

                if (productGroupSelectRef.current) {
                    productGroupSelectRef.current.reset();
                }
            },
        });
    }

    return (
        <>
            <Head title="Edit Produk"/>

            <AdminLayout>
                <div>
                    <BackButton link={route('products.index')}/>

                    <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                        <Heading>Edit Baru</Heading>

                        {success && (
                            <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                                {success}
                            </div>
                        )}
                        <Divider className="my-10 mt-6"/>

                        <section className="grid sm:grid-cols-2 gap-x-8">
                            <div className="space-y-5">
                                <div>
                                    <Subheading className="mb-2">Batch Number</Subheading>
                                    <Input name="batch_number" value={data.batch_number}
                                           onChange={handleChange}/>
                                    <InputError message={errors.batch_number} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">PBF Number</Subheading>
                                    <Input name="pbf_number" value={data.pbf_number}
                                           onChange={handleChange}/>
                                    <InputError message={errors.pbf_number} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Barcode Content</Subheading>
                                    <Input name="barcode_content" value={data.barcode_content}
                                           onChange={handleChange}/>
                                    <InputError message={errors.barcode_content} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Nama Barang</Subheading>
                                    <Input name="name" value={data.name}
                                           onChange={handleChange}/>
                                    <InputError message={errors.name} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading>Barang Utama</Subheading>
                                    {product.product_group.name || "Tidak ada"}

                                    <div className="mt-2">
                                        <ProductGroupSelect
                                            ref={productGroupSelectRef}
                                            value={data.product_group_id}
                                            onChange={(id) => setData("product_group_id", id)}
                                        />

                                        <small className="block mt-2 text-sm text-gray-500">Cari nama barang utama baru jika ingin mengganti barang utama.</small>
                                    </div>

                                    <InputError message={errors.product_group_id} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading>Supplier</Subheading>
                                    {product.supplier.name || "Tidak ada"}

                                    <div className="mt-2">
                                        <SupplierSelect
                                            ref={supplierSelectRef}
                                            value={data.supplier_id}
                                            onChange={(id) => setData("supplier_id", id)}
                                        />

                                        <small className="block mt-2 text-sm text-gray-500">Cari nama supplier baru jika ingin mengganti supplier.</small>
                                    </div>

                                    <InputError message={errors.supplier_id} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Stock</Subheading>
                                    <Input type="number" name="stock" value={data.stock}
                                           onChange={handleChange}/>
                                    <InputError message={errors.stock} className="mt-2"/>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <Subheading className="mb-2">Jenis</Subheading>
                                    <select
                                        name="type"
                                        value={data.type}
                                        onChange={handleChange}
                                        className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Pilih Jenis</option>
                                        {Object.entries(productTypes).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.type} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Satuan</Subheading>
                                    <select
                                        name="unit"
                                        value={data.unit}
                                        onChange={handleChange}
                                        className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Pilih Satuan</option>
                                        {Object.entries(productUnits).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.unit} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Expire</Subheading>
                                    <Input type="date" name="expire_date" value={data.expire_date}
                                           onChange={handleChange}/>
                                    <InputError message={errors.expire_date} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Status Jual</Subheading>
                                    <select
                                        name="unit"
                                        value={data.status}
                                        onChange={handleChange}
                                        className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Pilih Status Jual</option>
                                        {Object.entries(productStatuses).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Harga Beli</Subheading>
                                    <Input name="purchase_price" value={data.purchase_price}
                                           onChange={handleChange}/>
                                    <InputError message={errors.purchase_price} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Harga Jual (Umum)</Subheading>
                                    <Input name="general_sell_price" value={data.general_sell_price}
                                           onChange={handleChange}/>
                                    <InputError message={errors.general_sell_price} className="mt-2"/>
                                </div>

                                <div>
                                    <Subheading className="mb-2">Harga Jual (Medis)</Subheading>
                                    <Input name="medical_sell_price" value={data.medical_sell_price}
                                           onChange={handleChange}/>
                                    <InputError message={errors.medical_sell_price} className="mt-2"/>
                                </div>
                            </div>
                        </section>

                        <Divider className="my-10" soft/>

                        <div className="flex justify-end gap-4">
                            {
                                processing ? (
                                    <Button type="submit" className={'cursor-not-allowed'} disabled>Simpan</Button>
                                ) : (
                                    <Button type="submit" className={'cursor-pointer'}>Simpan</Button>
                                )
                            }
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    )
}

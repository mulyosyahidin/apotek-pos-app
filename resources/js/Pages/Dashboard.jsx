import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {Divider} from "@/Components/Catalyst/divider.jsx";
import {useEffect, useRef, useState} from "react";
import {formatRupiah} from "@/utils.js";
import {BanknotesIcon, EnvelopeIcon, PhoneIcon, UserIcon, UsersIcon} from "@heroicons/react/24/outline/index.js";
import ProductSelect from "@/Pages/Dashboard/Components/ProductSelect.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import InputError from "@/Components/InputError.jsx";
import SweetAlert2 from "react-sweetalert2";

export default function Dashboard({success}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        phone_number: '',
        payment_type: 'paid-off',
        customer_type: 'general',
        items: [],
    });

    const [swalProps, setSwalProps] = useState({});

    const productSelectRef = useRef(null);

    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [tempProduct, setTempProduct] = useState(null);
    const [tempQuantity, setTempQuantity] = useState(1);

    const [pay, setPay] = useState(0);
    const [cashback, setCashback] = useState(0);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleAddItem = () => {
        if (!tempProduct || tempQuantity <= 0) return;

        const existingIndex = items.findIndex(item => item.id === tempProduct.id);

        let updatedItems;
        if (existingIndex !== -1) {
            updatedItems = items.map((item, index) =>
                index === existingIndex
                    ? {
                        ...item,
                        quantity: Number(item.quantity) + Number(tempQuantity),
                        subtotal: (Number(item.quantity) + Number(tempQuantity)) * Number(item.price)
                    }
                    : item
            );
        } else {
            const newItem = {
                id: tempProduct.id,
                unit: tempProduct.unit,
                product: tempProduct.name,
                quantity: Number(tempQuantity),
                price: Number(tempProduct.general_sell_price),
                subtotal: Number(tempQuantity) * Number(tempProduct.general_sell_price),
            };

            updatedItems = [...items, newItem];
        }

        setItems(updatedItems);
        setData(prevData => ({...prevData, items: updatedItems}));

        setTotal(updatedItems.reduce((sum, item) => sum + item.subtotal, 0));

        if (productSelectRef.current) {
            productSelectRef.current.reset();
        }

        setTempQuantity(1);
    };

    const handleRemoveItem = (index) => {
        const removedItem = items[index];
        const updatedItems = items.filter((_, i) => i !== index);

        setItems(updatedItems);
        setData(prevData => ({...prevData, items: updatedItems}));
        setTotal(prevTotal => prevTotal - removedItem.subtotal);
    };

    const handlePayChange = (e) => {
        let value = e.target.value;

        if (value.startsWith('0') && value.length > 1) {
            value = value.replace(/^0+/, '');
        }

        value = value === '' ? '' : Number(value);

        setPay(value);

        setCashback(value >= total ? value - total : 0);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('cashier.store'), {
            onSuccess: () => {
                reset();

                setItems([]);
                setTotal(0);
                setTempProduct(null);
                setTempQuantity(1);
                setCashback(0);
                setPay(0);

                if (productSelectRef.current) {
                    productSelectRef.current.reset();
                }

                setSwalProps({
                    show: true,
                    title: 'Berhasil!',
                    text: 'Berhasil menambah transaksi',
                    icon: 'success',
                });
            },
        });
    };

    return (
        <>
            <Head title="Dashboard"/>

            <AdminLayout>
                <Heading>KASIR</Heading>

                <Divider className="my-10" soft/>

                <form method="post" onSubmit={submit}>
                    <section className="grid sm:grid-cols-2 gap-x-8">
                        <div></div>
                        <div>
                            <div className="flex mb-3">
                            <span
                                className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">Item</span>
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={items.length}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="grid sm:grid-cols-2 gap-x-8 mb-5">
                        <div></div>
                        <div>
                            <div className="flex mb-3">
                            <span
                                className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">Total</span>
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm text-gray-900 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={formatRupiah(total)}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="bg-gray-50 rounded p-5 grid sm:grid-cols-2 gap-x-8 mb-5">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Nama
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon aria-hidden="true" className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        onChange={handleChange}
                                        value={data.name}
                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <InputError message={errors.name} className="mt-2"/>
                            </div>

                            <div>
                                <label htmlFor="phone-number"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    No. HP
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <PhoneIcon aria-hidden="true" className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="phone-number"
                                        name="phone_number"
                                        type="text"
                                        onChange={handleChange}
                                        value={data.phone_number}
                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <InputError message={errors.phone_number} className="mt-2"/>
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="payment-type"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Pembayaran
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <BanknotesIcon aria-hidden="true" className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="payment-type"
                                        type="text"
                                        value="Lunas"
                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled={true}/>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="customer-type"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Tipe Pembeli
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UsersIcon aria-hidden="true" className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="customer-type"
                                        type="text"
                                        value="Umum"
                                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        disabled={true}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="grid sm:grid-cols-2 gap-x-8 mb-5 gap-y-5">
                        <div>
                            <Subheading className="mb-2">Produk</Subheading>
                            <ProductSelect
                                ref={productSelectRef}
                                onChange={(product) => setTempProduct(product)}/>
                        </div>

                        <div className="grid sm:grid-cols-5 gap-x-4 gap-y-5">
                            <div className="col-span-4">
                                <Subheading className="mb-2">Jumlah</Subheading>
                                <Input
                                    type="number"
                                    value={tempQuantity}
                                    onChange={(e) => setTempQuantity(e.target.value)}
                                />
                            </div>

                            <div className="col-span-1 flex items-end">
                                <Button className="w-full cursor-pointer" onClick={handleAddItem}>Tambah</Button>
                            </div>
                        </div>

                    </section>

                    <div className="mt-8 mb-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Produk
                                            </th>
                                            <th scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-end">
                                                Jumlah
                                            </th>
                                            <th scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Harga Jual
                                            </th>
                                            <th scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Sub Total
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Hapus</span>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-sm text-gray-500">
                                                    Tidak ada item dalam keranjang
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {item.product}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-end">{item.quantity}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatRupiah(item.price)}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatRupiah(item.subtotal)}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <button
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="grid sm:grid-cols-2 gap-x-8">
                        <div className="relative">
                            <label
                                htmlFor="pay"
                                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                            >
                                Bayar
                            </label>
                            <input
                                id="pay"
                                name="pay"
                                type="number"
                                value={pay}
                                onChange={handlePayChange}
                                disabled={total === 0}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-[150%]"
                            />
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="cashback"
                                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                            >
                                Kembali
                            </label>
                            <input
                                id="cashback"
                                type="text"
                                value={formatRupiah(cashback)}
                                disabled={true}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-[150%]"
                            />
                        </div>
                    </section>

                    <div className="mt-5">
                        {
                            processing || items.length === 0 || data.name === '' ? (
                                <Button type="submit" className={'mt-5 w-full cursor-not-allowed'}
                                        disabled>Simpan</Button>
                            ) : (
                                <Button type="submit" className={'mt-5 w-full cursor-pointer'}>Simpan</Button>
                            )
                        }
                    </div>
                </form>

            </AdminLayout>

            <SweetAlert2 {...swalProps} />
        </>
    );
}

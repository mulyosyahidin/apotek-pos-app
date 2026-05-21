import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Heading, Subheading } from '@/Components/Catalyst/heading';
import { Divider } from '@/Components/Catalyst/divider';
import { useRef, useState } from 'react';
import { formatRupiah } from '@/utils.js';
import {
    BanknotesIcon,
    PhoneIcon,
    UserIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import ProductSelect from '@/Pages/Dashboard/Components/ProductSelect';
import { Input } from '@/Components/Catalyst/input';
import { Button } from '@/Components/Catalyst/button';
import InputError from '@/Components/InputError';
import SweetAlert2 from 'react-sweetalert2';

export default function DashboardIndex({ success, info }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone_number: '',
        payment_type: 'paid-off',
        customer_type: 'general',
        items: [],
    });

    const [customerType, setCustomerType] = useState('general');

    const [swalProps, setSwalProps] = useState({});

    const productSelectRef = useRef(null);

    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [tempProduct, setTempProduct] = useState(null);
    const [tempQuantity, setTempQuantity] = useState(1);
    const [tempMaxStock, setTempMaxStock] = useState(0);

    const [pay, setPay] = useState(0);
    const [cashback, setCashback] = useState(0);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (name === 'customer_type') {
            setCustomerType(value);

            // update total
            setTotal(
                items.reduce(
                    (sum, item) =>
                        sum +
                        (value === 'general'
                            ? item.general_subtotal
                            : item.medical_subtotal),
                    0,
                ),
            );
        }

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'select-one' ? value : value,
        }));
    };

    const handleAddItem = () => {
        if (!tempProduct || tempQuantity <= 0) return;

        if (tempQuantity > tempMaxStock) {
            setSwalProps({
                show: true,
                title: 'Stok tidak mencukupi',
                text: `Stok ${tempProduct.name} saat ini hanya ${tempMaxStock}`,
                icon: 'error',
            });

            return;
        }

        const existingIndex = items.findIndex(
            (item) => item.id === tempProduct.id,
        );

        let updatedItems;
        if (existingIndex !== -1) {
            updatedItems = items.map((item, index) =>
                index === existingIndex
                    ? {
                          ...item,
                          quantity:
                              Number(item.quantity) + Number(tempQuantity),
                          general_subtotal:
                              (Number(item.quantity) + Number(tempQuantity)) *
                              Number(item.general_price),
                          medical_subtotal:
                              (Number(item.quantity) + Number(tempQuantity)) *
                              Number(item.medical_price),
                      }
                    : item,
            );
        } else {
            const newItem = {
                id: tempProduct.id,
                unit: tempProduct.unit,
                product: tempProduct.name,
                quantity: Number(tempQuantity),
                general_price: Number(tempProduct.general_sell_price),
                medical_price: Number(tempProduct.medical_sell_price),
                general_subtotal:
                    Number(tempQuantity) *
                    Number(tempProduct.general_sell_price),
                medical_subtotal:
                    Number(tempQuantity) *
                    Number(tempProduct.medical_sell_price),
            };

            updatedItems = [...items, newItem];
        }

        setItems(updatedItems);
        setData((prevData) => ({ ...prevData, items: updatedItems }));

        setTotal(
            updatedItems.reduce(
                (sum, item) =>
                    sum +
                    (customerType === 'general'
                        ? item.general_subtotal
                        : item.medical_subtotal),
                0,
            ),
        );

        if (productSelectRef.current) {
            productSelectRef.current.reset();
        }

        setTempQuantity(1);
    };

    const handleRemoveItem = (index) => {
        const removedItem = items[index];
        const updatedItems = items.filter((_, i) => i !== index);

        setItems(updatedItems);
        setData((prevData) => ({ ...prevData, items: updatedItems }));
        setTotal(
            (prevTotal) =>
                prevTotal -
                (customerType === 'general'
                    ? removedItem.general_subtotal
                    : removedItem.medical_subtotal),
        );
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
            <Head title="Dashboard" />

            <AdminLayout>
                <Heading>KASIR</Heading>

                {info && (
                    <div
                        className="mb-5 mt-5 border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-200"
                        role="alert"
                    >
                        <p>{info}</p>
                    </div>
                )}

                <Divider className="my-10" soft />

                <form method="post" onSubmit={submit}>
                    <section className="grid gap-x-8 sm:grid-cols-2">
                        <div></div>
                        <div>
                            <div className="mb-3 flex">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-white/10 dark:text-white">
                                    Item
                                </span>
                                <input
                                    type="text"
                                    className="flex-1 rounded-r-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={items.length}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mb-5 grid gap-x-8 sm:grid-cols-2">
                        <div></div>
                        <div>
                            <div className="mb-3 flex">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-white/10 dark:text-white">
                                    Total
                                </span>
                                <input
                                    type="text"
                                    className="flex-1 rounded-r-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={formatRupiah(total)}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="mb-5 grid gap-x-8 rounded bg-gray-50 p-5 dark:bg-white/[2.5%] dark:ring-1 dark:ring-white/10 sm:grid-cols-2">
                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Nama
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon
                                            aria-hidden="true"
                                            className="h-5 w-5 text-gray-400 dark:text-zinc-500"
                                        />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        onChange={handleChange}
                                        value={data.name}
                                        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone-number"
                                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    No. HP
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <PhoneIcon
                                            aria-hidden="true"
                                            className="h-5 w-5 text-gray-400 dark:text-zinc-500"
                                        />
                                    </div>
                                    <input
                                        id="phone-number"
                                        name="phone_number"
                                        type="text"
                                        onChange={handleChange}
                                        value={data.phone_number}
                                        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <InputError
                                    message={errors.phone_number}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="payment-type"
                                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Pembayaran
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <BanknotesIcon
                                            aria-hidden="true"
                                            className="h-5 w-5 text-gray-400 dark:text-zinc-500"
                                        />
                                    </div>
                                    <input
                                        id="payment-type"
                                        type="text"
                                        value="Lunas"
                                        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/[2.5%] dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6"
                                        disabled={true}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="customer-type"
                                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Tipe Pembeli
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UsersIcon
                                            aria-hidden="true"
                                            className="h-5 w-5 text-gray-400 dark:text-zinc-500"
                                        />
                                    </div>
                                    <select
                                        id="customer-type"
                                        name="customer_type"
                                        value={data.customer_type}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:*:bg-zinc-800 dark:*:text-white sm:text-sm sm:leading-6"
                                    >
                                        <option value="general">Umum</option>
                                        <option value="medical">Medis</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="mb-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                        <div>
                            <Subheading className="mb-2">Produk</Subheading>
                            <ProductSelect
                                ref={productSelectRef}
                                onChange={(product) => {
                                    setTempProduct(product);
                                    setTempMaxStock(product.stock);
                                }}
                                onClick={() => {
                                    setTempMaxStock(0);
                                }}
                            />
                        </div>

                        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-5">
                            <div className="col-span-4">
                                <Subheading className="mb-2">
                                    Jumlah
                                    {tempMaxStock > 0 && (
                                        <small className="ml-3 text-gray-500 dark:text-zinc-400">
                                            (Stok saat ini: {tempMaxStock})
                                        </small>
                                    )}
                                </Subheading>
                                <Input
                                    type="number"
                                    value={tempQuantity}
                                    onChange={(e) =>
                                        setTempQuantity(e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-span-1 flex items-end">
                                <Button
                                    className="w-full cursor-pointer"
                                    onClick={handleAddItem}
                                >
                                    Tambah
                                </Button>
                            </div>
                        </div>
                    </section>

                    <div className="mb-8 mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white/10 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-white/10">
                                        <thead className="bg-gray-50 dark:bg-white/[2.5%]">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                                                >
                                                    Produk
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white"
                                                >
                                                    Jumlah
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                                >
                                                    Harga Jual
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                                >
                                                    Sub Total
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                                >
                                                    <span className="sr-only">
                                                        Hapus
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-zinc-900">
                                            {items.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="py-4 text-center text-sm text-gray-500 dark:text-zinc-400"
                                                    >
                                                        Tidak ada item dalam
                                                        keranjang
                                                    </td>
                                                </tr>
                                            ) : (
                                                items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                                            {item.product}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                                                            {item.quantity}{' '}
                                                            {item.unit}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                                                            {customerType ===
                                                            'general'
                                                                ? formatRupiah(
                                                                      item.general_price,
                                                                  )
                                                                : formatRupiah(
                                                                      item.medical_price,
                                                                  )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                                                            {customerType ===
                                                            'general'
                                                                ? formatRupiah(
                                                                      item.general_subtotal,
                                                                  )
                                                                : formatRupiah(
                                                                      item.medical_subtotal,
                                                                  )}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
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

                    <section className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                        <div className="relative">
                            <label
                                htmlFor="pay"
                                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900 dark:bg-zinc-900 dark:text-white"
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
                                className="block h-[150%] w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="cashback"
                                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900 dark:bg-zinc-900 dark:text-white"
                            >
                                Kembali
                            </label>
                            <input
                                id="cashback"
                                type="text"
                                value={formatRupiah(cashback)}
                                disabled={true}
                                className="block h-[150%] w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/[2.5%] dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </section>

                    <div className="mt-5">
                        {processing ||
                        items.length === 0 ||
                        data.name === '' ? (
                            <Button
                                type="submit"
                                className={'mt-5 w-full cursor-not-allowed'}
                                disabled
                            >
                                Simpan
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className={'mt-5 w-full cursor-pointer'}
                            >
                                Simpan
                            </Button>
                        )}
                    </div>
                </form>
            </AdminLayout>

            <SweetAlert2 {...swalProps} />
        </>
    );
}

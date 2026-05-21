import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import { Heading, Subheading } from '@/Components/Catalyst/heading';
import { Divider } from '@/Components/Catalyst/divider';
import { Input } from '@/Components/Catalyst/input';
import InputError from '@/Components/InputError';
import { Textarea } from '@/Components/Catalyst/textarea';
import { Button } from '@/Components/Catalyst/button';
import { useEffect, useState } from 'react';

export default function SuppliersEdit({
    supplier,
    provinces,
    regencies,
    success,
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: supplier.name,
        address: supplier.address,
        province_id: supplier.province_id,
        regency_id: supplier.regency_id,
        phone_number: supplier.phone_number,
        email: supplier.email,
        status: supplier.status,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [filteredRegencies, setFilteredRegencies] = useState([]);
    const [isRegencyLoading, setIsRegencyLoading] = useState(false);

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;

        setFilteredRegencies([]);
        setIsRegencyLoading(true);

        setData((prevData) => ({
            ...prevData,
            province_id: provinceId,
        }));

        const filterRegencies = regencies.filter(
            (regency) => regency.province_id == provinceId,
        );

        setTimeout(() => {
            setFilteredRegencies(filterRegencies);
            setIsRegencyLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (supplier.province_id) {
            const filterRegencies = regencies.filter(
                (regency) => regency.province_id == supplier.province_id,
            );
            setFilteredRegencies(filterRegencies);
        }
    }, [supplier.province_id, regencies]);

    const submit = (e) => {
        e.preventDefault();

        put(route('suppliers.update', supplier.id));
    };

    return (
        <>
            <Head title="Tambah Supplier" />

            <AdminLayout>
                <div>
                    <BackButton link={route('suppliers.index')} />

                    <form
                        method="post"
                        className="mx-auto mt-10"
                        onSubmit={submit}
                    >
                        <Heading>Tambah Supplier Baru</Heading>

                        {success && (
                            <div className="mb-4 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                {success}
                            </div>
                        )}
                        <Divider className="my-10 mt-6" />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>
                                    Nama{' '}
                                    <span className="font-bold text-red-500">
                                        *
                                    </span>
                                </Subheading>
                            </div>
                            <div>
                                <Input
                                    aria-label="Nama supllier"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>Alamat</Subheading>
                            </div>
                            <div>
                                <Textarea
                                    aria-label="Alamat supplier"
                                    name="address"
                                    value={data.address}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.address}
                                    className="mt-2"
                                />
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>Provinsi</Subheading>
                            </div>
                            <div>
                                <select
                                    name="province_id"
                                    value={data.province_id}
                                    onChange={handleProvinceChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:*:bg-zinc-800 dark:*:text-white sm:text-sm"
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map((province) => (
                                        <option
                                            key={province.id}
                                            value={province.id}
                                        >
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.province_id}
                                    className="mt-2"
                                />
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>Kabupaten / Kota</Subheading>
                            </div>
                            <div>
                                <select
                                    name="regency_id"
                                    value={data.regency_id}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:*:bg-zinc-800 dark:*:text-white sm:text-sm"
                                >
                                    <option value="">
                                        Pilih Kabupaten / Kota
                                    </option>
                                    {filteredRegencies.map((regency) => (
                                        <option
                                            key={regency.id}
                                            value={regency.id}
                                        >
                                            {regency.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.regency_id}
                                    className="mt-2"
                                />

                                {isRegencyLoading && (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                                        Loading...
                                    </p>
                                )}
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>No. HP</Subheading>
                            </div>
                            <div>
                                <Input
                                    aria-label="No. HP supllier"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.phone_number}
                                    className="mt-2"
                                />
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>Email</Subheading>
                            </div>
                            <div>
                                <Input
                                    aria-label="Email supllier"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>Status</Subheading>
                            </div>
                            <div>
                                <select
                                    name="status"
                                    value={data.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:*:bg-zinc-800 dark:*:text-white sm:text-sm"
                                >
                                    <option value="">Pilih Status</option>
                                    <option key="active" value="active">
                                        Aktif
                                    </option>
                                    <option key="inactive" value="inactive">
                                        Tidak Aktif
                                    </option>
                                </select>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>
                        </section>

                        <Divider className="my-10" soft />

                        <div className="flex justify-end gap-4">
                            {processing ? (
                                <Button
                                    type="submit"
                                    className={'cursor-not-allowed'}
                                    disabled
                                >
                                    Simpan
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className={'cursor-pointer'}
                                >
                                    Simpan
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}

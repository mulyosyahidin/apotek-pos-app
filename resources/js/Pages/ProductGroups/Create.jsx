import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BackButton from '@/Components/BackButton';
import { Heading, Subheading } from '@/Components/Catalyst/heading';
import { Divider } from '@/Components/Catalyst/divider';
import { Input } from '@/Components/Catalyst/input';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/Catalyst/button';

export default function ProductGroupsCreate({ categories, success }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: '',
        status: 'active',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('product-groups.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Tambah Grup Produk" />

            <AdminLayout>
                <div>
                    <BackButton link={route('product-groups.index')} />

                    <form
                        method="post"
                        className="mx-auto mt-10"
                        onSubmit={submit}
                    >
                        <Heading>Tambah Grup Produk Baru</Heading>

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
                                <Subheading>Kategori</Subheading>
                            </div>
                            <div>
                                <select
                                    name="category"
                                    value={data.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:*:bg-zinc-800 dark:*:text-white sm:text-sm"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {Object.entries(categories).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ),
                                    )}
                                </select>
                                <InputError
                                    message={errors.category}
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

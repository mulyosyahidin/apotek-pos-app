import { Head, useForm } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';
import { Button } from '@/Components/Catalyst/button';
import { Divider } from '@/Components/Catalyst/divider';
import { Heading, Subheading } from '@/Components/Catalyst/heading';
import { Input } from '@/Components/Catalyst/input';
import InputError from '@/Components/InputError';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CashiersEdit({ cashier, success }) {
    const { data, setData, put, processing, errors } = useForm({
        name: cashier.name,
        email: cashier.email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('cashiers.update', cashier.id));
    };

    return (
        <>
            <Head title="Edit Kasir" />

            <AdminLayout>
                <BackButton link={route('cashiers.index')} />

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Edit Kasir</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                            {success}
                        </div>
                    )}

                    <Divider className="my-10 mt-6" />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <Subheading>
                            Nama{' '}
                            <span className="font-bold text-red-500">*</span>
                        </Subheading>
                        <div>
                            <Input
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <Subheading>
                            Email{' '}
                            <span className="font-bold text-red-500">*</span>
                        </Subheading>
                        <div>
                            <Input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <Subheading>Password Baru</Subheading>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Kosongkan jika tidak ingin mengganti password.
                            </p>
                        </div>
                        <div>
                            <Input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <Subheading>Konfirmasi Password Baru</Subheading>
                        <div>
                            <Input
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className={
                                processing
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                            }
                            disabled={processing}
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}

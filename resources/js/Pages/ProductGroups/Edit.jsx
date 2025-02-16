import {Head, useForm} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import BackButton from "@/Components/BackButton.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {Divider} from "@/Components/Catalyst/divider.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import InputError from "@/Components/InputError.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";

export default function ProductGroupsEdit({categories, productGroup, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        name: productGroup.name,
        category: productGroup.category,
        status: productGroup.status,
    })

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const submit = (e) => {
        e.preventDefault();

        put(route('product-groups.update', productGroup.id));
    }

    return (
        <>
            <Head title="Edit Grup Produk"/>

            <AdminLayout>
                <div>
                    <BackButton link={route('product-groups.index')}/>

                    <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                        <Heading>Edit Grup Produk Baru</Heading>

                        {success && (
                            <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                                {success}
                            </div>
                        )}
                        <Divider className="my-10 mt-6"/>

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>
                                    Nama <span className="text-red-500 font-bold">*</span>
                                </Subheading>
                            </div>
                            <div>
                                <Input aria-label="Nama grup produk" name="name" value={data.name}
                                       onChange={handleChange}/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                        </section>

                        <Divider className="my-10" soft/>

                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Subheading>Kategori</Subheading>
                            </div>
                            <div>
                                <select
                                    name="category"
                                    value={data.category}
                                    onChange={handleChange}
                                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {Object.entries(categories).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} className="mt-2"/>
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

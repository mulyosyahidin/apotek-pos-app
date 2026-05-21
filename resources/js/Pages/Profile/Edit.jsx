import { Divider } from '@/Components/Catalyst/divider';
import { Heading } from '@/Components/Catalyst/heading';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout>
            <Head title="Profil" />

            <Heading>Profil</Heading>
            <Divider className="my-10 mt-6" />

            <div className="space-y-12">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />

                <Divider soft />

                <UpdatePasswordForm />
            </div>
        </AdminLayout>
    );
}

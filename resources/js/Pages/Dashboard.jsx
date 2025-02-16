import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdminLayout from "@/Layouts/AdminLayout.jsx";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <AdminLayout>

            </AdminLayout>
        </>
    );
}

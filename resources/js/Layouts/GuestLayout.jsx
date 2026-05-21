import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-br from-green-100 via-green-200 to-green-300 pt-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:justify-center sm:pt-0">
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
                <svg
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern
                            id="circles"
                            x="0"
                            y="0"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <circle
                                cx="10"
                                cy="10"
                                r="4"
                                className="fill-emerald-300 dark:fill-white"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circles)" />
                </svg>
            </div>

            <div className="z-10">
                <Link href="/">
                    <img
                        alt="Logo"
                        src={'/assets/images/logo-apotek.png'}
                        className="h-20 w-20"
                    />
                </Link>
            </div>

            <div className="z-10 mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}

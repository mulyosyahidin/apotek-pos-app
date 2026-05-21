import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { Link, usePage } from '@inertiajs/react';
import './BackButton.css';

export default function BackButton({
    link,
    text = 'Kembali',
    tooltip = 'Klik untuk kembali',
    ...props
}) {
    return (
        <div className="tooltip-container relative inline-block">
            <Link
                href={link}
                {...props}
                className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
            >
                <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
                {text}
            </Link>
        </div>
    );
}

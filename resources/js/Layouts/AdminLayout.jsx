import {
    Dropdown,
    DropdownButton,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
} from '@/Components/Catalyst/dropdown';

import {
    ArrowRightStartOnRectangleIcon,
    ChevronUpIcon,
    MoonIcon,
    SunIcon,
    UserCircleIcon,
} from '@heroicons/react/16/solid';
import {
    ChartPieIcon,
    HomeIcon,
    HashtagIcon,
    TagIcon,
    RocketLaunchIcon,
    CubeIcon,
    UserGroupIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { SidebarLayout } from '@/Layouts/Includes/SidebarLayout';
import {
    Navbar,
    NavbarItem,
    NavbarSection,
    NavbarSpacer,
} from '@/Components/Catalyst/navbar';
import { Avatar } from '@/Components/Catalyst/avatar';
import {
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarHeading,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
} from '@/Components/Catalyst/sidebar';
import { usePage } from '@inertiajs/react';

function AccountDropdownMenu({ anchor, isDarkMode, onSwitchMode }) {
    return (
        <DropdownMenu className="min-w-64" anchor={anchor}>
            <DropdownItem href={route('profile.edit')}>
                <UserCircleIcon />
                <DropdownLabel>Akun Saya</DropdownLabel>
            </DropdownItem>
            <DropdownItem onClick={onSwitchMode}>
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
                <DropdownLabel>Switch Mode</DropdownLabel>
            </DropdownItem>
            <DropdownItem href={route('logout')} as={'button'} method={'post'}>
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Keluar</DropdownLabel>
            </DropdownItem>
        </DropdownMenu>
    );
}

export default function AdminLayout({ children }) {
    let pathname = window.location.pathname;
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const shouldUseDarkMode = storedTheme
            ? storedTheme === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;

        document.documentElement.classList.toggle('dark', shouldUseDarkMode);
        setIsDarkMode(shouldUseDarkMode);
    }, []);

    const switchMode = () => {
        const nextMode = !isDarkMode;

        document.documentElement.classList.toggle('dark', nextMode);
        localStorage.setItem('theme', nextMode ? 'dark' : 'light');
        setIsDarkMode(nextMode);
    };

    return (
        <SidebarLayout
            navbar={
                <Navbar>
                    <NavbarSpacer />
                    <NavbarSection>
                        <Dropdown>
                            <DropdownButton as={NavbarItem}>
                                <Avatar
                                    src={'/assets/images/user-1.jpg'}
                                    square
                                />
                            </DropdownButton>
                            <AccountDropdownMenu
                                anchor="bottom end"
                                isDarkMode={isDarkMode}
                                onSwitchMode={switchMode}
                            />
                        </Dropdown>
                    </NavbarSection>
                </Navbar>
            }
            sidebar={
                <Sidebar>
                    <SidebarHeader>
                        <Dropdown>
                            <DropdownButton as={SidebarItem}>
                                <Avatar src="/assets/images/catalyst.svg" />
                                <SidebarLabel>Kasir Apotek</SidebarLabel>
                            </DropdownButton>
                        </Dropdown>
                    </SidebarHeader>

                    <SidebarBody>
                        <SidebarSection>
                            <SidebarItem
                                href={route('dashboard')}
                                current={pathname === '/dashboard'}
                            >
                                <HomeIcon />
                                <SidebarLabel>Kasir</SidebarLabel>
                            </SidebarItem>
                        </SidebarSection>

                        {isAdmin && (
                            <SidebarSection>
                                <SidebarHeading>Laporan</SidebarHeading>
                                <SidebarItem
                                    href={route('reports.index')}
                                    current={pathname.startsWith('/reports')}
                                >
                                    <ChartPieIcon />
                                    <SidebarLabel>Laporan</SidebarLabel>
                                </SidebarItem>
                            </SidebarSection>
                        )}

                        <SidebarSection>
                            <SidebarHeading>Master Data</SidebarHeading>
                            {isAdmin && (
                                <SidebarItem
                                    href={route('cashiers.index')}
                                    current={pathname.startsWith('/cashiers')}
                                >
                                    <UserGroupIcon />
                                    <SidebarLabel>Kasir</SidebarLabel>
                                </SidebarItem>
                            )}

                            <SidebarItem
                                href={route('product-groups.index')}
                                current={pathname.startsWith('/product-groups')}
                            >
                                <TagIcon />
                                <SidebarLabel>Grup Produk</SidebarLabel>
                            </SidebarItem>

                            <SidebarItem
                                href={route('products.index')}
                                current={pathname.startsWith('/products')}
                            >
                                <RocketLaunchIcon />
                                <SidebarLabel>Produk</SidebarLabel>
                            </SidebarItem>

                            {isAdmin && (
                                <SidebarItem
                                    href={route('suppliers.index')}
                                    current={pathname.startsWith('/suppliers')}
                                >
                                    <CubeIcon />
                                    <SidebarLabel>Supplier</SidebarLabel>
                                </SidebarItem>
                            )}
                        </SidebarSection>
                    </SidebarBody>

                    <SidebarFooter className="max-lg:hidden">
                        <Dropdown>
                            <DropdownButton as={SidebarItem}>
                                <span className="flex min-w-0 items-center gap-3">
                                    <Avatar
                                        src={'/assets/images/user-1.jpg'}
                                        className="size-10"
                                        square
                                        alt=""
                                    />
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                                            {auth.user.name}
                                        </span>
                                        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                                            {auth.user.email}
                                        </span>
                                    </span>
                                </span>
                                <ChevronUpIcon />
                            </DropdownButton>
                            <AccountDropdownMenu
                                anchor="top start"
                                isDarkMode={isDarkMode}
                                onSwitchMode={switchMode}
                            />
                        </Dropdown>
                    </SidebarFooter>
                </Sidebar>
            }
        >
            {children}
        </SidebarLayout>
    );
}

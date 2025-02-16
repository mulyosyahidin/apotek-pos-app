import {
    Dropdown,
    DropdownButton,
    DropdownItem,
    DropdownLabel,
    DropdownMenu
} from "@/Components/Catalyst/dropdown";

import {
    ArrowRightStartOnRectangleIcon,
    ChevronUpIcon,
    UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
    ChartPieIcon, HomeIcon, HashtagIcon, TagIcon, RocketLaunchIcon, CubeIcon
} from '@heroicons/react/20/solid'
import {SidebarLayout} from "@/Layouts/Includes/SidebarLayout";
import {Navbar, NavbarItem, NavbarSection, NavbarSpacer} from "@/Components/Catalyst/navbar";
import {Avatar} from "@/Components/Catalyst/avatar";
import {
    Sidebar,
    SidebarBody, SidebarFooter,
    SidebarHeader, SidebarHeading,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
} from "@/Components/Catalyst/sidebar";
import {usePage} from "@inertiajs/react";

function AccountDropdownMenu({ anchor }) {
    return (
        <DropdownMenu className="min-w-64" anchor={anchor}>
            <DropdownItem href="#">
                <UserCircleIcon />
                <DropdownLabel>Akun Saya</DropdownLabel>
            </DropdownItem>
            <DropdownItem href={route('logout')} as={'button'} method={'post'}>
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Keluar</DropdownLabel>
            </DropdownItem>
        </DropdownMenu>
    )
}

export default function AdminLayout({ children }) {
    let pathname = window.location.pathname
    const { auth } = usePage().props

    return (
        <SidebarLayout
            navbar={
                <Navbar>
                    <NavbarSpacer/>
                    <NavbarSection>
                        <Dropdown>
                            <DropdownButton as={NavbarItem}>
                                <Avatar src={'/assets/images/user-1.jpg'} square/>
                            </DropdownButton>
                            <AccountDropdownMenu anchor="bottom end"/>
                        </Dropdown>
                    </NavbarSection>
                </Navbar>
            }
            sidebar={
                <Sidebar>
                    <SidebarHeader>
                        <Dropdown>
                            <DropdownButton as={SidebarItem}>
                                <Avatar src="/assets/images/catalyst.svg"/>
                                <SidebarLabel>Kasir Apotek</SidebarLabel>
                            </DropdownButton>
                        </Dropdown>
                    </SidebarHeader>

                    <SidebarBody>
                        <SidebarSection>
                            <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
                                <HomeIcon/>
                                <SidebarLabel>Kasir</SidebarLabel>
                            </SidebarItem>
                        </SidebarSection>

                        <SidebarSection>
                            <SidebarHeading>Laporan</SidebarHeading>
                            <SidebarItem href="#">
                                <ChartPieIcon/>
                                <SidebarLabel>Laporan</SidebarLabel>
                            </SidebarItem>
                        </SidebarSection>

                        <SidebarSection>
                            <SidebarHeading>Master Data</SidebarHeading>
                            <SidebarItem href="#">
                                <TagIcon/>
                                <SidebarLabel>Grup Produk</SidebarLabel>
                            </SidebarItem>

                            <SidebarItem href="#">
                                <RocketLaunchIcon/>
                                <SidebarLabel>Produk</SidebarLabel>
                            </SidebarItem>

                            <SidebarItem href={route('suppliers.index')} current={pathname.startsWith('/suppliers')}>
                                <CubeIcon/>
                                <SidebarLabel>Supplier</SidebarLabel>
                            </SidebarItem>
                        </SidebarSection>
                    </SidebarBody>

                    <SidebarFooter className="max-lg:hidden">
                        <Dropdown>
                            <DropdownButton as={SidebarItem}>
                                <span className="flex min-w-0 items-center gap-3">
                                    <Avatar src={'/assets/images/user-1.jpg'} className="size-10" square alt=""/>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{auth.user.name}</span>
                                        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                                            {auth.user.email}
                                        </span>
                                    </span>
                                </span>
                                <ChevronUpIcon/>
                            </DropdownButton>
                            <AccountDropdownMenu anchor="top start"/>
                        </Dropdown>
                    </SidebarFooter>
                </Sidebar>
            }
        >
            {children}
        </SidebarLayout>
    )
}


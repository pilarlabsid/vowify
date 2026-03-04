'use client';

import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Heart, LogOut,
    Menu, X, Shield, Loader2, Settings
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/lib/theme-context';

function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }: any) {
    const { data: session } = useSession() as any;
    const pathname = usePathname();

    const SidebarItem = ({ icon, label, href }: any) => {
        const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
        return (
            <Link
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl transition-all duration-200 group text-left"
                style={active ? {
                    background: 'var(--ui-sidebar-nav-active)',
                    color: '#1C1612',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(198,167,94,0.25)',
                } : {
                    color: 'var(--ui-sidebar-text)',
                }}
                onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--ui-sidebar-nav-hover)';
                }}
                onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = '';
                }}
            >
                <span className={active ? 'text-primary' : ''} style={!active ? { color: 'rgba(198,167,94,0.6)' } : {}}>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 w-64 flex flex-col p-6 space-y-8 z-50
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:relative
            `}
            style={{
                background: 'var(--ui-sidebar-bg)',
                borderRight: '1px solid var(--ui-sidebar-border)',
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-primary font-bold text-xl font-script">V</div>
                    <span className="text-2xl font-script tracking-wide text-gold">Vowify.id</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--ui-sidebar-text)' }}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center font-bold text-primary text-xs shrink-0">
                    {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-sm truncate leading-tight" style={{ color: 'var(--ui-sidebar-text)' }}>{session?.user?.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-gold shrink-0" />
                        <p className="text-[11px] truncate" style={{ color: 'var(--ui-sidebar-text-muted)' }}>{session?.user?.email}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto">
                <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard Admin" href="/admin" />
                <SidebarItem icon={<Users className="w-5 h-5" />} label="Manajemen User" href="/admin/users" />
                <SidebarItem icon={<Heart className="w-5 h-5" />} label="Semua Undangan" href="/admin/weddings" />
                <SidebarItem icon={<Settings className="w-5 h-5" />} label="Pengaturan" href="/admin/settings" />
            </nav>

            <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-3 transition-colors py-3 px-4 rounded-xl border hover:text-red-400 hover:border-red-400/20"
                style={{ color: 'var(--ui-sidebar-text-muted)', borderColor: 'var(--ui-sidebar-border)' }}
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Keluar</span>
            </button>
        </aside>
    );
}

function AdminHeader({ setIsSidebarOpen }: any) {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === '/admin') return 'Dashboard Admin';
        if (pathname === '/admin/users') return 'Manajemen User';
        if (pathname === '/admin/weddings') return 'Daftar Undangan';
        return 'Admin Panel';
    };

    return (
        <header
            className="sticky top-0 backdrop-blur-md z-30 px-6 lg:px-10 py-4 border-b flex items-center justify-between gap-4"
            style={{
                background: 'var(--ui-header-bg)',
                borderColor: 'var(--ui-border)',
            }}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl border shadow-sm transition-colors"
                    style={{
                        background: 'var(--ui-bg-card)',
                        borderColor: 'var(--ui-border)',
                        color: 'var(--ui-text-secondary)',
                    }}
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden sm:block">
                    <h1
                        className="text-lg lg:text-2xl font-bold capitalize"
                        style={{ color: 'var(--ui-text-primary)' }}
                    >
                        {getTitle()}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle id="theme-toggle-admin" />
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full border"
                    style={{
                        background: 'color-mix(in srgb, #C6A75E 10%, transparent)',
                        borderColor: 'color-mix(in srgb, #C6A75E 20%, transparent)',
                    }}
                >
                    <Shield className="w-4 h-4 text-gold" />
                    <span className="text-gold text-xs font-bold uppercase tracking-wider">Admin System</span>
                </div>
            </div>
        </header>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
            router.replace('/dashboard');
        }
    }, [status, session, router]);

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div
                className="flex flex-col h-screen items-center justify-center"
                style={{ background: 'var(--ui-bg)' }}
            >
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if ((session?.user as any)?.role !== 'admin') {
        return (
            <div
                className="flex flex-col h-screen items-center justify-center"
                style={{ background: 'var(--ui-bg)' }}
            >
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div
            data-zone="admin"
            className="flex flex-col lg:flex-row h-screen font-sans overflow-hidden"
        >
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm z-[40] lg:hidden"
                    style={{ background: 'var(--ui-overlay)' }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <main className="flex-1 overflow-y-auto flex flex-col">
                <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

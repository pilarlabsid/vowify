'use client';

import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Heart, LogOut,
    Menu, X, Shield, ChevronRight, Loader2, Settings
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }: any) {
    const { data: session } = useSession() as any;
    const pathname = usePathname();

    const SidebarItem = ({ icon, label, href }: any) => {
        const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
        return (
            <Link
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-2xl transition-all duration-200 group text-left ${active
                    ? 'bg-gold text-primary font-bold shadow-lg shadow-gold/20'
                    : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                    }`}
            >
                <span className={active ? '' : 'text-gold/50 group-hover:text-gold/80'}>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </Link>
        );
    };

    return (
        <aside className={`
            fixed inset-y-0 left-0 w-64 bg-elegant text-cream flex flex-col p-6 space-y-8 z-50
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:relative
        `}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-primary font-bold text-xl font-script">V</div>
                    <span className="text-2xl font-script tracking-wide text-gold">Vowify.id</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gold hover:bg-cream/10 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center font-bold text-primary text-xs shrink-0">
                    {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="min-w-0">
                    <p className="text-cream font-semibold text-sm truncate leading-tight">{session?.user?.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-gold" />
                        <p className="text-gold text-[10px] font-bold uppercase tracking-wider">Super Admin</p>
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
                className="flex items-center gap-3 text-cream/60 hover:text-red-400 transition-colors py-3 px-4 rounded-xl border border-cream/10 hover:border-red-400/20"
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
        <header className="sticky top-0 bg-neutral-50/90 backdrop-blur-md z-30 px-6 lg:px-10 py-4 border-b border-neutral-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white border border-neutral-200 rounded-xl shadow-sm">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden sm:block">
                    <h1 className="text-lg lg:text-2xl font-bold text-neutral-900 capitalize">{getTitle()}</h1>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs font-bold uppercase tracking-wider">Admin System</span>
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

    // Block ALL rendering until we know for sure who the user is
    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div className="flex flex-col h-screen bg-neutral-50 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    // Authenticated but not admin – show spinner while redirect kicks in
    if ((session?.user as any)?.role !== 'admin') {
        return (
            <div className="flex flex-col h-screen bg-neutral-50 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-neutral-50 text-neutral-800 font-sans overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-elegant/60 backdrop-blur-sm z-[40] lg:hidden"
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

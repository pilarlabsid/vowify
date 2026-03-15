'use client';

import { useState } from 'react';
import {
    LayoutDashboard, Users, Image as ImageIcon, Settings,
    LogOut, Edit2, Menu, X, ExternalLink, MessageSquare, Heart, Eye, Palette, Loader2, Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { DashboardProvider, useDashboard } from './dashboard-context';
import { useEffect } from 'react';
import { ThemeToggle } from '@/lib/theme-context';
import { motion, LayoutGroup } from 'framer-motion';

const SidebarItem = ({ icon, label, href, active, onClick }: any) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="w-full relative py-2.5 px-4 rounded-xl flex items-center gap-3 transition-all duration-300 group"
            style={{ color: active ? '#1C1612' : 'var(--ui-sidebar-text)' }}
        >
            {active && (
                <motion.div
                    layoutId="activeSidebarPill"
                    className="absolute inset-x-0 inset-y-0.5 z-0 rounded-xl"
                    style={{ 
                        background: 'var(--ui-sidebar-nav-active)',
                        boxShadow: '0 4px 12px -2px rgba(198, 167, 94, 0.4)',
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}

            <motion.span
                className="relative z-10"
                animate={{ scale: active ? 1.1 : 1 }}
                style={{ color: active ? '#1C1612' : 'rgba(198,167,94,0.6)' }}
            >
                {icon}
            </motion.span>

            <span className={`relative z-10 text-sm tracking-wide ${active ? 'font-bold' : 'font-medium opacity-80 group-hover:opacity-100'}`}>
                {label}
            </span>


        </Link>
    );
};

function DashboardSidebar({ isSidebarOpen, setIsSidebarOpen }: any) {
    const { data: session } = useSession() as any;
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <aside className={`
            fixed inset-y-0 left-0 w-64 flex flex-col p-6 py-10 space-y-8 z-50
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:relative
        `} style={{
                background: 'var(--ui-sidebar-bg)',
                borderRight: '1px solid var(--ui-sidebar-border)',
            }}>
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
                    <span className="text-3xl font-script tracking-wide text-gold">Vowify.id</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--ui-sidebar-text)' }}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center font-bold text-primary text-xs shrink-0">
                    {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-sm truncate leading-tight" style={{ color: 'var(--ui-sidebar-text)' }}>{session?.user?.name}</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--ui-sidebar-text-muted)' }}>{session?.user?.email}</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-2 -mx-2 py-1 custom-scrollbar">
                <LayoutGroup id="sidebar">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Ringkasan" href="/dashboard" active={pathname === '/dashboard'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<Heart size={20} />} label="Undangan Saya" href="/dashboard/weddings" active={pathname === '/dashboard/weddings'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<Edit2 size={20} />} label="Edit Undangan" href="/dashboard/edit" active={pathname === '/dashboard/edit'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<Users size={20} />} label="Kirim Undangan" href="/dashboard/guests" active={pathname === '/dashboard/guests'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<MessageSquare size={20} />} label="Ucapan & Doa" href="/dashboard/greetings" active={pathname === '/dashboard/greetings'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<ImageIcon size={20} />} label="Foto & Media" href="/dashboard/gallery" active={pathname === '/dashboard/gallery'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<Palette size={20} />} label="Koleksi Template" href="/dashboard/templates" active={pathname === '/dashboard/templates'} onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem icon={<Settings size={20} />} label="Pengaturan" href="/dashboard/settings" active={pathname === '/dashboard/settings'} onClick={() => setIsSidebarOpen(false)} />
                </LayoutGroup>
            </nav>

            <div className="pt-4 mt-auto border-t" style={{ borderColor: 'var(--ui-sidebar-border)' }}>
                <motion.button
                    disabled={isLoggingOut}
                    whileHover={!isLoggingOut ? { x: 4 } : {}}
                    whileTap={!isLoggingOut ? { scale: 0.98 } : {}}
                    onClick={handleSignOut}
                    className={`w-full flex items-center gap-3 transition-all py-3 px-4 rounded-2xl group ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500/5'}`}
                    style={{
                        color: 'var(--ui-sidebar-text-muted)',
                    }}
                >
                    {isLoggingOut ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
                    )}
                    <span className="text-sm font-medium group-hover:text-red-500 transition-all">
                        {isLoggingOut ? 'Memproses ...' : 'Keluar'}
                    </span>
                </motion.button>
            </div>
        </aside>
    );
}

function DashboardHeader({ setIsSidebarOpen }: any) {
    const { selectedWedding } = useDashboard();
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === '/dashboard') return 'Ringkasan';
        if (pathname === '/dashboard/weddings') return 'Undangan Saya';
        if (pathname === '/dashboard/edit') return 'Edit Undangan';
        if (pathname === '/dashboard/guests') return 'Kirim Undangan via WhatsApp';
        if (pathname === '/dashboard/greetings') return 'Ucapan & Doa';
        if (pathname === '/dashboard/gallery') return 'Foto & Media';
        if (pathname === '/dashboard/templates') return 'Koleksi Template';
        if (pathname === '/dashboard/settings') return 'Pengaturan';
        return 'Dashboard';
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
                <ThemeToggle id="theme-toggle-dashboard" />
                {selectedWedding && (
                    <Link
                        href={`/${selectedWedding.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 bg-gold/10 text-primary border border-gold/30 px-4 py-2 rounded-full text-xs font-bold hover:bg-gold hover:text-primary transition-all"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Buka Undangan</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                )}
            </div>
        </header>
    );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [announcement, setAnnouncement] = useState<string | null>(null);
    const [announcementVisible, setAnnouncementVisible] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/app-config')
            .then(r => r.json())
            .then(d => { if (d.announcement) setAnnouncement(d.announcement); })
            .catch(() => { });
    }, []);

    return (
        <div
            className="flex flex-col lg:flex-row h-screen font-sans overflow-hidden"
            style={{ background: 'var(--ui-bg)', color: 'var(--ui-text-primary)' }}
        >
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm z-[40] lg:hidden"
                    style={{ background: 'var(--ui-overlay)' }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <DashboardSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <main className="flex-1 overflow-y-auto flex flex-col">
                {announcement && announcementVisible && (
                    <div
                        className="flex items-center gap-3 px-6 py-3 border-b text-sm"
                        style={{
                            background: 'var(--ui-announcement-bg)',
                            borderColor: 'var(--ui-announcement-border)',
                            color: 'var(--ui-announcement-text)',
                        }}
                    >
                        <Megaphone className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{announcement}</span>
                        <button
                            onClick={() => setAnnouncementVisible(false)}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 p-6 lg:p-10 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}

function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
            return;
        }
        if (status === 'authenticated') {
            fetch('/api/app-config')
                .then(r => r.json())
                .then(d => {
                    if (d.maintenanceMode && (session?.user as any)?.role !== 'admin') {
                        router.replace('/maintenance');
                    }
                })
                .catch(() => { });
        }
    }, [status, router, session]);

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ background: 'var(--ui-bg)' }}
            >
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div data-zone="dashboard" className="min-h-screen">
            <DashboardAuthGuard>
                <DashboardProvider>
                    <DashboardLayoutContent>{children}</DashboardLayoutContent>
                </DashboardProvider>
            </DashboardAuthGuard>
        </div>
    );
}

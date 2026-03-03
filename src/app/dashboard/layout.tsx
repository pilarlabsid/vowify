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

function DashboardSidebar({ isSidebarOpen, setIsSidebarOpen }: any) {
    const { data: session } = useSession() as any;
    const pathname = usePathname();

    const SidebarItem = ({ icon, label, href }: any) => {
        const active = pathname === href;
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
                    {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="min-w-0">
                    <p className="text-cream font-semibold text-sm truncate leading-tight">{session?.user?.name}</p>
                    <p className="text-cream/40 text-[11px] truncate">{session?.user?.email}</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto">
                <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Ringkasan" href="/dashboard" />
                <SidebarItem icon={<Heart className="w-5 h-5" />} label="Undangan Saya" href="/dashboard/weddings" />
                <SidebarItem icon={<Edit2 className="w-5 h-5" />} label="Edit Undangan" href="/dashboard/edit" />
                <SidebarItem icon={<Users className="w-5 h-5" />} label="Kirim Undangan" href="/dashboard/guests" />
                <SidebarItem icon={<MessageSquare className="w-5 h-5" />} label="Ucapan & Doa" href="/dashboard/greetings" />
                <SidebarItem icon={<ImageIcon className="w-5 h-5" />} label="Galeri & Media" href="/dashboard/gallery" />
                <SidebarItem icon={<Palette className="w-5 h-5" />} label="Koleksi Template" href="/dashboard/templates" />
                <SidebarItem icon={<Settings className="w-5 h-5" />} label="Pengaturan" href="/dashboard/settings" />
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

function DashboardHeader({ setIsSidebarOpen }: any) {
    const { selectedWedding } = useDashboard();
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === '/dashboard') return 'Ringkasan';
        if (pathname === '/dashboard/weddings') return 'Undangan Saya';
        if (pathname === '/dashboard/edit') return 'Edit Undangan';
        if (pathname === '/dashboard/guests') return 'Kirim Undangan via WhatsApp';
        if (pathname === '/dashboard/greetings') return 'Ucapan & Doa';
        if (pathname === '/dashboard/gallery') return 'Galeri & Media';
        if (pathname === '/dashboard/templates') return 'Koleksi Template';
        if (pathname === '/dashboard/settings') return 'Pengaturan';
        return 'Dashboard';
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
        </header>
    );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [announcement, setAnnouncement] = useState<string | null>(null);
    const [announcementVisible, setAnnouncementVisible] = useState(true);

    useEffect(() => {
        fetch('/api/app-config')
            .then(r => r.json())
            .then(d => { if (d.announcement) setAnnouncement(d.announcement); })
            .catch(() => { });
    }, []);

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-neutral-50 text-neutral-800 font-sans overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-elegant/60 backdrop-blur-sm z-[40] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <DashboardSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <main className="flex-1 overflow-y-auto flex flex-col">
                {/* Announcement banner */}
                {announcement && announcementVisible && (
                    <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-sm">
                        <Megaphone className="w-4 h-4 shrink-0 text-amber-500" />
                        <span className="flex-1">{announcement}</span>
                        <button onClick={() => setAnnouncementVisible(false)}
                            className="text-amber-500 hover:text-amber-700 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

// ── Auth guard at the top level ─────────────────────────────────────────────
// This component renders BEFORE sidebar/header, so we can block the whole
// tree until we know the user is truly authenticated.
function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
            return;
        }
        if (status === 'authenticated') {
            // Check maintenance mode
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
            <div className="flex items-center justify-center min-h-screen bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardAuthGuard>
            <DashboardProvider>
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </DashboardProvider>
        </DashboardAuthGuard>
    );
}

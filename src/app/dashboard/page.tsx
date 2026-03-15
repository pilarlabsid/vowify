'use client';

import { useDashboard } from './dashboard-context';
import { StatCard, EmptyState, WeddingCard } from './components';
import { Heart, Users, MessageSquare, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function OverviewPage() {
    const { weddings, loading } = useDashboard();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-gold" />
                <p className="text-sm font-medium animate-pulse text-stone-400">Menyiapkan data Anda...</p>
            </div>
        );
    }

    const totalGreetings = weddings.reduce((s, w) => s + (w.greetings?.length ?? 0), 0);

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-serif font-bold text-stone-800">Halo, Selamat Datang</h2>
                <p className="text-sm text-stone-500">Berikut adalah ringkasan dari seluruh undangan Anda.</p>
            </div>

            <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div variants={item}>
                    <StatCard label="Total Undangan" value={weddings.length.toString()} sub="Aktif & Draft" icon={<Heart className="w-5 h-5" />} color="gold" />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard label="Total Tamu RSVP" value={totalGreetings.toString()} sub="Telah konfirmasi" icon={<Users className="w-5 h-5" />} color="emerald" />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard label="Ucapan Masuk" value={totalGreetings.toString()} sub="Pesan & Doa" icon={<MessageSquare className="w-5 h-5" />} color="blue" />
                </motion.div>
            </motion.div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-800">Undangan Terbaru</h3>
                    {weddings.length > 0 && (
                        <button 
                            onClick={() => router.push('/dashboard/weddings')}
                            className="text-xs font-bold text-gold hover:text-amber-600 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                        >
                            Lihat Semua <Plus className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {weddings.length === 0 ? (
                    <motion.div variants={item}>
                        <EmptyState
                            title="Belum ada undangan"
                            desc="Buat undangan pertama Anda sekarang dan bagikan ke seluruh tamu."
                            cta="Buat Undangan Sekarang"
                            onCta={() => router.push('/dashboard/weddings')}
                        />
                    </motion.div>
                ) : (
                    <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {weddings.map((w) => (
                            <motion.div key={w.id} variants={item}>
                                <WeddingCard wedding={w} selected={false} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}


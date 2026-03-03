'use client';

import { useDashboard } from './dashboard-context';
import { StatCard, EmptyState, WeddingCard } from './components';
import { Heart, Users, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OverviewPage() {
    const { weddings, loading } = useDashboard();
    const router = useRouter();

    if (loading) {
        return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    }

    const totalGreetings = weddings.reduce((s, w) => s + (w.greetings?.length ?? 0), 0);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label="Total Undangan" value={weddings.length.toString()} sub="aktif" icon={<Heart className="w-5 h-5" />} color="gold" />
                <StatCard label="Total RSVP" value={weddings.reduce((s, w) => s + (w.greetings?.length ?? 0), 0).toString()} sub="dari semua undangan" icon={<Users className="w-5 h-5" />} color="emerald" />
                <StatCard label="Ucapan Masuk" value={totalGreetings.toString()} sub="keseluruhan" icon={<MessageSquare className="w-5 h-5" />} color="blue" />
            </div>

            {weddings.length === 0 ? (
                <EmptyState
                    title="Belum ada undangan"
                    desc="Buat undangan pertama Anda sekarang dan bagikan ke seluruh tamu."
                    cta="Buat Undangan Pertama"
                    onCta={() => router.push('/dashboard/weddings')}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {weddings.map((w) => (
                        <WeddingCard key={w.id} wedding={w} selected={false} />
                    ))}
                </div>
            )}
        </div>
    );
}

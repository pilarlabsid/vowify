'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, Copy } from 'lucide-react';
import { useDashboard } from '../dashboard-context';

export default function SettingsPage() {
    const { data: session } = useSession();
    const { selectedWedding } = useDashboard();
    const [copied, setCopied] = useState(false);

    const copyLink = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-6">
                <h3 className="font-bold text-neutral-800 text-lg">Profil Akun</h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center font-bold text-gold text-2xl">
                        {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-800 text-lg">{session?.user?.name}</p>
                        <p className="text-neutral-500 text-sm">{session?.user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                    <div className="bg-neutral-50 p-4 rounded-2xl">
                        <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-1">Paket</p>
                        <p className="font-bold text-elegant">Free Plan</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-2xl">
                        <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-1">Status</p>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Aktif</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-neutral-800 text-lg">Link Undangan</h3>
                <p className="text-neutral-500 text-sm">Bagikan link berikut dengan menambahkan <code className="bg-neutral-100 px-2 py-0.5 rounded text-xs">?to=Nama+Tamu</code> di akhir URL</p>
                <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
                    <code className="text-sm flex-1 truncate text-elegant">
                        {selectedWedding ? `http://localhost:4123/${selectedWedding.slug}` : `http://localhost:4123/[slug-undangan]`}
                    </code>
                    <button
                        onClick={() => copyLink(selectedWedding ? `http://localhost:4123/${selectedWedding.slug}` : 'http://localhost:4123/')}
                        className="text-gold hover:text-primary transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

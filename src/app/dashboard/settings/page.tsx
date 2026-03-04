'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';
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

    const inviteUrl = selectedWedding
        ? `${typeof window !== 'undefined' ? window.location.origin : 'https://vowify.id'}/${selectedWedding.slug}`
        : null;

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Profil Akun */}
            <div className="rounded-3xl p-8 border shadow-sm space-y-6"
                style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                <h3 className="font-bold text-lg" style={{ color: 'var(--ui-text-primary)' }}>Profil Akun</h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center font-bold text-gold text-2xl">
                        {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                        <p className="font-semibold text-lg" style={{ color: 'var(--ui-text-primary)' }}>{session?.user?.name}</p>
                        <p className="text-sm" style={{ color: 'var(--ui-text-muted)' }}>{session?.user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--ui-divider)' }}>
                    <div className="p-4 rounded-2xl" style={{ background: 'var(--ui-bg-hover)' }}>
                        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--ui-text-muted)' }}>Paket</p>
                        <p className="font-bold" style={{ color: 'var(--ui-text-primary)' }}>Free Plan</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: 'var(--ui-bg-hover)' }}>
                        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--ui-text-muted)' }}>Status</p>
                        <span className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: 'color-mix(in srgb, #10B981 12%, transparent)', color: '#059669', border: '1px solid color-mix(in srgb, #10B981 25%, transparent)' }}>
                            Aktif
                        </span>
                    </div>
                </div>
            </div>

            {/* Link Undangan */}
            <div className="rounded-3xl p-8 border shadow-sm space-y-4"
                style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}>
                <h3 className="font-bold text-lg" style={{ color: 'var(--ui-text-primary)' }}>Link Undangan</h3>
                <p className="text-sm" style={{ color: 'var(--ui-text-secondary)' }}>
                    Bagikan link berikut dengan menambahkan{' '}
                    <code className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-secondary)', border: '1px solid var(--ui-border)' }}>
                        ?to=Nama+Tamu
                    </code>{' '}
                    di akhir URL
                </p>

                {inviteUrl ? (
                    <div className="flex items-center gap-3 rounded-2xl p-4 border"
                        style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}>
                        <LinkIcon className="w-4 h-4 shrink-0" style={{ color: 'var(--ui-text-muted)' }} />
                        <code className="text-sm flex-1 truncate font-mono" style={{ color: 'var(--ui-text-primary)' }}>
                            {inviteUrl}
                        </code>
                        <button
                            onClick={() => copyLink(inviteUrl)}
                            className="transition-colors p-1.5 rounded-lg"
                            style={{ color: copied ? '#10B981' : 'var(--ui-text-muted)' }}
                            title="Salin link"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl p-4 border text-sm text-center"
                        style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)', color: 'var(--ui-text-muted)' }}>
                        Pilih undangan terlebih dahulu untuk melihat link.
                    </div>
                )}
            </div>
        </div>
    );
}

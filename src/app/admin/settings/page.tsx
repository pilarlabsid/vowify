'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    MessageCircle, Users, Megaphone, Wrench,
    Loader2, Check, Save, Eye, RotateCcw, AlertTriangle
} from 'lucide-react';

const HARDCODED_DEFAULT = [
    'Assalamualaikum Warahmatullahi Wabarakatuh',
    '',
    'Kepada Yth.',
    'Bapak/Ibu/Saudara/i *{nama}*',
    '',
    'Dengan segala kerendahan hati, kami mengundang Anda untuk hadir dan memberikan doa restu dalam acara pernikahan kami:',
    '',
    '💍 *{mempelai}*',
    '',
    'Berikut link undangan digital untuk Anda:',
    '👇 {link}',
    '',
    'Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.',
    '',
    'Wassalamualaikum Warahmatullahi Wabarakatuh',
    '— {mempelai}',
].join('\n');

interface SettingsData {
    default_wa_template: string;
    max_weddings_per_user: string;
    maintenance_mode: string;
    announcement: string;
}

function SaveButton({ onClick, saving, saved, disabled }: any) {
    return (
        <button onClick={onClick} disabled={saving || disabled}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-60 ${saved ? 'bg-emerald-500 text-white' : 'bg-gold text-primary hover:bg-amber-400'}`}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Tersimpan!' : 'Simpan'}
        </button>
    );
}

function Section({ title, icon, children }: any) {
    return (
        <div
            className="rounded-3xl p-7 shadow-sm space-y-5 border"
            style={{ background: 'var(--ui-bg-card)', borderColor: 'var(--ui-border)' }}
        >
            <h2 className="font-bold flex items-center gap-2 text-base" style={{ color: 'var(--ui-text-primary)' }}>
                {icon}
                {title}
            </h2>
            {children}
        </div>
    );
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SettingsData>({
        default_wa_template: HARDCODED_DEFAULT,
        max_weddings_per_user: '3',
        maintenance_mode: 'false',
        announcement: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const loadSettings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.settings) {
                setSettings(prev => ({
                    ...prev,
                    ...Object.fromEntries(
                        Object.entries(data.settings).filter(([, v]) => v !== undefined && v !== null)
                    ),
                }));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadSettings(); }, [loadSettings]);

    const saveSetting = async (key: string, value: string) => {
        setSaving(key);
        setSaved(null);
        try {
            await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
            setSaved(key);
            setTimeout(() => setSaved(null), 2500);
        } finally {
            setSaving(null);
        }
    };

    const insertVar = (v: string) => setSettings(s => ({ ...s, default_wa_template: s.default_wa_template + `{${v}}` }));

    const preview = settings.default_wa_template
        .replace(/\{nama\}/g, 'Budi Santoso')
        .replace(/\{mempelai\}/g, 'Rizky & Siti')
        .replace(/\{link\}/g, 'https://vowify.id/rizky-siti?to=Budi+Santoso');

    if (loading) {
        return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-5 max-w-3xl">

            {/* 1. Maintenance Mode */}
            <Section title="Mode Maintenance" icon={<Wrench className="w-5 h-5 text-red-500" />}>
                <div
                    className="flex items-center justify-between p-4 rounded-2xl border"
                    style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}
                >
                    <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--ui-text-primary)' }}>
                            Aktifkan Mode Maintenance
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--ui-text-secondary)' }}>
                            Semua pengguna tidak dapat mengakses dashboard saat maintenance.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const newVal = settings.maintenance_mode === 'true' ? 'false' : 'true';
                            setSettings(s => ({ ...s, maintenance_mode: newVal }));
                            saveSetting('maintenance_mode', newVal);
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${settings.maintenance_mode === 'true' ? 'bg-red-500' : ''}`}
                        style={settings.maintenance_mode !== 'true' ? { background: 'var(--ui-border)' } : {}}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.maintenance_mode === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
                {settings.maintenance_mode === 'true' && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm border"
                        style={{ background: 'color-mix(in srgb, #EF4444 10%, transparent)', borderColor: 'color-mix(in srgb, #EF4444 25%, transparent)', color: '#EF4444' }}>
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Mode maintenance aktif! Semua user tidak bisa masuk ke dashboard.</span>
                    </div>
                )}
            </Section>

            {/* 2. Announcement */}
            <Section title="Pengumuman Global" icon={<Megaphone className="w-5 h-5 text-amber-500" />}>
                <p className="text-sm -mt-2" style={{ color: 'var(--ui-text-secondary)' }}>
                    Pesan ini akan ditampilkan sebagai banner di dashboard semua pengguna. Kosongkan untuk tidak menampilkan pengumuman.
                </p>
                <textarea
                    value={settings.announcement}
                    onChange={e => setSettings(s => ({ ...s, announcement: e.target.value }))}
                    rows={3}
                    placeholder="Contoh: Selamat! Fitur baru telah tersedia. Cek halaman undangan Anda."
                    className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all resize-none border"
                    style={{
                        background: 'var(--ui-input-bg)',
                        borderColor: 'var(--ui-input-border)',
                        color: 'var(--ui-text-primary)',
                    }}
                />
                {settings.announcement && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-2xl text-sm border"
                        style={{ background: 'var(--ui-announcement-bg)', borderColor: 'var(--ui-announcement-border)', color: 'var(--ui-announcement-text)' }}>
                        <Megaphone className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{settings.announcement}</span>
                    </div>
                )}
                <div className="flex justify-end">
                    <SaveButton onClick={() => saveSetting('announcement', settings.announcement)}
                        saving={saving === 'announcement'} saved={saved === 'announcement'} />
                </div>
            </Section>

            {/* 3. Quota */}
            <Section title="Batas Undangan per User" icon={<Users className="w-5 h-5 text-blue-500" />}>
                <p className="text-sm -mt-2" style={{ color: 'var(--ui-text-secondary)' }}>
                    Batasi berapa banyak undangan yang bisa dibuat oleh satu akun pengguna.
                </p>
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 border"
                        style={{ background: 'var(--ui-input-bg)', borderColor: 'var(--ui-input-border)' }}
                    >
                        <span className="text-sm" style={{ color: 'var(--ui-text-secondary)' }}>Maksimal</span>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={settings.max_weddings_per_user}
                            onChange={e => setSettings(s => ({ ...s, max_weddings_per_user: e.target.value }))}
                            className="w-16 text-center font-bold text-lg focus:outline-none bg-transparent"
                            style={{ color: 'var(--ui-text-primary)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--ui-text-secondary)' }}>undangan</span>
                    </div>
                    <SaveButton onClick={() => saveSetting('max_weddings_per_user', settings.max_weddings_per_user)}
                        saving={saving === 'max_weddings_per_user'} saved={saved === 'max_weddings_per_user'}
                        disabled={!settings.max_weddings_per_user || parseInt(settings.max_weddings_per_user) < 1} />
                </div>
                <p className="text-xs" style={{ color: 'var(--ui-text-muted)' }}>
                    Nilai saat ini: <strong>{settings.max_weddings_per_user}</strong> undangan per akun.
                    Ubah ke angka besar (misal 999) untuk unlimited.
                </p>
            </Section>

            {/* 4. WA Template */}
            <Section title="Template Pesan WhatsApp Default" icon={<MessageCircle className="w-5 h-5 text-[#25D366]" />}>
                <p className="text-sm -mt-2" style={{ color: 'var(--ui-text-secondary)' }}>
                    Template ini digunakan oleh pengguna yang belum mengatur pesan kustom mereka sendiri.
                </p>

                <div className="rounded-2xl px-4 py-3 text-sm border"
                    style={{ background: 'color-mix(in srgb, #F59E0B 10%, transparent)', borderColor: 'color-mix(in srgb, #F59E0B 25%, transparent)', color: 'color-mix(in srgb, #92400E 70%, var(--ui-text-primary))' }}>
                    <strong>Variabel:</strong>{' '}
                    <code className="px-1.5 py-0.5 rounded font-mono text-xs"
                        style={{ background: 'color-mix(in srgb, #F59E0B 20%, transparent)' }}>{'{nama}'}</code> nama tamu,{' '}
                    <code className="px-1.5 py-0.5 rounded font-mono text-xs"
                        style={{ background: 'color-mix(in srgb, #F59E0B 20%, transparent)' }}>{'{mempelai}'}</code> nama pasangan,{' '}
                    <code className="px-1.5 py-0.5 rounded font-mono text-xs"
                        style={{ background: 'color-mix(in srgb, #F59E0B 20%, transparent)' }}>{'{link}'}</code> link undangan.
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium self-center" style={{ color: 'var(--ui-text-muted)' }}>Sisipkan:</span>
                    {[['nama', 'Nama tamu'], ['mempelai', 'Nama mempelai'], ['link', 'Link undangan']].map(([v, label]) => (
                        <button key={v} type="button" onClick={() => insertVar(v)} title={label}
                            className="px-2.5 py-1 bg-gold/10 text-primary border border-gold/20 rounded-lg text-xs font-mono font-bold hover:bg-gold/20 transition-all">
                            {`{${v}}`}
                        </button>
                    ))}
                </div>

                <textarea
                    value={settings.default_wa_template}
                    onChange={e => setSettings(s => ({ ...s, default_wa_template: e.target.value }))}
                    rows={10}
                    className="w-full rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none transition-all resize-y leading-relaxed border"
                    style={{
                        background: 'var(--ui-input-bg)',
                        borderColor: 'var(--ui-input-border)',
                        color: 'var(--ui-text-primary)',
                    }}
                />

                {showPreview && (
                    <div className="rounded-2xl p-4 border"
                        style={{ background: 'color-mix(in srgb, #10B981 8%, transparent)', borderColor: 'color-mix(in srgb, #10B981 25%, transparent)' }}>
                        <p className="text-xs font-bold mb-2" style={{ color: '#059669' }}>Preview</p>
                        <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed break-all" style={{ color: 'var(--ui-text-secondary)' }}>{preview}</pre>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button onClick={() => setShowPreview(v => !v)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${showPreview ? 'bg-gold/10 border-gold/30 text-primary' : ''}`}
                        style={!showPreview ? { borderColor: 'var(--ui-border)', color: 'var(--ui-text-secondary)' } : {}}>
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Tutup Preview' : 'Preview'}
                    </button>
                    <button onClick={() => setSettings(s => ({ ...s, default_wa_template: HARDCODED_DEFAULT }))}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all hover:border-red-300 hover:text-red-500"
                        style={{ borderColor: 'var(--ui-border)', color: 'var(--ui-text-secondary)' }}>
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <div className="ml-auto">
                        <SaveButton onClick={() => saveSetting('default_wa_template', settings.default_wa_template)}
                            saving={saving === 'default_wa_template'} saved={saved === 'default_wa_template'} />
                    </div>
                </div>
            </Section>
        </div>
    );
}

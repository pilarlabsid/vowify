'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Settings, MessageCircle, Users, Megaphone, Wrench,
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

interface Settings {
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
        <div className="bg-white border border-neutral-200 rounded-3xl p-7 shadow-sm space-y-5">
            <h2 className="font-bold text-neutral-800 flex items-center gap-2 text-base">
                {icon}
                {title}
            </h2>
            {children}
        </div>
    );
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>({
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
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-3">
                    <Settings className="w-7 h-7 text-gold" />
                    Pengaturan Aplikasi
                </h1>
                <p className="text-neutral-500 text-sm mt-1">Konfigurasi global yang berlaku untuk semua pengguna.</p>
            </div>

            {/* 1. Maintenance Mode */}
            <Section title="Mode Maintenance" icon={<Wrench className="w-5 h-5 text-red-500" />}>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div>
                        <p className="font-semibold text-neutral-800 text-sm">Aktifkan Mode Maintenance</p>
                        <p className="text-neutral-500 text-xs mt-0.5">
                            Semua pengguna tidak dapat mengakses dashboard saat maintenance.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const newVal = settings.maintenance_mode === 'true' ? 'false' : 'true';
                            setSettings(s => ({ ...s, maintenance_mode: newVal }));
                            saveSetting('maintenance_mode', newVal);
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${settings.maintenance_mode === 'true' ? 'bg-red-500' : 'bg-neutral-200'}`}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.maintenance_mode === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
                {settings.maintenance_mode === 'true' && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Mode maintenance aktif! Semua user tidak bisa masuk ke dashboard.</span>
                    </div>
                )}
            </Section>

            {/* 2. Announcement */}
            <Section title="Pengumuman Global" icon={<Megaphone className="w-5 h-5 text-amber-500" />}>
                <p className="text-neutral-500 text-sm -mt-2">
                    Pesan ini akan ditampilkan sebagai banner di dashboard semua pengguna. Kosongkan untuk tidak menampilkan pengumuman.
                </p>
                <textarea
                    value={settings.announcement}
                    onChange={e => setSettings(s => ({ ...s, announcement: e.target.value }))}
                    rows={3}
                    placeholder="Contoh: Selamat! Fitur baru telah tersedia. Cek halaman undangan Anda."
                    className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 bg-neutral-50 focus:bg-white transition-all resize-none"
                />
                {settings.announcement && (
                    <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
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
                <p className="text-neutral-500 text-sm -mt-2">
                    Batasi berapa banyak undangan yang bisa dibuat oleh satu akun pengguna.
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 border border-neutral-200 rounded-2xl px-4 py-3 bg-neutral-50">
                        <span className="text-neutral-500 text-sm">Maksimal</span>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={settings.max_weddings_per_user}
                            onChange={e => setSettings(s => ({ ...s, max_weddings_per_user: e.target.value }))}
                            className="w-16 text-center font-bold text-neutral-900 text-lg focus:outline-none bg-transparent"
                        />
                        <span className="text-neutral-500 text-sm">undangan</span>
                    </div>
                    <SaveButton onClick={() => saveSetting('max_weddings_per_user', settings.max_weddings_per_user)}
                        saving={saving === 'max_weddings_per_user'} saved={saved === 'max_weddings_per_user'}
                        disabled={!settings.max_weddings_per_user || parseInt(settings.max_weddings_per_user) < 1} />
                </div>
                <p className="text-neutral-400 text-xs">
                    Nilai saat ini: <strong>{settings.max_weddings_per_user}</strong> undangan per akun.
                    Ubah ke angka besar (misal 999) untuk unlimited.
                </p>
            </Section>

            {/* 4. WA Template */}
            <Section title="Template Pesan WhatsApp Default" icon={<MessageCircle className="w-5 h-5 text-[#25D366]" />}>
                <p className="text-neutral-500 text-sm -mt-2">
                    Template ini digunakan oleh pengguna yang belum mengatur pesan kustom mereka sendiri.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-800">
                    <strong>Variabel:</strong>{' '}
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">{'{nama}'}</code> nama tamu,{' '}
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">{'{mempelai}'}</code> nama pasangan,{' '}
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">{'{link}'}</code> link undangan.
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-neutral-400 font-medium self-center">Sisipkan:</span>
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
                    className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gold/50 bg-neutral-50 focus:bg-white transition-all resize-y leading-relaxed"
                />

                {showPreview && (
                    <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50">
                        <p className="text-xs font-bold text-emerald-600 mb-2">Preview</p>
                        <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-sans leading-relaxed break-all">{preview}</pre>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button onClick={() => setShowPreview(v => !v)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${showPreview ? 'bg-gold/10 border-gold/30 text-primary' : 'border-neutral-200 text-neutral-500 hover:border-gold/30'}`}>
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Tutup Preview' : 'Preview'}
                    </button>
                    <button onClick={() => setSettings(s => ({ ...s, default_wa_template: HARDCODED_DEFAULT }))}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border border-neutral-200 text-neutral-500 hover:border-red-300 hover:text-red-500 transition-all">
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    RefreshCw, Eye, EyeOff, Star, Pencil, RotateCcw,
    CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
    Database, Code, Loader2,
} from 'lucide-react';

type TemplateAdminItem = {
    id: string;
    name: string;
    description: string;
    previewImage: string;
    features: string[];
    badge?: string;
    category: string;
    tier: string;
    tags: string[];
    status: string;
    isVisible: boolean;
    sortOrder: number;
    isSynced: boolean;
    dbValues: Record<string, any> | null;
    codeDefaults: {
        name: string;
        description: string;
        badge?: string;
        category: string;
        status: string;
        tier: string;
        features: string[];
        tags: string[];
    };
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(16,185,129,0.1)', text: '#34d399', label: 'Aktif' },
    draft: { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', label: 'Draft' },
    deprecated: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', label: 'Deprecated' },
};

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
    free: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa' },
    premium: { bg: 'rgba(168,85,247,0.1)', text: '#c084fc' },
    enterprise: { bg: 'rgba(201,169,94,0.1)', text: '#C6A75E' },
};

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<TemplateAdminItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<TemplateAdminItem>>({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/templates');
            const data = await res.json();
            setTemplates(data);
        } catch {
            showMessage('err', 'Gagal memuat daftar template.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

    function showMessage(type: 'ok' | 'err', text: string) {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    }

    async function handleSync() {
        setSyncing(true);
        try {
            const res = await fetch('/api/admin/templates', { method: 'POST' });
            const data = await res.json();
            showMessage('ok', data.message);
            fetchTemplates();
        } catch {
            showMessage('err', 'Gagal melakukan sync.');
        } finally {
            setSyncing(false);
        }
    }

    function startEdit(tpl: TemplateAdminItem) {
        setEditingId(tpl.id);
        setEditForm({
            name: tpl.dbValues?.name ?? '',
            description: tpl.dbValues?.description ?? '',
            badge: tpl.dbValues?.badge ?? '',
            status: tpl.dbValues?.status ?? tpl.codeDefaults.status,
            tier: tpl.dbValues?.tier ?? tpl.codeDefaults.tier,
            isVisible: tpl.isVisible,
            sortOrder: tpl.sortOrder,
        });
        setExpandedId(tpl.id);
    }

    async function handleSave(id: string) {
        setSaving(true);
        try {
            const body: Record<string, any> = {
                isVisible: editForm.isVisible,
                sortOrder: editForm.sortOrder ?? 0,
            };
            // Kirim null untuk field yang dikosongkan (hapus override, gunakan kode default)
            if (editForm.name?.trim()) body.name = editForm.name.trim();
            else body.name = null;
            if (editForm.description?.trim()) body.description = editForm.description.trim();
            else body.description = null;
            if (editForm.badge?.trim()) body.badge = editForm.badge.trim();
            else body.badge = null;
            body.status = editForm.status;
            body.tier = editForm.tier;

            const res = await fetch(`/api/admin/templates/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                showMessage('ok', `Template "${id}" berhasil diperbarui.`);
                setEditingId(null);
                fetchTemplates();
            } else {
                const d = await res.json();
                showMessage('err', d.error ?? 'Gagal menyimpan.');
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleReset(id: string) {
        if (!confirm(`Reset semua override untuk "${id}"? Template akan kembali ke nilai kode.`)) return;
        const res = await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showMessage('ok', `Override "${id}" direset ke nilai kode.`);
            fetchTemplates();
        }
    }

    async function quickToggle(id: string, field: 'isVisible', value: boolean) {
        await fetch(`/api/admin/templates/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: value }),
        });
        fetchTemplates();
    }

    async function quickStatus(id: string, status: string) {
        await fetch(`/api/admin/templates/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchTemplates();
    }

    const unsyncedCount = templates.filter(t => !t.isSynced).length;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--ui-text-primary)' }}>
                        Manajemen Template
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--ui-text-secondary)' }}>
                        Kelola metadata template tanpa deploy ulang. Perubahan langsung aktif.
                    </p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(201,169,94,0.15)', color: '#C6A75E', border: '1px solid rgba(201,169,94,0.3)' }}
                >
                    {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Sync dari Kode
                </button>
            </div>

            {/* Alert message */}
            {message && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                        background: message.type === 'ok' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: message.type === 'ok' ? '#34d399' : '#f87171',
                        border: `1px solid ${message.type === 'ok' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}>
                    {message.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {message.text}
                </div>
            )}

            {/* Sync warning */}
            {unsyncedCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                        <strong>{unsyncedCount} template</strong> belum tersinkron ke database.
                        Klik <strong>Sync dari Kode</strong> untuk membuat record-nya.
                    </span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Template', value: templates.length, color: '#C6A75E' },
                    { label: 'Aktif', value: templates.filter(t => t.status === 'active').length, color: '#34d399' },
                    { label: 'Terlihat User', value: templates.filter(t => t.isVisible).length, color: '#60a5fa' },
                    { label: 'Tersinkron', value: templates.filter(t => t.isSynced).length, color: '#a78bfa' },
                ].map(s => (
                    <div key={s.label} className="rounded-xl p-4" style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)' }}>
                        <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--ui-text-muted)' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Template list */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C6A75E' }} />
                </div>
            ) : (
                <div className="space-y-3">
                    {templates.map(tpl => (
                        <div key={tpl.id} className="rounded-2xl overflow-hidden"
                            style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)' }}>

                            {/* Row utama */}
                            <div className="flex items-center gap-4 p-4">
                                {/* Preview mini */}
                                <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-800">
                                    <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-sm" style={{ color: 'var(--ui-text-primary)' }}>{tpl.name}</span>
                                        <code className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                                            style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                                            {tpl.id}
                                        </code>
                                        {/* Status badge */}
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                            style={{
                                                background: (STATUS_COLORS[tpl.status] ?? STATUS_COLORS.active).bg,
                                                color: (STATUS_COLORS[tpl.status] ?? STATUS_COLORS.active).text,
                                            }}>
                                            {STATUS_COLORS[tpl.status]?.label ?? tpl.status}
                                        </span>
                                        {/* Tier badge */}
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                            style={{
                                                background: (TIER_COLORS[tpl.tier] ?? TIER_COLORS.free).bg,
                                                color: (TIER_COLORS[tpl.tier] ?? TIER_COLORS.free).text,
                                            }}>
                                            {tpl.tier}
                                        </span>
                                        {/* Sync status */}
                                        {tpl.isSynced
                                            ? <span className="flex items-center gap-1 text-[10px]" style={{ color: '#34d399' }}><Database className="w-3 h-3" />DB</span>
                                            : <span className="flex items-center gap-1 text-[10px]" style={{ color: '#fbbf24' }}><Code className="w-3 h-3" />Kode saja</span>
                                        }
                                    </div>
                                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--ui-text-muted)' }}>{tpl.description}</p>
                                </div>

                                {/* Quick actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Toggle visibility */}
                                    <button
                                        onClick={() => quickToggle(tpl.id, 'isVisible', !tpl.isVisible)}
                                        title={tpl.isVisible ? 'Sembunyikan dari user' : 'Tampilkan ke user'}
                                        className="p-2 rounded-lg transition-all"
                                        style={{
                                            background: tpl.isVisible ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: tpl.isVisible ? '#34d399' : '#f87171',
                                        }}>
                                        {tpl.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>

                                    {/* Quick status toggle */}
                                    <select
                                        value={tpl.status}
                                        onChange={e => quickStatus(tpl.id, e.target.value)}
                                        className="text-xs px-2 py-1.5 rounded-lg outline-none"
                                        style={{
                                            background: 'var(--ui-bg-hover)',
                                            border: '1px solid var(--ui-border)',
                                            color: 'var(--ui-text-primary)',
                                        }}>
                                        <option value="active">Aktif</option>
                                        <option value="draft">Draft</option>
                                        <option value="deprecated">Deprecated</option>
                                    </select>

                                    {/* Edit */}
                                    <button onClick={() => editingId === tpl.id ? setEditingId(null) : startEdit(tpl)}
                                        className="p-2 rounded-lg transition-all hover:text-gold"
                                        style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                                        <Pencil className="w-4 h-4" />
                                    </button>

                                    {/* Reset */}
                                    {tpl.isSynced && (
                                        <button onClick={() => handleReset(tpl.id)}
                                            title="Reset ke nilai kode"
                                            className="p-2 rounded-lg transition-all hover:text-yellow-400"
                                            style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    )}

                                    {/* Expand */}
                                    <button onClick={() => setExpandedId(expandedId === tpl.id ? null : tpl.id)}
                                        className="p-2 rounded-lg transition-all"
                                        style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                                        {expandedId === tpl.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Edit form */}
                            {editingId === tpl.id && (
                                <div className="border-t px-4 pb-4 pt-3 space-y-3"
                                    style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ui-text-muted)' }}>
                                        Override Metadata — kosongkan field untuk gunakan nilai dari kode
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs mb-1 block" style={{ color: 'var(--ui-text-muted)' }}>
                                                Nama <span style={{ color: 'var(--ui-text-muted)' }}>(kode: {tpl.codeDefaults.name})</span>
                                            </label>
                                            <input value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                                placeholder={tpl.codeDefaults.name}
                                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-primary)' }} />
                                        </div>
                                        <div>
                                            <label className="text-xs mb-1 block" style={{ color: 'var(--ui-text-muted)' }}>
                                                Badge <span style={{ color: 'var(--ui-text-muted)' }}>(kode: {tpl.codeDefaults.badge ?? '-'})</span>
                                            </label>
                                            <input value={editForm.badge ?? ''} onChange={e => setEditForm(f => ({ ...f, badge: e.target.value }))}
                                                placeholder="Populer, Baru, ..."
                                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-primary)' }} />
                                        </div>
                                        <div>
                                            <label className="text-xs mb-1 block" style={{ color: 'var(--ui-text-muted)' }}>Status</label>
                                            <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-primary)' }}>
                                                <option value="active">Aktif</option>
                                                <option value="draft">Draft</option>
                                                <option value="deprecated">Deprecated</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs mb-1 block" style={{ color: 'var(--ui-text-muted)' }}>Tier</label>
                                            <select value={editForm.tier} onChange={e => setEditForm(f => ({ ...f, tier: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-primary)' }}>
                                                <option value="free">Free</option>
                                                <option value="premium">Premium</option>
                                                <option value="enterprise">Enterprise</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs mb-1 block" style={{ color: 'var(--ui-text-muted)' }}>Sort Order</label>
                                            <input type="number" value={editForm.sortOrder ?? 0}
                                                onChange={e => setEditForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-primary)' }} />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id={`vis-${tpl.id}`} checked={editForm.isVisible ?? true}
                                                onChange={e => setEditForm(f => ({ ...f, isVisible: e.target.checked }))}
                                                className="w-4 h-4" />
                                            <label htmlFor={`vis-${tpl.id}`} className="text-sm" style={{ color: 'var(--ui-text-primary)' }}>
                                                Tampilkan ke user
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs mb-1 block" style={{ color: 'var(--ui-text-muted)' }}>Deskripsi</label>
                                        <textarea value={editForm.description ?? ''} rows={2}
                                            onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                            placeholder={tpl.codeDefaults.description}
                                            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                                            style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-primary)' }} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSave(tpl.id)} disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                            style={{ background: '#C6A75E', color: '#1C1612' }}>
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                            Simpan
                                        </button>
                                        <button onClick={() => setEditingId(null)}
                                            className="px-4 py-2 rounded-xl text-sm font-medium"
                                            style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Expanded detail */}
                            {expandedId === tpl.id && editingId !== tpl.id && (
                                <div className="border-t px-4 pb-4 pt-3"
                                    style={{ borderColor: 'var(--ui-border)', background: 'var(--ui-bg-hover)' }}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--ui-text-muted)' }}>
                                                Nilai Aktif (dari {tpl.dbValues ? 'DB override' : 'kode'})
                                            </p>
                                            <div className="space-y-1 text-xs" style={{ color: 'var(--ui-text-primary)' }}>
                                                <p><span style={{ color: 'var(--ui-text-muted)' }}>Kategori:</span> {tpl.category}</p>
                                                <p><span style={{ color: 'var(--ui-text-muted)' }}>Features:</span> {tpl.features.join(', ')}</p>
                                                <p><span style={{ color: 'var(--ui-text-muted)' }}>Tags:</span> {tpl.tags?.join(', ') || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--ui-text-muted)' }}>
                                                Nilai Kode (default)
                                            </p>
                                            <div className="space-y-1 text-xs" style={{ color: 'var(--ui-text-secondary)' }}>
                                                <p><span style={{ color: 'var(--ui-text-muted)' }}>Status:</span> {tpl.codeDefaults.status}</p>
                                                <p><span style={{ color: 'var(--ui-text-muted)' }}>Tier:</span> {tpl.codeDefaults.tier}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

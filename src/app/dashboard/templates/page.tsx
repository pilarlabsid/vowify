'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Eye, Play, Search } from 'lucide-react';
import { useDashboard } from '../dashboard-context';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ACTIVE_TEMPLATES, TemplateCategory } from '@/templates/registry';

// Label tampilan untuk tiap kategori
const CATEGORY_LABELS: Record<string, string> = {
    all: 'Semua',
    tradisional: 'Tradisional',
    modern: 'Modern',
    elegant: 'Elegant',
    floral: 'Floral',
    rustic: 'Rustic',
    islamic: 'Islami',
    other: 'Lainnya',
};

// Hitung berapa template per kategori (hanya yang punya template aktif)
function buildCategoryTabs(templates: typeof ACTIVE_TEMPLATES) {
    const counts: Record<string, number> = { all: templates.length };
    for (const t of templates) {
        counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return Object.entries(counts)
        .filter(([, count]) => count > 0)
        .map(([cat, count]) => ({ cat, count }));
}

export default function TemplatesPage() {
    const { selectedWedding, setSelectedWedding } = useDashboard();
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [search, setSearch] = useState('');

    const tabs = useMemo(() => buildCategoryTabs(ACTIVE_TEMPLATES), []);

    const filtered = useMemo(() => {
        let list = ACTIVE_TEMPLATES;
        if (activeCategory !== 'all') {
            list = list.filter(t => t.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.tags?.some((tag: string) => tag.includes(q))
            );
        }
        return list;
    }, [activeCategory, search]);

    const handleSelectTemplate = async (templateId: string) => {
        if (!selectedWedding) return;
        try {
            const res = await fetch(`/api/weddings/${selectedWedding.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ themeId: templateId }),
            });
            if (res.ok) {
                setSelectedWedding({ ...selectedWedding, themeId: templateId });
            }
        } catch (error) {
            console.error('Failed to update template:', error);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--ui-text-primary)' }}>Koleksi Template</h2>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--ui-text-secondary)' }}>
                        {ACTIVE_TEMPLATES.length} template tersedia — pilih desain impian pernikahan Anda.
                    </p>
                </div>
                {selectedWedding && (
                    <div className="bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-xl flex items-center gap-2 shrink-0">
                        <Palette className="w-4 h-4 text-gold" />
                        <div>
                            <p className="text-[9px] text-gold uppercase font-bold tracking-wider">Terpilih</p>
                            <p className="text-xs font-bold text-primary">{selectedWedding.brideShort} & {selectedWedding.groomShort}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--ui-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Cari template..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 text-sm rounded-xl outline-none"
                        style={{
                            background: 'var(--ui-bg-card)',
                            border: '1px solid var(--ui-border)',
                            color: 'var(--ui-text-primary)',
                        }}
                    />
                </div>

                {/* Category tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 shrink-0">
                    {tabs.map(({ cat, count }) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                            style={activeCategory === cat ? {
                                background: '#C6A75E',
                                color: '#1C1612',
                            } : {
                                background: 'var(--ui-bg-card)',
                                border: '1px solid var(--ui-border)',
                                color: 'var(--ui-text-secondary)',
                            }}
                        >
                            {CATEGORY_LABELS[cat] ?? cat}
                            <span className="opacity-60 text-[10px]">{count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Hasil pencarian kosong */}
            {filtered.length === 0 && (
                <div className="py-16 text-center" style={{ color: 'var(--ui-text-muted)' }}>
                    <p className="text-sm">Tidak ada template ditemukan untuk "{search}"</p>
                    <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="mt-2 text-xs underline">
                        Reset filter
                    </button>
                </div>
            )}

            {/* Grid template */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((template, index) => (
                        <motion.div
                            key={template.id}
                            layout
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                            className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold/10"
                            style={{
                                background: 'var(--ui-bg-card)',
                                border: selectedWedding?.themeId === template.id
                                    ? '1.5px solid #C6A75E'
                                    : '1px solid var(--ui-border)',
                                boxShadow: selectedWedding?.themeId === template.id
                                    ? '0 0 0 2px rgba(198,167,94,0.15)'
                                    : 'var(--ui-shadow)',
                            }}
                        >
                            {/* Preview Image */}
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <Image
                                    src={template.previewImage}
                                    alt={template.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {template.features.slice(0, 3).map((f: string) => (
                                            <span key={f} className="text-[9px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full border border-white/20">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {template.badge && (
                                        <span className="px-2 py-0.5 bg-gold text-primary text-[9px] font-bold rounded-full">
                                            {template.badge}
                                        </span>
                                    )}
                                    {template.tier === 'premium' && (
                                        <span className="px-2 py-0.5 bg-purple-500/80 backdrop-blur text-white text-[9px] font-bold rounded-full">
                                            Premium
                                        </span>
                                    )}
                                </div>

                                {/* Active Checkmark */}
                                {selectedWedding?.themeId === template.id && (
                                    <div className="absolute top-2 right-2 bg-gold text-primary p-1 rounded-full shadow-lg">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-3 space-y-2.5">
                                <div>
                                    <h3 className="text-sm font-bold leading-tight" style={{ color: 'var(--ui-text-primary)' }}>{template.name}</h3>
                                    <p className="text-[11px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: 'var(--ui-text-muted)' }}>
                                        {template.description}
                                    </p>
                                </div>

                                {/* Action row */}
                                <div className="flex items-center gap-1.5">
                                    {selectedWedding ? (
                                        <button
                                            onClick={() => handleSelectTemplate(template.id)}
                                            disabled={selectedWedding.themeId === template.id}
                                            className="flex-1 py-2 rounded-xl font-bold text-xs transition-all"
                                            style={selectedWedding.themeId === template.id ? {
                                                background: 'var(--ui-bg-hover)',
                                                color: 'var(--ui-text-muted)',
                                                cursor: 'not-allowed',
                                            } : {
                                                background: '#C6A75E',
                                                color: '#1C1612',
                                            }}
                                        >
                                            {selectedWedding.themeId === template.id ? 'Digunakan ✓' : 'Gunakan'}
                                        </button>
                                    ) : (
                                        <div className="flex-1 text-center py-2 rounded-xl text-[10px] font-medium"
                                            style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                                            Pilih undangan
                                        </div>
                                    )}

                                    <Link
                                        href={`/preview/${template.id}`}
                                        target="_blank"
                                        title="Demo Preview"
                                        className="p-1.5 rounded-xl transition-all hover:text-gold"
                                        style={{ background: 'var(--ui-bg-hover)', border: '1px solid var(--ui-border)', color: 'var(--ui-text-muted)' }}
                                    >
                                        <Play className="w-3.5 h-3.5" />
                                    </Link>
                                    {selectedWedding && (
                                        <Link
                                            href={`/${selectedWedding.slug}?theme=${template.id}`}
                                            target="_blank"
                                            title="Live Preview dengan data saya"
                                            className="p-1.5 rounded-xl text-gold hover:bg-gold hover:text-primary transition-all"
                                            style={{ border: '1px solid rgba(198,167,94,0.3)', background: 'rgba(198,167,94,0.08)' }}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

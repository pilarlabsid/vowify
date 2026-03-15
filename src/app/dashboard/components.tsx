'use client';
import { Heart, Plus, Calendar, MapPin, Users, Loader2, Trash2, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

// Form controls
export const Section = ({ title, children }: any) => (
    <div
        className="rounded-3xl p-6 border space-y-4"
        style={{
            background: 'var(--ui-bg-card)',
            borderColor: 'var(--ui-border)',
            boxShadow: 'var(--ui-shadow)',
        }}
    >
        <h3 className="font-bold" style={{ color: 'var(--ui-text-primary)' }}>{title}</h3>
        {children}
    </div>
);

export const FormGrid = ({ children }: any) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

export const FormField = ({ label, value, onChange, placeholder, type = 'text', required }: any) => (
    <div className="space-y-1.5">
        <label
            className="block text-xs font-semibold uppercase tracking-wider pl-1"
            style={{ color: 'var(--ui-text-secondary)' }}
        >
            {label}
        </label>
        <motion.div
            whileFocus={{ scale: 1.005 }}
            className="relative"
        >
            <input
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-2xl px-4 py-3.5 text-sm focus:outline-none transition-all border outline-none focus:ring-2 focus:ring-gold/30"
                style={{
                    background: 'var(--ui-input-bg)',
                    borderColor: 'var(--ui-input-border)',
                    color: 'var(--ui-text-primary)',
                }}
            />
        </motion.div>
    </div>
);

export const StatCard = ({ label, value, sub, icon, color }: any) => {
    const colorStyles: any = {
        gold: { background: 'color-mix(in srgb, #F59E0B 12%, transparent)', color: '#D97706' },
        emerald: { background: 'color-mix(in srgb, #10B981 12%, transparent)', color: '#059669' },
        blue: { background: 'color-mix(in srgb, #3B82F6 12%, transparent)', color: '#2563EB' },
        red: { background: 'color-mix(in srgb, #EF4444 12%, transparent)', color: '#DC2626' },
    };
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 border transition-all"
            style={{
                background: 'var(--ui-bg-card)',
                borderColor: 'var(--ui-border)',
                boxShadow: 'var(--ui-shadow)',
            }}
        >
            <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform" 
                style={colorStyles[color] || {}}
            >
                {icon}
            </motion.div>
            <p className="text-3xl font-bold tabular-nums" style={{ color: 'var(--ui-text-primary)' }}>{value}</p>
            <p className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--ui-text-muted)' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ui-text-muted)' }}>{sub}</p>
        </motion.div>
    );
};

export const EmptyState = ({ title, desc, cta, onCta }: any) => (
    <div
        className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border-2 border-dashed"
        style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}
    >
        <Heart className="w-12 h-12 mb-4 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--ui-text-secondary)' }}>{title}</h3>
        <p className="max-w-sm mt-2 text-sm" style={{ color: 'var(--ui-text-muted)' }}>{desc}</p>
        {cta && onCta && (
            <button type="button" onClick={onCta} className="mt-6 bg-gold text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-400 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> {cta}
            </button>
        )}
    </div>
);

export const SelectWeddingPrompt = () => (
    <div
        className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border-2 border-dashed"
        style={{ background: 'var(--ui-bg-hover)', borderColor: 'var(--ui-border)' }}
    >
        <Heart className="w-12 h-12 mb-4 opacity-20" style={{ color: 'var(--ui-text-muted)' }} />
        <p className="font-medium" style={{ color: 'var(--ui-text-secondary)' }}>Pilih undangan dari menu "Undangan Saya" terlebih dahulu.</p>
    </div>
);

export function WeddingCard({ wedding, selected, onSelect, onRefresh }: any) {
    const [deleting, setDeleting] = useState(false);
    const dateStr = new Date(wedding.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Hapus undangan "${wedding.groomShort} & ${wedding.brideShort}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeleting(true);
        await fetch(`/api/weddings/${wedding.id}`, { method: 'DELETE' });
        onRefresh?.();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onSelect}
            whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="rounded-3xl p-6 border cursor-pointer transition-all"
            style={{
                background: 'var(--ui-bg-card)',
                borderColor: selected ? '#C6A75E' : 'var(--ui-border)',
                boxShadow: selected ? '0 0 0 2px rgba(198,167,94,0.2)' : 'var(--ui-shadow)',
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg" style={{ color: 'var(--ui-text-primary)' }}>
                        {wedding.groomShort} & {wedding.brideShort}
                    </h3>
                    <p className="text-xs font-mono opacity-60" style={{ color: 'var(--ui-text-secondary)' }}>/{wedding.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                    <motion.span
                        initial={false}
                        animate={{ scale: wedding.isPublished ? 1 : 0.95 }}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={wedding.isPublished ? {
                            background: 'color-mix(in srgb, #10B981 12%, transparent)',
                            color: '#059669',
                            border: '1px solid color-mix(in srgb, #10B981 25%, transparent)',
                        } : {
                            background: 'var(--ui-badge-bg)',
                            color: 'var(--ui-text-muted)',
                        }}
                    >
                        {wedding.isPublished ? 'Published' : 'Draft'}
                    </motion.span>
                    {onRefresh && (
                        <button onClick={handleDelete} disabled={deleting} style={{ color: 'var(--ui-text-muted)' }} className="hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3 text-sm" style={{ color: 'var(--ui-text-secondary)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gold" />
                    </div>
                    <span className="font-medium">{dateStr}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gold" />
                    </div>
                    <span className="truncate opacity-80">{wedding.akadLocation}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gold" />
                    </div>
                    <span className="font-semibold">{wedding.greetings?.length ?? 0} RSVP</span>
                </div>
            </div>

            <div
                className="mt-6 pt-5 border-t flex gap-3"
                style={{ borderColor: 'var(--ui-divider)' }}
            >
                <Link
                    href={`/${wedding.slug}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-xs text-gold border border-gold/30 px-4 py-2 rounded-full hover:bg-gold hover:text-primary transition-all font-bold shadow-sm"
                >
                    <Eye className="w-3.5 h-3.5" /> Preview Undangan
                </Link>
            </div>
        </motion.div>
    );
}

export function TemplateSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const templates = [
        { id: 'javanese', name: 'Javanese', previewImage: '/images/templates/javanese.webp', isPremium: false },
        { id: 'minimalist', name: 'Minimalist', previewImage: '/images/templates/minimalist.webp', isPremium: false },
        { id: 'elegant', name: 'Elegant', previewImage: '/images/templates/elegant.webp', isPremium: true },
    ];

    return (
        <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ui-text-secondary)' }}>
                Pilih Template
            </label>
            <div className="grid grid-cols-3 gap-3">
                {templates.map((t) => (
                    <div key={t.id} className="relative group">
                        <button
                            type="button"
                            onClick={() => onChange(t.id)}
                            className={`w-full relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${value === t.id ? 'border-gold ring-2 ring-gold/20' : 'hover:border-gold/30'
                                }`}
                            style={value !== t.id ? { borderColor: 'var(--ui-border)' } : {}}
                        >
                            <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 transition-opacity ${value === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <span className="text-white font-bold text-xs bg-gold/80 px-3 py-1.5 rounded-full">
                                    {value === t.id ? '✓ Terpilih' : t.name}
                                </span>
                            </div>
                            {t.isPremium && (
                                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-purple-500/80 text-white text-[9px] font-bold rounded-full">PRO</div>
                            )}
                        </button>
                        <Link
                            href={`/preview/${t.id}`}
                            target="_blank"
                            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-gold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-white"
                            title={`Preview ${t.name}`}
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <p className="text-center text-[10px] mt-1.5 font-medium" style={{ color: 'var(--ui-text-muted)' }}>{t.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

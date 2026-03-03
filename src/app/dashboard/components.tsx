'use client';
import { Heart, Plus, Calendar, MapPin, Users, Loader2, Trash2, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

// Form controls
export const Section = ({ title, children }: any) => (
    <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-neutral-800">{title}</h3>
        {children}
    </div>
);

export const FormGrid = ({ children }: any) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

export const FormField = ({ label, value, onChange, placeholder, type = 'text', required }: any) => (
    <div>
        <label className="block text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1.5">{label}</label>
        <input
            type={type}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-all bg-neutral-50 focus:bg-white"
        />
    </div>
);

export const StatCard = ({ label, value, sub, icon, color }: any) => {
    const colors: any = {
        gold: 'bg-amber-50 text-amber-500',
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
    };
    return (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
            <p className="text-3xl font-bold text-neutral-900 tabular-nums">{value}</p>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mt-1">{label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
        </div>
    );
};

export const EmptyState = ({ title, desc, cta, onCta }: any) => (
    <div className="flex flex-col items-center justify-center py-24 text-center text-neutral-400 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
        <Heart className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="text-lg font-semibold text-neutral-500">{title}</h3>
        <p className="max-w-sm mt-2 text-sm">{desc}</p>
        {cta && onCta && (
            <button type="button" onClick={onCta} className="mt-6 bg-gold text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-400 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> {cta}
            </button>
        )}
    </div>
);

export const SelectWeddingPrompt = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center text-neutral-400 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
        <Heart className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-neutral-500 font-medium">Pilih undangan dari menu "Undangan Saya" terlebih dahulu.</p>
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
            onClick={onSelect}
            whileHover={{ y: -2 }}
            className={`bg-white border rounded-3xl p-6 shadow-sm cursor-pointer transition-all ${selected ? 'border-gold ring-2 ring-gold/20' : 'border-neutral-200 hover:border-gold/30 hover:shadow-md'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-neutral-900 text-lg">{wedding.groomShort} & {wedding.brideShort}</h3>
                    <p className="text-neutral-500 text-sm font-mono">/{wedding.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${wedding.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {wedding.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {onRefresh && (
                        <button onClick={handleDelete} disabled={deleting} className="text-neutral-300 hover:text-red-400 transition-colors p-1">
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold/60" />
                    <span>{dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold/60" />
                    <span className="truncate">{wedding.akadLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold/60" />
                    <span>{wedding.greetings?.length ?? 0} RSVP</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-2">
                <Link
                    href={`/${wedding.slug}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-full hover:bg-gold hover:text-primary transition-all font-semibold"
                >
                    <Eye className="w-3 h-3" /> Preview
                </Link>
            </div>
        </motion.div>
    );
}

export function TemplateSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    // Reads from central registry - auto-updates when new templates are added
    const templates = [
        { id: 'javanese', name: 'Javanese', previewImage: '/images/templates/javanese.png', isPremium: false },
        { id: 'minimalist', name: 'Minimalist', previewImage: '/images/templates/minimalist.png', isPremium: false },
        { id: 'elegant', name: 'Elegant', previewImage: '/images/templates/elegant.png', isPremium: true },
    ];

    return (
        <div className="space-y-3">
            <label className="block text-neutral-500 text-xs font-semibold uppercase tracking-wider">Pilih Template</label>
            <div className="grid grid-cols-3 gap-3">
                {templates.map((t) => (
                    <div key={t.id} className="relative group">
                        <button
                            type="button"
                            onClick={() => onChange(t.id)}
                            className={`w-full relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${value === t.id ? 'border-gold ring-2 ring-gold/20' : 'border-neutral-200 hover:border-gold/30'
                                }`}
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
                        <p className="text-center text-[10px] text-neutral-400 mt-1.5 font-medium">{t.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

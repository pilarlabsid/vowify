'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Palette, Eye, Play } from 'lucide-react';
import { useDashboard } from '../dashboard-context';
import Link from 'next/link';
import { TEMPLATES } from '@/lib/templates';

export default function TemplatesPage() {
    const { selectedWedding, setSelectedWedding } = useDashboard();

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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-800">Koleksi Template</h2>
                    <p className="text-neutral-500">Pilih desain yang paling sesuai dengan impian pernikahan Anda.</p>
                </div>
                {selectedWedding && (
                    <div className="bg-gold/10 border border-gold/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                        <Palette className="w-5 h-5 text-gold" />
                        <div>
                            <p className="text-[10px] text-gold uppercase font-bold tracking-wider">Undangan Terpilih</p>
                            <p className="text-sm font-bold text-primary">{selectedWedding.brideShort} & {selectedWedding.groomShort}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TEMPLATES.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group bg-white rounded-[32px] overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:shadow-gold/10 ${selectedWedding?.themeId === template.id
                            ? 'border-gold ring-1 ring-gold'
                            : 'border-neutral-200'
                            }`}
                    >
                        {/* Preview Image */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                                src={template.previewImage}
                                alt={template.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Feature Pills on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {template.features.map(f => (
                                        <span key={f} className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full border border-white/20">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                {template.badge && (
                                    <span className="px-2.5 py-1 bg-gold text-primary text-[10px] font-bold rounded-full">
                                        {template.badge}
                                    </span>
                                )}
                                {template.isPremium && (
                                    <span className="px-2.5 py-1 bg-purple-500/80 backdrop-blur text-white text-[10px] font-bold rounded-full">
                                        Premium
                                    </span>
                                )}
                            </div>

                            {/* Active Checkmark */}
                            {selectedWedding?.themeId === template.id && (
                                <div className="absolute top-4 right-4 bg-gold text-primary p-2 rounded-full shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-800">{template.name}</h3>
                                <p className="text-neutral-500 text-sm mt-1 leading-relaxed">
                                    {template.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                {/* Apply Button */}
                                {selectedWedding ? (
                                    <button
                                        onClick={() => handleSelectTemplate(template.id)}
                                        disabled={selectedWedding.themeId === template.id}
                                        className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${selectedWedding.themeId === template.id
                                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                            : 'bg-gold text-primary hover:bg-amber-400 shadow-lg shadow-gold/20'
                                            }`}
                                    >
                                        {selectedWedding.themeId === template.id ? 'Sedang Digunakan ✓' : 'Gunakan Template'}
                                    </button>
                                ) : (
                                    <div className="flex-1 text-center py-3 bg-neutral-50 rounded-2xl text-xs text-neutral-400 font-medium">
                                        Pilih undangan untuk mengganti tema
                                    </div>
                                )}

                                {/* Preview Links */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/preview/${template.id}`}
                                        target="_blank"
                                        title="Demo Preview"
                                        className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-400 hover:text-gold hover:border-gold/30 transition-all"
                                    >
                                        <Play className="w-4 h-4" />
                                    </Link>
                                    {selectedWedding && (
                                        <Link
                                            href={`/${selectedWedding.slug}?theme=${template.id}`}
                                            target="_blank"
                                            title="Live Preview dengan data saya"
                                            className="p-3 bg-neutral-50 border border-gold/30 rounded-2xl text-gold hover:bg-gold hover:text-primary transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

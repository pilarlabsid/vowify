'use client';

import { AlertTriangle, Save, LogOut, X } from 'lucide-react';

interface UnsavedChangesModalProps {
    onSave: () => void;
    onDiscard: () => void;
    onCancel: () => void;
    saving?: boolean;
}

export function UnsavedChangesModal({ onSave, onDiscard, onCancel, saving }: UnsavedChangesModalProps) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(6px)' }}>

            <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--ui-bg-card)', border: '1px solid var(--ui-border)' }}>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-base" style={{ color: 'var(--ui-text-primary)' }}>
                            Perubahan belum disimpan
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--ui-text-muted)' }}>
                            Foto yang baru diupload akan dihapus jika Anda keluar tanpa menyimpan.
                        </p>
                    </div>
                    <button onClick={onCancel}
                        className="w-7 h-7 flex items-center justify-center rounded-full transition-all shrink-0"
                        style={{ background: 'var(--ui-bg-hover)', color: 'var(--ui-text-muted)' }}>
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--ui-border)', margin: '0 24px' }} />

                {/* Actions */}
                <div className="px-6 py-4 flex flex-col gap-2">
                    <button onClick={onSave} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                        style={{ background: 'var(--color-gold, #c9a96e)', color: '#1a0f0a' }}>
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
                    </button>

                    <button onClick={onDiscard}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: 'var(--ui-bg-hover)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                        <LogOut className="w-4 h-4" />
                        Keluar Tanpa Simpan
                    </button>

                    <button onClick={onCancel}
                        className="w-full py-2 text-sm transition-all"
                        style={{ color: 'var(--ui-text-muted)' }}>
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

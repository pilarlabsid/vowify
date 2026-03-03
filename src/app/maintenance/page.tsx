'use client';

import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-elegant flex flex-col items-center justify-center text-cream p-8">
            <div className="w-20 h-20 bg-gold/10 border border-gold/30 rounded-3xl flex items-center justify-center mb-8">
                <Wrench className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-3xl font-bold text-gold font-script mb-3">Vowify.id</h1>
            <h2 className="text-xl font-bold text-cream mb-4">Sedang dalam Pemeliharaan</h2>
            <p className="text-cream/60 text-center max-w-sm leading-relaxed">
                Kami sedang melakukan pembaruan sistem untuk memberikan pengalaman yang lebih baik.
                Silakan kembali lagi dalam beberapa saat.
            </p>
            <p className="text-cream/30 text-sm mt-8">Terima kasih atas kesabarannya 🙏</p>
        </div>
    );
}

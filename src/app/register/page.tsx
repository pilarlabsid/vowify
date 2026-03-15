'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function RegisterRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/login?mode=register');
    }, [router]);

    return (
        <main data-zone="landing" className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--lp-bg)" }}>
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "var(--lp-gold)" }} />
                <p className="text-sm font-medium opacity-50">Mengalihkan ke halaman pendaftaran...</p>
            </div>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterRedirect />
        </Suspense>
    );
}

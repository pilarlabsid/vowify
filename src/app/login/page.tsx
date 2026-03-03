'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

import { Suspense } from 'react';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const justVerified = searchParams.get('verified') === '1';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setLoading(false);
            if (res.error === 'EMAIL_NOT_VERIFIED') {
                setError('Email belum diverifikasi. Cek inbox Anda atau daftar ulang.');
            } else if (res.error === 'ACCOUNT_BLOCKED') {
                setError('Akun Anda telah diblokir. Hubungi admin.');
            } else {
                setError('Email atau password salah.');
            }
        } else {
            // Fetch session fresh from server (not cache) to reliably read role
            const sessionRes = await fetch('/api/auth/session');
            const session = await sessionRes.json();
            const role = session?.user?.role;
            // Use window.location for hard navigation so session cookie is fresh
            window.location.href = role === 'admin' ? '/admin' : '/dashboard';
        }
    };

    return (
        <main className="min-h-screen bg-elegant flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-script text-gold mb-2">Vowify.id</h1>
                    <p className="text-cream/50 text-sm">Platform Undangan Pernikahan Digital</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-gold/15 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-cream mb-2">Masuk ke Akun</h2>
                    <p className="text-cream/50 text-sm mb-8">Kelola undangan digital Anda</p>

                    {justVerified && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                            <p className="text-emerald-400 text-sm">Email berhasil diverifikasi! Silakan masuk.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-cream/70 text-xs font-semibold uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-cream/10 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all text-sm"
                                placeholder="email@contoh.com"
                            />
                        </div>

                        <div>
                            <label className="block text-cream/70 text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-cream/10 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all text-sm pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/80 transition-colors"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gold text-primary py-4 rounded-2xl font-bold hover:bg-cream transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk'}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-cream/5 text-center">
                        <p className="text-cream/40 text-sm">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-gold hover:text-cream transition-colors font-semibold">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-cream/20 text-xs mt-8">
                    © 2026 Vowify.id. All rights reserved.
                </p>
            </motion.div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center bg-elegant justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>}>
            <LoginContent />
        </Suspense>
    );
}

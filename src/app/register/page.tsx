'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

type Step = 'form' | 'otp' | 'done';

export default function RegisterPage() {
    const [step, setStep] = useState<Step>('form');

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    // OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Countdown for resend
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // ─── Step 1: Register → Send OTP ────────────────────────────────────────
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Pendaftaran gagal.');
            } else {
                setStep('otp');
                setResendCooldown(60);
            }
        } catch {
            setError('Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // ─── OTP input logic ─────────────────────────────────────────────────────
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    // ─── Step 2: Verify OTP ──────────────────────────────────────────────────
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpStr = otp.join('');
        if (otpStr.length !== 6) { setError('Masukkan 6 digit kode OTP.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpStr }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Verifikasi gagal.');
            } else {
                setStep('done');
                setTimeout(() => router.push('/login?verified=1'), 2500);
            }
        } catch {
            setError('Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setResendCooldown(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch {
            setError('Gagal mengirim ulang. Coba lagi.');
        }
    };

    return (
        <main className="min-h-screen bg-elegant flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-script text-gold mb-2">Vowify.id</h1>
                    <p className="text-cream/50 text-sm">Platform Undangan Pernikahan Digital</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-gold/15 rounded-3xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">

                        {/* ── STEP 1: Register Form ── */}
                        {step === 'form' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl font-bold text-cream mb-2">Buat Akun Baru</h2>
                                <p className="text-cream/50 text-sm mb-8">Mulai buat undangan digital impian Anda</p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-5">
                                    <div>
                                        <label className="block text-cream/70 text-xs font-semibold uppercase tracking-widest mb-2">Nama Lengkap</label>
                                        <input
                                            type="text" value={name} onChange={e => setName(e.target.value)} required
                                            className="w-full bg-white/5 border border-cream/10 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                                            placeholder="Nama Anda"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-cream/70 text-xs font-semibold uppercase tracking-widest mb-2">Email</label>
                                        <input
                                            type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                            className="w-full bg-white/5 border border-cream/10 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                                            placeholder="email@contoh.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-cream/70 text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPwd ? 'text' : 'password'} value={password}
                                                onChange={e => setPassword(e.target.value)} required minLength={8}
                                                className="w-full bg-white/5 border border-cream/10 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-all text-sm pr-12"
                                                placeholder="Min. 8 karakter"
                                            />
                                            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/80 transition-colors">
                                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit" disabled={loading}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gold text-primary py-4 rounded-2xl font-bold hover:bg-cream transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Daftar & Kirim OTP'}
                                    </motion.button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-cream/5 text-center">
                                    <p className="text-cream/40 text-sm">
                                        Sudah punya akun?{' '}
                                        <Link href="/login" className="text-gold hover:text-cream transition-colors font-semibold">Masuk</Link>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 2: OTP Verification ── */}
                        {step === 'otp' && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <button
                                    onClick={() => { setStep('form'); setError(''); }}
                                    className="flex items-center gap-1.5 text-cream/40 hover:text-cream/70 text-xs mb-6 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                                </button>

                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-gold" />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-cream mb-2 text-center">Cek Email Anda</h2>
                                <p className="text-cream/50 text-sm mb-2 text-center">
                                    Kode OTP 6 digit telah dikirim ke
                                </p>
                                <p className="text-gold font-semibold text-sm text-center mb-8 truncate">{email}</p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    {/* OTP Input */}
                                    <div className="flex justify-center gap-3">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={el => { inputRefs.current[i] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpChange(i, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                                onPaste={handleOtpPaste}
                                                className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border transition-all focus:outline-none bg-white/5 text-cream
                                                    ${digit ? 'border-gold/60 bg-gold/10' : 'border-cream/10 focus:border-gold/40'}`}
                                            />
                                        ))}
                                    </div>

                                    <motion.button
                                        type="submit" disabled={loading || otp.join('').length !== 6}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gold text-primary py-4 rounded-2xl font-bold hover:bg-cream transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verifikasi Email'}
                                    </motion.button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-cream/40 text-xs mb-3">Tidak menerima kode?</p>
                                    <button
                                        onClick={handleResend}
                                        disabled={resendCooldown > 0}
                                        className="flex items-center gap-2 mx-auto text-sm font-semibold text-gold hover:text-cream transition-colors disabled:text-cream/30 disabled:cursor-not-allowed"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        {resendCooldown > 0
                                            ? `Kirim ulang dalam ${resendCooldown}d`
                                            : 'Kirim Ulang OTP'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 3: Success ── */}
                        {step === 'done' && (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                    className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                                </motion.div>
                                <h2 className="text-xl font-bold text-cream mb-2">Email Terverifikasi! 🎉</h2>
                                <p className="text-cream/50 text-sm">Akun Anda sudah aktif. Mengalihkan ke halaman login...</p>
                                <Loader2 className="w-5 h-5 animate-spin text-gold mx-auto mt-6" />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {(['form', 'otp', 'done'] as Step[]).map((s, i) => (
                        <div
                            key={s}
                            className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-gold' : ((['form', 'otp', 'done'] as Step[]).indexOf(step) > i ? 'w-4 bg-gold/40' : 'w-4 bg-cream/10')}`}
                        />
                    ))}
                </div>
            </motion.div>
        </main>
    );
}

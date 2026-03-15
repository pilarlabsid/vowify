'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, CheckCircle, RefreshCw, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

type ForgotStep = 'email' | 'otp' | 'reset' | 'done';

function ForgotContent() {
    const router = useRouter();
    
    // UI State
    const [step, setStep] = useState<ForgotStep>('email');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    // Data State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // Step 1: Request OTP
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Terjadi kesalahan.');
            } else {
                setStep('otp');
                setResendCooldown(60);
            }
        } catch {
            setError('Gagal menghubungi server.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Move to Reset Password after OTP input (simulation or check)
    // Actually, we'll verify it in the final reset call, or we can check it now.
    // Let's just move to reset step if 6 digits are filled, the actual API will verify.
    const handleVerifyOtpFlow = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.join('').length === 6) {
            setStep('reset');
        } else {
            setError('Masukkan 6 digit kode OTP');
        }
    };

    // Step 3: Final Reset
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    otp: otp.join(''), 
                    password: newPassword 
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Reset password gagal.');
                // If OTP is invalid, maybe go back to OTP step?
                if (data.error?.includes('OTP')) setStep('otp');
            } else {
                setStep('done');
            }
        } catch {
            setError('Gagal menghubungi server.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Clean input to only allow digits
        const cleanValue = value.replace(/\D/g, '');
        if (!cleanValue && value !== '') return;

        const newOtp = [...otp];

        if (cleanValue.length > 1) {
            // Handle paste or multiple characters
            const digits = cleanValue.slice(0, 6).split('');
            digits.forEach((digit, i) => {
                if (i < 6) newOtp[i] = digit;
            });
            setOtp(newOtp);
            otpRefs.current[Math.min(digits.length - 1, 5)]?.focus();
        } else {
            // Handle single character change
            newOtp[index] = cleanValue;
            setOtp(newOtp);
            if (cleanValue && index < 5) {
                otpRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
    };

    return (
        <main data-zone="landing" className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "var(--lp-bg)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-full opacity-20 pointer-events-none" style={{ background: "var(--lp-gold-dim)" }} />

            <div className="w-full max-w-[440px] relative z-10">
                <div className="text-center mb-10">
                    <Link href="/">
                        <h1 className="text-5xl font-script mb-2 hover:opacity-80 transition-soft inline-block" style={{ color: "var(--lp-gold)" }}>Vowify.id</h1>
                    </Link>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40" style={{ color: "var(--lp-text)" }}>Premium Digital Invitation</p>
                </div>

                <motion.div
                    layout
                    className="bg-white/90 backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
                    style={{ borderColor: "var(--lp-border-subtle)" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                >
                    <div className="p-8 md:p-10">
                        <AnimatePresence mode="wait">
                            {step === 'email' && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold mb-1" style={{ color: "var(--lp-text)" }}>Lupa Password</h2>
                                        <p className="text-xs opacity-60" style={{ color: "var(--lp-text)" }}>Masukkan email Anda untuk menerima kode reset.</p>
                                    </div>

                                    {error && (
                                        <div className="p-3.5 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-xs text-center">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleRequestOtp} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1 opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Alamat Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                                                <input
                                                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                                    className="w-full bg-white border rounded-[1.5rem] pl-12 pr-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5"
                                                    style={{ borderColor: "var(--lp-border-subtle)" }}
                                                    placeholder="nama@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <motion.button
                                                whileHover={{ scale: 1.01, y: -2 }}
                                                whileTap={{ scale: 0.99, y: 0 }}
                                                type="submit" disabled={loading}
                                                className="w-full py-4 rounded-full bg-[var(--lp-gold)] text-white font-bold shadow-lg shadow-stone-200/50 disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Kode Reset'}
                                            </motion.button>
                                            
                                            <div className="mt-6 text-center">
                                                <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-[var(--lp-gold)] transition-soft">
                                                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali Login
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'otp' && (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <button
                                        onClick={() => setStep('email')}
                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-[var(--lp-gold)] transition-soft"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" /> Ubah Email
                                    </button>

                                    <div className="text-center">
                                        <div className="w-14 h-14 bg-[var(--lp-gold-dim)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--lp-gold)]/10">
                                            <KeyRound className="w-7 h-7 text-[var(--lp-gold)]" />
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold mb-1" style={{ color: "var(--lp-text)" }}>Verifikasi OTP</h2>
                                        <p className="text-[11px] text-stone-500 px-4 leading-relaxed">
                                            Masukkan 6 digit kode yang dikirim ke <span className="text-[var(--lp-gold)] font-bold">{email}</span>
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-xs text-center">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleVerifyOtpFlow} className="space-y-6">
                                        <div className="flex justify-between gap-1.5 px-1">
                                            {otp.map((d, i) => (
                                                <input
                                                    key={i} ref={el => { otpRefs.current[i] = el; }}
                                                    type="text" inputMode="numeric" value={d}
                                                    onChange={e => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                                    onFocus={e => e.target.select()}
                                                    className="w-full h-12 text-center text-xl font-bold rounded-xl border bg-white outline-none transition-soft focus:ring-4 focus:ring-[var(--lp-gold)]/5 focus:border-[var(--lp-gold)]"
                                                    style={{ borderColor: d ? "var(--lp-gold)" : "var(--lp-border-subtle)" }}
                                                />
                                            ))}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.01, y: -2 }}
                                            whileTap={{ scale: 0.99, y: 0 }}
                                            type="submit" disabled={otp.join('').length < 6}
                                            className="w-full py-4 rounded-full bg-[var(--lp-gold)] text-white font-bold shadow-lg shadow-stone-200/50 disabled:opacity-50"
                                        >
                                            Lanjutkan
                                        </motion.button>
                                    </form>

                                    <div className="text-center">
                                        <button
                                            onClick={handleRequestOtp} disabled={resendCooldown > 0}
                                            className="inline-flex items-center gap-2 text-[11px] font-bold text-[var(--lp-gold)] disabled:opacity-30 transition-soft hover:opacity-70"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                                            {resendCooldown > 0 ? `Kirim ulang OTP dalam ${resendCooldown}s` : 'Kirim Ulang OTP'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'reset' && (
                                <motion.div
                                    key="reset"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold mb-1" style={{ color: "var(--lp-text)" }}>Password Baru</h2>
                                        <p className="text-xs opacity-60" style={{ color: "var(--lp-text)" }}>Buat kata sandi baru yang kuat untuk akun Anda.</p>
                                    </div>

                                    {error && (
                                        <div className="p-3.5 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-xs text-center">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleResetPassword} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1 opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Password Baru</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                                    className="w-full bg-white border rounded-[1.5rem] px-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5 pr-12"
                                                    style={{ borderColor: "var(--lp-border-subtle)" }}
                                                    placeholder="Minimal 8 karakter"
                                                    minLength={8}
                                                />
                                                <button
                                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-soft"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <motion.button
                                                whileHover={{ scale: 1.01, y: -2 }}
                                                whileTap={{ scale: 0.99, y: 0 }}
                                                type="submit" disabled={loading}
                                                className="w-full py-4 rounded-full bg-[var(--lp-gold)] text-white font-bold shadow-lg shadow-stone-200/50 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                                            </motion.button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'done' && (
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-4"
                                >
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold mb-2">Password Diperbarui!</h2>
                                    <p className="text-sm text-stone-500 mb-8 leading-relaxed">Password Anda telah berhasil direset. Silakan login kembali dengan password baru Anda.</p>
                                    <Link href="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-10 py-4 bg-[var(--lp-gold)] text-white rounded-full font-bold shadow-lg"
                                        >
                                            Login Sekarang
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <p className="mt-10 text-center text-[11px] font-medium opacity-30" style={{ color: "var(--lp-text)" }}>
                    &copy; 2024 Vowify.id · All Rights Reserved
                </p>
            </div>
        </main>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ForgotContent />
        </Suspense>
    );
}

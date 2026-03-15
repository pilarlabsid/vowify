'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, CheckCircle, RefreshCw, ArrowLeft, LogIn, UserPlus, UserX } from 'lucide-react';

type AuthMode = 'login' | 'register';
type RegisterStep = 'form' | 'otp' | 'done';

// Shared Tab Item Component for Layout Animation
const TabItem = ({ target, current, label, icon: Icon, onClick }: { target: AuthMode, current: AuthMode, label: string, icon: any, onClick: () => void }) => {
    const isActive = current === target;
    return (
        <button
            onClick={onClick}
            className="flex-1 relative flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors duration-300 z-10"
            style={{ color: isActive ? "var(--lp-gold)" : "var(--lp-text)" }}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] rounded-full z-[-1]"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
            )}
            <Icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? 'scale-105' : 'opacity-30'}`} />
            <span className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>{label}</span>
        </button>
    );
};

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI State
    const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [regStep, setRegStep] = useState<RegisterStep>('form');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPwd, setShowLoginPwd] = useState(false);
    const justVerified = searchParams.get('verified') === '1';

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [showRegPwd, setShowRegPwd] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { data: session } = useSession();
    const [savedUser, setSavedUser] = useState<{ name: string; email: string; image: string; provider?: string } | null>(null);

    // Load saved user from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('vowify_last_success_login');
        if (saved) {
            try {
                setSavedUser(JSON.parse(saved));
            } catch (e) {
                localStorage.removeItem('vowify_last_success_login');
            }
        }
    }, []);

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            email: loginEmail,
            password: loginPassword,
            redirect: false,
        });

        if (res?.error) {
            setLoading(false);
            if (res.error === 'EMAIL_NOT_VERIFIED') {
                setError('Email belum diverifikasi. Silakan daftar ulang atau cek email.');
            } else if (res.error === 'ACCOUNT_BLOCKED') {
                setError('Akun Anda telah diblokir.');
            } else if (res.error === 'USER_NOT_FOUND') {
                setError('Alamat email tidak ditemukan.');
            } else if (res.error === 'INVALID_PASSWORD') {
                setError('Kata sandi yang Anda masukkan salah.');
            } else if (res.error === 'NO_PASSWORD_SET') {
                setError('Akun ini menggunakan Google Login. Silakan masuk via Google.');
            } else {
                setError('Terjadi kesalahan saat masuk. Coba lagi.');
            }
        } else {
            const sessionRes = await fetch('/api/auth/session');
            const session = await sessionRes.json();
            window.location.href = session?.user?.role === 'admin' ? '/admin' : '/dashboard';
        }
    };

    // Handle Register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Pendaftaran gagal.');
            } else {
                setRegStep('otp');
                setResendCooldown(60);
            }
        } catch {
            setError('Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (forceSelect = false) => {
        setGoogleLoading(true);
        try {
            // Force select_account if specifically requested OR if on Register mode
            const shouldForceSelect = forceSelect || mode === 'register';
            
            await signIn('google', { 
                callbackUrl: '/dashboard',
            }, shouldForceSelect ? { prompt: 'select_account' } : {});
        } catch (err) {
            setGoogleLoading(false);
        }
    };

    // Handle OTP
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
                body: JSON.stringify({ email: regEmail, otp: otpStr }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Verifikasi gagal.');
            } else {
                setRegStep('done');
                // Auto-login after successful verification
                setTimeout(async () => {
                    const res = await signIn('credentials', {
                        email: regEmail,
                        password: regPassword,
                        redirect: false,
                    });
                    if (res?.ok) {
                        window.location.href = '/dashboard';
                    } else {
                        // Fallback to login page if auto-login fails
                        setMode('login');
                        setRegStep('form');
                        setLoginEmail(regEmail);
                    }
                }, 1500);
            }
        } catch {
            setError('Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regEmail }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error);
                return;
            }
            setResendCooldown(60);
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } catch {
            setError('Gagal mengirim ulang OTP.');
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

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };



    return (
        <main data-zone="landing" className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "var(--lp-bg)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-full opacity-20 pointer-events-none" style={{ background: "var(--lp-gold-dim)" }} />

            <div className="w-full max-w-[440px] relative z-10">
                <div className="text-center mb-10">
                    <Link href="/">
                        <h1 className="text-5xl font-script mb-2 hover:opacity-80 transition-soft inline-block" style={{ color: "#A88132" }}>Vowify.id</h1>
                    </Link>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 font-body" style={{ color: "var(--lp-text)" }}>Premium Digital Invitation</p>
                </div>

                <motion.div
                    layout
                    className="bg-white/90 backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
                    style={{ borderColor: "var(--lp-border-subtle)" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                >
                    {regStep === 'form' && (
                        <motion.div layout="position" className="flex p-2 bg-stone-50/50 border-b relative" style={{ borderColor: "var(--lp-border-subtle)" }}>
                            <TabItem
                                target="login"
                                current={mode}
                                label="Masuk"
                                icon={LogIn}
                                onClick={() => { 
                                    if (mode !== 'login') {
                                        setDirection(-1);
                                        setMode('login'); 
                                        setError(''); 
                                    }
                                }}
                            />
                            <TabItem
                                target="register"
                                current={mode}
                                label="Daftar"
                                icon={UserPlus}
                                onClick={() => { 
                                    if (mode !== 'register') {
                                        setDirection(1);
                                        setMode('register'); 
                                        setError(''); 
                                    }
                                }}
                            />
                        </motion.div>
                    )}

                    <div className="p-8 relative">
                        <AnimatePresence mode="wait" initial={false}>
                            {mode === 'login' && (
                                <motion.div
                                    key="login"
                                    className="w-full"
                                    initial={{ opacity: 0, x: direction * 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -50 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }}
                                >
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-serif font-bold mb-1" style={{ color: "var(--lp-text)" }}>Selamat Datang</h2>
                                        <p className="text-sm font-body opacity-60" style={{ color: "var(--lp-text)" }}>Masuk untuk mengelola undangan Anda</p>
                                    </div>

                                    {justVerified && (
                                        <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 border border-emerald-100 text-xs">
                                            <CheckCircle className="w-5 h-5 shrink-0" />
                                            Email berhasil diverifikasi! Silakan masuk.
                                        </div>
                                    )}

                                    {error && mode === 'login' && (
                                        <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-xs text-center">
                                            {error}
                                        </div>
                                    )}

                                    {/* Google Login Section */}
                                    <div className="mb-8">
                                        {savedUser && savedUser.provider === 'google' && mode === 'login' ? (
                                            <div className="space-y-3">
                                                <motion.button
                                                    whileHover={!googleLoading ? { scale: 1.01, y: -2 } : {}}
                                                    whileTap={!googleLoading ? { scale: 0.99, y: 0 } : {}}
                                                    onClick={() => handleGoogleLogin(false)}
                                                    disabled={googleLoading}
                                                    className={`w-full py-2 px-5 rounded-full border bg-white flex items-center justify-between group transition-all ${googleLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:border-[var(--lp-gold)]'}`}
                                                    style={{ borderColor: 'var(--lp-border-subtle)' }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            {googleLoading ? (
                                                                <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center border">
                                                                    <Loader2 className="w-4 h-4 animate-spin text-[var(--lp-gold)]" />
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {savedUser.image ? (
                                                                        <img 
                                                                            src={savedUser.image} 
                                                                            alt={savedUser.name} 
                                                                            className="w-9 h-9 rounded-full border border-white shadow-sm object-cover" 
                                                                            referrerPolicy="no-referrer"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                                const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-avatar');
                                                                                if (fallback) fallback.classList.remove('hidden');
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    <div className={`fallback-avatar w-9 h-9 rounded-full bg-[var(--lp-gold)] flex items-center justify-center text-white text-[10px] font-bold ${savedUser.image ? 'hidden' : ''}`}>
                                                                        {savedUser.name?.[0]?.toUpperCase()}
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="absolute -bottom-0.5 -right-0.5 bg-white p-0.5 rounded-full shadow-sm ring-1 ring-black/5">
                                                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-stone-800 leading-tight group-hover:text-[var(--lp-gold)] transition-colors">
                                                                {googleLoading ? 'Memproses...' : `Masuk sebagai ${savedUser.name.split(' ')[0]}`}
                                                            </p>
                                                            <p className="text-[10px] text-stone-400 truncate">{savedUser.email}</p>
                                                        </div>
                                                    </div>
                                                    {!googleLoading && (
                                                        <div 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSavedUser(null);
                                                                localStorage.removeItem('vowify_last_success_login');
                                                            }}
                                                            className="p-1.5 rounded-full hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all"
                                                            title="Bukan saya / Ganti Akun"
                                                        >
                                                            <UserX className="w-3.5 h-3.5" />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={!googleLoading ? { scale: 1.01, y: -2 } : {}}
                                                whileTap={!googleLoading ? { scale: 0.99, y: 0 } : {}}
                                                onClick={() => handleGoogleLogin(true)}
                                                disabled={googleLoading}
                                                className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-3 bg-white border transition-all ${googleLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-stone-50 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] active:shadow-sm'}`}
                                                style={{ borderColor: "var(--lp-border-subtle)", color: "#374151" }}
                                            >
                                                {googleLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-[var(--lp-gold)]" />
                                                ) : (
                                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                    </svg>
                                                )}
                                                <span className="text-sm font-semibold">
                                                    {googleLoading ? 'Memproses...' : (mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google')}
                                                </span>
                                            </motion.button>
                                        )}

                                        <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-dashed" style={{ borderColor: "var(--lp-border-subtle)" }} />
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1 opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Alamat Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                                                <input
                                                    type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                                    className="w-full bg-white border rounded-[1.5rem] pl-12 pr-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5"
                                                    style={{ borderColor: "var(--lp-border-subtle)" }}
                                                    placeholder="nama@email.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Kata Sandi</label>
                                                <Link href="/forgot-password" className="text-[10px] font-bold text-[var(--lp-gold)] hover:underline decoration-gold/30">Lupa?</Link>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showLoginPwd ? 'text' : 'password'} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                                                    className="w-full bg-white border rounded-[1.5rem] px-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5 pr-12"
                                                    style={{ borderColor: "var(--lp-border-subtle)" }}
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-soft"
                                                >
                                                    {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.01, y: -2 }}
                                            whileTap={{ scale: 0.99, y: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            disabled={loading}
                                            className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-stone-200/50 mt-6 overflow-hidden relative group"
                                            style={{ background: "var(--lp-gold)" }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk Sekarang'}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {mode === 'register' && (
                                <motion.div
                                    key="register"
                                    className="w-full"
                                    initial={{ opacity: 0, x: direction * 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -50 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }}
                                >
                                    {regStep === 'form' && (
                                        <div className="space-y-5">
                                            <div>
                                                <h2 className="text-3xl font-serif font-bold mb-1" style={{ color: "var(--lp-text)" }}>Buat Akun</h2>
                                                <p className="text-sm font-body opacity-60" style={{ color: "var(--lp-text)" }}>Mulai langkah awal kebahagiaan Anda</p>
                                            </div>

                                            {error && mode === 'register' && (
                                                <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-xs text-center">
                                                    {error}
                                                </div>
                                            )}

                                            {/* Google Register Button */}
                                            <div>
                                                <motion.button
                                                    whileHover={!googleLoading ? { scale: 1.01, y: -2 } : {}}
                                                    whileTap={!googleLoading ? { scale: 0.99, y: 0 } : {}}
                                                    onClick={() => handleGoogleLogin(true)}
                                                    disabled={googleLoading}
                                                    className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-3 bg-white border transition-all ${googleLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-stone-50 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] active:shadow-sm'}`}
                                                    style={{ borderColor: "var(--lp-border-subtle)", color: "#374151" }}
                                                >
                                                    {googleLoading ? (
                                                        <Loader2 className="w-5 h-5 animate-spin text-[var(--lp-gold)]" />
                                                    ) : (
                                                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                        </svg>
                                                    )}
                                                    <span className="text-sm font-semibold">
                                                        {googleLoading ? 'Memproses...' : 'Daftar dengan Google'}
                                                    </span>
                                                </motion.button>

                                                <div className="relative my-4">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <span className="w-full border-t border-dashed" style={{ borderColor: "var(--lp-border-subtle)" }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <form onSubmit={handleRegister} className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1 opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Nama Lengkap</label>
                                                    <input
                                                        type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                                                        className="w-full bg-white border rounded-[1.5rem] px-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5"
                                                        style={{ borderColor: "var(--lp-border-subtle)" }}
                                                        placeholder="Nama Anda"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1 opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Alamat Email</label>
                                                    <input
                                                        type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                                        className="w-full bg-white border rounded-[1.5rem] px-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5"
                                                        style={{ borderColor: "var(--lp-border-subtle)" }}
                                                        placeholder="nama@email.com"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1 opacity-40 ml-1" style={{ color: "var(--lp-text)" }}>Kata Sandi</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showRegPwd ? 'text' : 'password'} required value={regPassword} onChange={e => setRegPassword(e.target.value)}
                                                            className="w-full bg-white border rounded-[1.5rem] px-5 py-4 outline-none transition-all text-sm focus:border-[var(--lp-gold)] focus:ring-4 focus:ring-[var(--lp-gold)]/5 pr-12"
                                                            style={{ borderColor: "var(--lp-border-subtle)" }}
                                                            placeholder="Minimal 8 karakter"
                                                            minLength={8}
                                                        />
                                                        <button
                                                            type="button" onClick={() => setShowRegPwd(!showRegPwd)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-soft"
                                                        >
                                                            {showRegPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.01, y: -2 }}
                                                    whileTap={{ scale: 0.99, y: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    disabled={loading}
                                                    className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-stone-200/50 mt-6 overflow-hidden relative group"
                                                    style={{ background: "var(--lp-gold)" }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Daftar Sekarang'}
                                                </motion.button>
                                            </form>
                                        </div>
                                    )}

                                    {regStep === 'otp' && (
                                        <div className="space-y-5">
                                            <button
                                                onClick={() => setRegStep('form')}
                                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-[var(--lp-gold)] transition-soft"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                                            </button>
                                            <div className="text-center">
                                                <div className="w-14 h-14 bg-[var(--lp-gold-dim)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--lp-gold)]/10">
                                                    <Mail className="w-7 h-7 text-[var(--lp-gold)]" />
                                                </div>
                                                <h3 className="text-2xl font-serif font-bold mb-1" style={{ color: "var(--lp-text)" }}>Verifikasi Email</h3>
                                                <p className="text-[11px] font-body text-stone-500 px-4 leading-relaxed">Masukkan 6 digit kode yang dikirim ke <span className="text-[var(--lp-gold)] font-bold">{regEmail}</span></p>
                                            </div>

                                            {error && (
                                                <div className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-xs text-center">
                                                    {error}
                                                </div>
                                            )}

                                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                                <div className="flex justify-between gap-1.5 px-1">
                                                    {otp.map((d, i) => (
                                                        <input
                                                            key={i} ref={el => { otpRefs.current[i] = el; }}
                                                            type="text" inputMode="numeric" value={d}
                                                            onChange={e => handleOtpChange(i, e.target.value)}
                                                            onKeyDown={e => handleKeyDown(i, e)}
                                                            onFocus={e => e.target.select()}
                                                            className="w-full h-12 text-center text-xl font-bold rounded-xl border bg-white outline-none transition-soft focus:ring-4 focus:ring-[var(--lp-gold)]/5 focus:border-[var(--lp-gold)]"
                                                            style={{ borderColor: d ? "var(--lp-gold)" : "var(--lp-border-subtle)" }}
                                                        />
                                                    ))}
                                                </div>
                                                <motion.button
                                                    type="submit" disabled={loading || otp.join('').length < 6}
                                                    whileHover={{ scale: 1.01, y: -2 }}
                                                    whileTap={{ scale: 0.99, y: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    className="w-full py-4 rounded-full bg-[var(--lp-gold)] text-white font-bold shadow-lg shadow-stone-200/50 disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verifikasi & Lanjutkan'}
                                                </motion.button>
                                            </form>

                                            <div className="text-center">
                                                <button
                                                    onClick={handleResendOtp} disabled={resendCooldown > 0}
                                                    className="inline-flex items-center gap-2 text-[11px] font-bold text-[var(--lp-gold)] disabled:opacity-30 transition-soft hover:opacity-70"
                                                >
                                                    <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                                                    {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang Kode'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {regStep === 'done' && (
                                        <div className="text-center py-6 space-y-4">
                                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 animate-bounce">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-serif font-bold" style={{ color: "var(--lp-cream)" }}>Berhasil!</h3>
                                            <p className="text-sm text-stone-500">Email Anda telah terverifikasi. Mengalihkan...</p>
                                            <div className="flex justify-center pt-2">
                                                <Loader2 className="w-5 h-5 animate-spin text-[var(--lp-gold)]" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <p className="text-center text-[10px] mt-10 font-bold opacity-30 uppercase tracking-[0.2em]" style={{ color: "var(--lp-text)" }}>
                    Vowify.id • Undangan Digital Premium
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--lp-bg)" }}><Loader2 className="w-8 h-8 animate-spin text-[var(--lp-gold)]" /></div>}>
            <AuthContent />
        </Suspense>
    );
}

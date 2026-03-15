'use client';

import { motion } from "framer-motion";
import { Copy, Check, CreditCard, QrCode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { WeddingData } from "@/lib/types";

function BankCard({ bank, number, holder }: { bank: string; number: string; holder: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-7 rounded-2xl relative overflow-hidden group transition-all"
            style={{
                background: 'rgba(106, 148, 127, 0.07)',
                border: '1px solid rgba(106, 148, 127, 0.22)',
                boxShadow: '0 4px 24px rgba(30,43,39,0.30)',
            }}
        >
            {/* Sage corner glow on hover */}
            <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at top right, rgba(146, 181, 164, 0.22), transparent 70%)' }}
            />

            <div className="flex justify-between items-center mb-5">
                <CreditCard className="w-6 h-6" style={{ color: 'var(--mn-sage-light)' }} />
                <span className="font-bold tracking-widest text-sm" style={{ color: 'var(--mn-sage-light)' }}>{bank}</span>
            </div>

            <p className="mn-label mb-1" style={{ color: 'var(--mn-text-dim)' }}>Nomor Rekening</p>
            <p className="text-2xl font-bold tracking-wider mb-4" style={{ color: 'var(--mn-text-light)', fontFamily: 'var(--mn-font-serif)' }}>
                {number}
            </p>

            <p className="mn-label mb-1" style={{ color: 'var(--mn-text-dim)' }}>Atas Nama</p>
            <p className="text-base mb-6" style={{ color: 'var(--mn-text-light)' }}>{holder}</p>

            <button
                onClick={() => { navigator.clipboard.writeText(number); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                    border: '1px solid rgba(106, 148, 127, 0.40)',
                    color: copied ? '#4ade80' : 'var(--mn-sage-light)',
                    background: 'rgba(106, 148, 127, 0.08)',
                }}
            >
                {copied ? <><Check className="w-4 h-4 text-green-400" /> Berhasil Di-copy!</> : <><Copy className="w-4 h-4" /> Copy Nomor</>}
            </button>
        </motion.div>
    );
}

export default function Gift({ data }: { data: WeddingData }) {
    const [showQR, setShowQR] = useState(false);
    const hasBanks = data.bankAccounts && data.bankAccounts.length > 0;
    const qrisUrl = data.qris || '';

    if (!hasBanks && !qrisUrl) return null;

    return (
        <section className="mn-dark pt-12 pb-20 md:py-28 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-section-head"
                >
                    <p className="mn-label mb-3" style={{ color: 'var(--mn-sage-light)' }}>Tanda Kasih</p>
                    <h2>Amplop Digital</h2>
                    <div className="mn-line-group mt-4">
                        <div className="line" style={{ background: 'var(--mn-sage-light)' }} />
                        <div className="dot" style={{ background: 'var(--mn-sage-light)' }} />
                        <div className="line" style={{ background: 'var(--mn-sage-light)' }} />
                    </div>
                    <p className="text-sm italic max-w-md mx-auto mt-6" style={{ color: 'rgba(242,245,243,0.45)' }}>
                        Doa restu Anda adalah karunia yang paling berarti bagi kami. Namun jika berkenan memberikan hadiah, berikut adalah caranya.
                    </p>
                </motion.div>

                {hasBanks && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 text-left">
                        {data.bankAccounts.map((acc, i) => (
                            <BankCard key={i} {...acc} />
                        ))}
                    </div>
                )}

                {qrisUrl && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowQR(!showQR)}
                            className="mx-auto flex items-center gap-3 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                            style={{
                                background: 'var(--mn-sage-grad)',
                                color: '#fff',
                                boxShadow: 'var(--mn-shadow-sage)',
                            }}
                        >
                            <QrCode className="w-5 h-5" />
                            {showQR ? 'Tutup QR Code' : 'Tampilkan QRIS'}
                        </motion.button>

                        <div className={`mt-8 overflow-hidden transition-all duration-700 ${showQR ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-5 rounded-2xl max-w-[260px] mx-auto" style={{ background: 'white' }}>
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                                    <Image src={qrisUrl} alt="QRIS" fill sizes="260px" className="object-contain p-2 mix-blend-multiply" />
                                </div>
                                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-center" style={{ color: '#333' }}>Scan via QRIS</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

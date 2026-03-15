'use client';

import { motion } from "framer-motion";
import { Copy, CreditCard, Check, QrCode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { WeddingData } from "@/lib/types";

const BankCard = ({ bank, number, holder }: { bank: string; number: string; holder: string }) => {
    const [copied, setCopied] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-7 rounded-2xl relative overflow-hidden group transition-all duration-300"
            style={{
                border: '1px solid var(--wbg-border-glow)',
                background: 'var(--wbg-black-soft)',
                boxShadow: 'var(--wbg-shadow)',
            }}
        >
            {/* Gold glow corner */}
            <div
                className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'radial-gradient(circle at top right, rgba(201,168,76,0.15), transparent 70%)' }}
            />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <CreditCard className="w-7 h-7" style={{ color: 'var(--wbg-gold)' }} />
                <span
                    className="text-lg font-bold tracking-widest"
                    style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)', fontSize: '1rem' }}
                >
                    {bank}
                </span>
            </div>

            <div className="space-y-0.5 mb-3 relative z-10">
                <p className="wbg-label">Nomor Rekening</p>
                <p
                    className="text-2xl font-bold tracking-wider"
                    style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)', fontSize: '1.4rem' }}
                >
                    {number}
                </p>
            </div>

            <div className="space-y-0.5 mb-6 relative z-10">
                <p className="wbg-label">Pemilik Rekening</p>
                <p className="text-lg" style={{ color: 'var(--wbg-text-light)' }}>{holder}</p>
            </div>

            <button
                onClick={() => {
                    navigator.clipboard.writeText(number);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                    border: '1px solid var(--wbg-border-glow)',
                    color: copied ? '#4ade80' : 'var(--wbg-gold)',
                    background: 'rgba(201,168,76,0.06)',
                    fontFamily: 'var(--wbg-font-display)',
                }}
            >
                {copied ? (
                    <><Check className="w-4 h-4 text-green-400" /> Berhasil Di-copy!</>
                ) : (
                    <><Copy className="w-4 h-4" /> Copy Nomor Rekening</>
                )}
            </button>
        </motion.div>
    );
};

export default function Envelope({ data }: { data: WeddingData }) {
    const [showQR, setShowQR] = useState(false);
    const qrisUrl = data.qris || '';
    const hasBankAccounts = data.bankAccounts && data.bankAccounts.length > 0;

    if (!hasBankAccounts && !qrisUrl) return null;

    return (
        <section
            className="py-24 px-6 relative overflow-hidden"
            style={{ background: 'var(--wbg-black-soft)' }}
        >
            {/* Asset 10.2 — Gunungan kiri */}
            <div className="absolute top-0 left-0 w-32 h-64 md:w-48 md:h-80 pointer-events-none opacity-10">
                <Image src="/templates/wayang-black-gold/10.2.webp" alt="" fill
                    sizes="192px"
                    className="object-contain object-left-top"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>
            {/* Asset 10.3 — Gunungan kanan */}
            <div className="absolute bottom-0 right-0 w-32 h-64 md:w-48 md:h-80 pointer-events-none opacity-10">
                <Image src="/templates/wayang-black-gold/10.3.webp" alt="" fill
                    sizes="192px"
                    className="object-contain object-right-bottom"
                    style={{ filter: 'sepia(1) saturate(0.3) brightness(0.4) hue-rotate(20deg)' }}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <div className="mb-12">
                    <p className="wbg-label mb-3">Tanda Kasih</p>
                    <h2
                        className="text-3xl md:text-4xl mb-4"
                        style={{ fontFamily: 'var(--wbg-font-display)', color: 'var(--wbg-gold)' }}
                    >
                        Amplop Digital
                    </h2>
                    <p className="text-sm italic max-w-md mx-auto" style={{ color: 'var(--wbg-text-dim)' }}>
                        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, Anda dapat mengirimkannya melalui:
                    </p>
                </div>

                {hasBankAccounts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                        {data.bankAccounts.map((acc, i) => (
                            <BankCard key={i} {...acc} />
                        ))}
                    </div>
                )}

                {qrisUrl && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowQR(!showQR)}
                            className="mx-auto flex items-center gap-3 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                            style={{
                                fontFamily: 'var(--wbg-font-display)',
                                background: 'var(--wbg-grad-gold)',
                                color: 'var(--wbg-black)',
                                boxShadow: 'var(--wbg-shadow-gold)',
                            }}
                        >
                            <QrCode className="w-5 h-5" />
                            {showQR ? 'Hide QR Code' : 'Show QRIS QR Code'}
                        </motion.button>

                        <div className={`mt-10 overflow-hidden transition-all duration-700 ${showQR ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div
                                className="p-5 rounded-2xl max-w-[280px] mx-auto"
                                style={{ background: 'white', border: '1px solid var(--wbg-border-glow)' }}
                            >
                                <div className="relative w-full aspect-square overflow-hidden rounded-xl">
                                    <Image
                                        src={qrisUrl}
                                        alt="QRIS"
                                        fill
                                        sizes="280px"
                                        className="object-contain p-3 mix-blend-multiply"
                                    />
                                </div>
                                <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest" style={{ color: '#1a1000', opacity: 0.6 }}>
                                    Scan Me via QRIS
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

'use client';

import { motion } from "framer-motion";
import { Copy, CreditCard, Check, QrCode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { WeddingData } from "@/lib/types";

const BankCard = ({ bank, number, holder }: any) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-elegant p-8 rounded-3xl border border-gold/30 shadow-2xl space-y-4 text-left relative overflow-hidden group transition-all duration-300"
        >
            {/* Card Gradient Ornament */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-12 -translate-y-12 bg-gold blur-[30px] group-hover:blur-[20px] transition-all"></div>

            <div className="flex justify-between items-start relative z-10">
                <CreditCard className="w-8 h-8 text-gold" />
                <span className="text-gold font-bold text-xl tracking-widest">{bank}</span>
            </div>

            <div className="space-y-1 relative z-10">
                <p className="text-cream/50 text-xs uppercase tracking-widest font-medium">Nomor Rekening</p>
                <p className="text-gold text-2xl font-serif font-bold tracking-wider">{number}</p>
            </div>

            <div className="space-y-1 relative z-10">
                <p className="text-cream/50 text-xs uppercase tracking-widest font-medium">Pemilik Rekening</p>
                <p className="text-cream text-lg font-medium tracking-wide">{holder}</p>
            </div>

            <button
                onClick={copyToClipboard}
                className="w-full mt-6 bg-gold/10 hover:bg-gold/20 py-3 rounded-xl text-gold border border-gold/20 flex items-center justify-center gap-3 transition-all text-xs font-bold uppercase tracking-widest active:scale-95"
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

    // Hide the entire section if nothing to show
    if (!hasBankAccounts && !qrisUrl) return null;

    return (
        <section className="py-24 px-6 bg-cream relative overflow-hidden">
            <div className="batik-overlay opacity-[0.03]"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-primary text-4xl mb-6 font-script">Amplop Digital</h2>
                <p className="text-elegant/70 max-w-xl mx-auto mb-16 text-sm italic font-body leading-relaxed">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, Anda dapat mengirimkannya melalui:
                </p>

                {hasBankAccounts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {data.bankAccounts.map((acc, i) => (
                            <BankCard key={i} {...acc} />
                        ))}
                    </div>
                )}

                {qrisUrl && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowQR(!showQR)}
                            className="mx-auto flex items-center gap-3 bg-gold px-12 py-4 rounded-full text-primary font-bold shadow-xl hover:shadow-gold/20 transition-all uppercase tracking-widest text-sm"
                        >
                            <QrCode className="w-5 h-5" />
                            {showQR ? 'Hide QR Code' : 'Show QRIS QR Code'}
                        </motion.button>

                        <div className={`mt-12 overflow-hidden transition-all duration-700 ${showQR ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-2xl max-w-[300px] mx-auto group">
                                <div className="relative w-full aspect-square bg-cream overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform shadow-inner">
                                    <Image
                                        src={qrisUrl}
                                        alt="QRIS"
                                        fill
                                        sizes="(max-width: 768px) 300px, 300px"
                                        className="object-contain p-4 mix-blend-multiply opacity-80"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-elegant/10 backdrop-blur-[2px]">
                                        <p className="text-elegant font-bold text-xs bg-gold rounded-full px-4 py-1">Scan for Gift</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-elegant text-xs font-bold uppercase tracking-widest tracking-loose opacity-60">Scan Me via QRIS</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

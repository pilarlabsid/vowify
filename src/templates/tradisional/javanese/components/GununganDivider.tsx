'use client';

import { motion } from "framer-motion";

export default function GununganDivider({ className = "" }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex justify-center items-center my-8 ${className}`}
        >
            <svg
                width="110"
                height="220"
                viewBox="0 0 110 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gold opacity-80"
            >
                {/* ═══ GUNUNGAN WAYANG JAWA ═══ */}

                {/* ── Pucuk api / mahkota atas ── */}
                <path d="M55 2 L50 16 L44 8 L48 22 L38 16 L44 28 L34 24 L42 36 L32 36 L42 46 L55 40 L68 46 L78 36 L68 36 L76 24 L66 28 L72 16 L62 22 L66 8 L60 16 Z"
                    fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="0.5" />

                {/* ── Badan utama — bentuk kerucut membulat ── */}
                <path d="M55 38 C55 38 100 95 100 148 C100 178 80 196 55 196 C30 196 10 178 10 148 C10 95 55 38 55 38Z"
                    fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />

                {/* ── Garis tepi dalam ── */}
                <path d="M55 52 C55 52 90 100 90 148 C90 170 74 184 55 184 C36 184 20 170 20 148 C20 100 55 52 55 52Z"
                    fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" strokeDasharray="3 3" />

                {/* ── Pintu / gerbang tengah ── */}
                <path d="M42 196 L42 158 Q42 138 55 132 Q68 138 68 158 L68 196"
                    stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.25" />

                {/* Lengkung atas pintu */}
                <path d="M42 158 Q55 130 68 158" fill="none" stroke="currentColor" strokeWidth="1" />

                {/* ── Lingkaran ornamen tengah ── */}
                <circle cx="55" cy="108" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="55" cy="108" r="13" fill="currentColor" fillOpacity="0.2" />
                <circle cx="55" cy="108" r="7" fill="currentColor" fillOpacity="0.4" />
                <circle cx="55" cy="108" r="3" fill="currentColor" fillOpacity="0.65" />

                {/* ── Garis hias horizontal ── */}
                <line x1="22" y1="148" x2="88" y2="148" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1="26" y1="162" x2="84" y2="162" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.3" />
                <line x1="30" y1="174" x2="80" y2="174" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" />
                <line x1="34" y1="184" x2="76" y2="184" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />

                {/* ── Motif kawung di badan ── */}
                <ellipse cx="55" cy="78" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
                <ellipse cx="44" cy="85" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
                <ellipse cx="66" cy="85" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
                <ellipse cx="55" cy="92" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />

                {/* ── Sayap / selendang kiri ── */}
                <path d="M12 120 C2 104 -4 80 6 68 C14 58 28 68 30 82 C24 88 18 104 12 120Z"
                    fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8" />
                <path d="M12 120 Q2 96 10 76" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
                <path d="M12 120 Q4 92 14 74" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />

                {/* ── Sayap / selendang kanan ── */}
                <path d="M98 120 C108 104 114 80 104 68 C96 58 82 68 80 82 C86 88 92 104 98 120Z"
                    fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8" />
                <path d="M98 120 Q108 96 100 76" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
                <path d="M98 120 Q106 92 96 74" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />

                {/* ── Kaki / tatakan (Batur Gunungan) ── */}
                <rect x="34" y="196" width="42" height="7" rx="3.5" fill="currentColor" fillOpacity="0.5" />
                <rect x="28" y="203" width="54" height="6" rx="3" fill="currentColor" fillOpacity="0.35" />
                <rect x="22" y="209" width="66" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />
                <rect x="16" y="214" width="78" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
            </svg>
        </motion.div>
    );
}

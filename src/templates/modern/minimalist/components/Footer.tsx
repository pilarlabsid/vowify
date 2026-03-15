'use client';

import { motion } from "framer-motion";
import { WeddingData } from "@/lib/types";

export default function Footer({ data }: { data: WeddingData }) {
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <footer className="py-24 px-6 text-center relative overflow-hidden" style={{ background: 'var(--mn-bg)' }}>
            {/* Subtle top hairline */}
            <div className="mn-hr-full mb-16" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
            >
                <p className="mn-label mb-6">With Love</p>

                <h2
                    className="mn-names mb-6"
                    style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: 'var(--mn-text)' }}
                >
                    {data.groomShort} &amp; {data.brideShort}
                </h2>

                <div className="mn-hr" />

                <p className="text-sm mt-6 mb-2" style={{ color: 'var(--mn-text-muted)' }}>
                    {formattedDate}
                </p>
                <p className="text-sm italic" style={{ color: 'var(--mn-text-muted)' }}>
                    &ldquo;And He has put between you affection and mercy.&rdquo;
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--mn-text-dim)' }}>— Ar-Rum: 21</p>
            </motion.div>

            {/* Bottom hairline + copy */}
            <div className="mn-hr-full mt-16 mb-8" />
            <p className="text-xs" style={{ color: 'var(--mn-text-dim)' }}>
                © {new Date().getFullYear()} {data.groomShort} &amp; {data.brideShort} · Made with ♡
            </p>
        </footer>
    );
}

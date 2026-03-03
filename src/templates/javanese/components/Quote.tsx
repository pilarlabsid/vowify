'use client';

import { motion } from "framer-motion";

export default function Quote() {
    return (
        <section className="py-24 px-6 relative bg-cream overflow-hidden">
            <div className="batik-overlay"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-2xl mx-auto text-center relative z-10"
            >
                <span className="text-gold text-4xl font-script block mb-6 px-4">بسم الله الرحمن الرحيم</span>

                <p className="text-lg md:text-xl font-body leading-relaxed text-elegant italic px-4">
                    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                </p>
                <div className="w-16 h-px bg-gold/40 mx-auto my-8"></div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">(QS. Ar-Rum: 21)</p>
            </motion.div>
        </section>
    );
}

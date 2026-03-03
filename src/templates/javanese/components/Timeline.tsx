'use client';

import { motion } from "framer-motion";
import { WeddingData } from "@/lib/types";

export default function Timeline({ data }: { data: WeddingData }) {
    return (
        <section className="py-24 px-6 bg-elegant text-cream relative overflow-hidden">
            {/* Background Batik Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] grayscale"></div>

            <div className="max-w-xl mx-auto relative z-10">
                <h2 className="text-center text-gold text-4xl mb-16 font-script">Kisah Cinta Kami</h2>

                <div className="relative border-l-2 border-gold/30 ml-8 md:ml-0 md:pl-0 pl-12 space-y-24">
                    {data.timeline.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="relative"
                        >
                            {/* Timeline Marker (Gunungan Mini) */}
                            <div className="absolute top-0 -left-14 md:-left-4 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-primary font-bold shadow-lg border-4 border-elegant">
                                {i + 1}
                            </div>

                            <div className="bg-cream/5 p-8 rounded-2xl border border-gold/20 backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-500">
                                <span className="text-gold font-serif text-3xl mb-2 font-medium block">{item.year}</span>
                                <h3 className="text-xl text-gold mb-3 font-medium uppercase tracking-widest">{item.title}</h3>
                                <p className="text-cream/70 text-sm leading-loose italic">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

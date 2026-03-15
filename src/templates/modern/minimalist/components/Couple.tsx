'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { WeddingData } from "@/lib/types";
import { resolvePhoto } from "@/templates/registry";
import { Camera } from "lucide-react";

function Portrait({ src, name }: { src?: string; name: string }) {
    return (
        <div
            className="relative w-full"
            style={{ aspectRatio: '3/4', borderRadius: '2rem', overflow: 'hidden', background: 'var(--mn-bg-alt)', boxShadow: 'var(--mn-shadow)' }}
        >
            {src ? (
                <Image src={src} alt={name} fill unoptimized className="object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Camera className="w-10 h-10" style={{ color: 'var(--mn-sage)', opacity: 0.4 }} />
                    <span className="text-xs" style={{ color: 'var(--mn-text-dim)' }}>Foto belum diatur</span>
                </div>
            )}
        </div>
    );
}

export default function Couple({ data }: { data: WeddingData }) {
    const photos = (data.photos ?? {}) as Record<string, string>;
    const brideImg = resolvePhoto(photos, 'bride_portrait', data.brideImage);
    const groomImg = resolvePhoto(photos, 'groom_portrait', data.groomImage);

    return (
        <section className="py-20 md:py-28 px-6" style={{ background: 'var(--mn-bg)' }}>
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mn-section-head"
                >
                    <p className="mn-label mb-3">Mempelai</p>
                    <h2>Dua Hati Bersatu</h2>
                    <div className="mn-line-group mt-4">
                        <div className="line" />
                        <div className="dot" />
                        <div className="line" />
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
                    {/* Bride */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <Portrait src={brideImg} name={data.brideName} />
                        <div className="mt-8">
                            <p className="mn-label mb-3">Mempelai Wanita</p>
                            <h3 className="mn-names mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>
                                {data.brideName}
                            </h3>
                            <div className="mn-hr" />
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--mn-text-muted)' }}>
                                Putri dari<br />
                                <span className="font-medium" style={{ color: 'var(--mn-text)' }}>{data.brideParents}</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* Groom */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <Portrait src={groomImg} name={data.groomName} />
                        <div className="mt-8">
                            <p className="mn-label mb-3">Mempelai Pria</p>
                            <h3 className="mn-names mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>
                                {data.groomName}
                            </h3>
                            <div className="mn-hr" />
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--mn-text-muted)' }}>
                                Putra dari<br />
                                <span className="font-medium" style={{ color: 'var(--mn-text)' }}>{data.groomParents}</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

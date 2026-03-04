'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { WeddingData } from "@/lib/types";
import { resolvePhoto } from "@/templates/registry";

const Card = ({ name, parents, role, image, ig }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center p-6"
    >
        <div className="relative w-64 h-80 mb-8 mask-ornament">
            <div className="absolute inset-0 border-[10px] border-gold/20 -m-4 rounded-xl rotate-3"></div>
            <div className="absolute inset-0 border-[1px] border-gold/40 -m-6 rounded-xl -rotate-3"></div>
            <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                ) : (
                    // Placeholder when no photo is set
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-elegant/30">
                        <span className="text-4xl font-script text-gold/30">{name?.[0] ?? '?'}</span>
                    </div>
                )}
            </div>
        </div>

        <span className="text-gold font-script text-3xl mb-2">{name}</span>
        <p className="text-elegant/70 font-body text-sm mb-4 leading-relaxed">
            Putra/i dari {parents}
        </p>

        <button className="flex items-center gap-2 text-gold/60 hover:text-gold transition-colors text-sm">
            <Instagram className="w-4 h-4" />
            <span>@{ig}</span>
        </button>
    </motion.div>
);

export default function BrideGroom({ data }: { data: WeddingData }) {
    // Resolve photos: prefer new photos map, fallback to legacy brideImage/groomImage
    const photos = (data as any).photos as Record<string, string> ?? {};
    const brideImg = resolvePhoto(photos, 'bride_portrait', data.brideImage);
    const groomImg = resolvePhoto(photos, 'groom_portrait', data.groomImage);

    return (
        <section className="py-24 px-6 bg-cream">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">
                <Card
                    name={data.groomName}
                    parents={data.groomParents}
                    role="groom"
                    image={groomImg}
                    ig={data.groomShort.toLowerCase()}
                />

                <div className="hidden md:flex flex-col items-center justify-center">
                    <span className="text-6xl font-script text-gold">&</span>
                </div>

                <Card
                    name={data.brideName}
                    parents={data.brideParents}
                    role="bride"
                    image={brideImg}
                    ig={data.brideShort.toLowerCase()}
                />
            </div>
        </section>
    );
}

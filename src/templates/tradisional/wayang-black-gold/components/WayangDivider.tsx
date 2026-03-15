'use client';

import Image from "next/image";

interface WayangDividerProps {
    className?: string;
    flipped?: boolean;
}

export default function WayangDivider({ className = '', flipped = false }: WayangDividerProps) {
    return (
        <div className={`wbg-divider relative ${className}`} style={{ height: '120px', overflow: 'hidden' }}>
            {/* Asset 4 — divider ornamen wayang */}
            <div className={`w-full h-full flex justify-center items-center ${flipped ? 'scale-y-[-1]' : ''}`} style={{ position: 'relative' }}>
                <Image
                    src="/templates/wayang-black-gold/4.webp"
                    alt="Wayang Divider"
                    fill
                    sizes="100vw"
                    className="object-contain object-center"
                    style={{
                        filter: 'sepia(1) saturate(0.6) brightness(0.7) hue-rotate(20deg)',
                        opacity: 1,
                    }}
                />
                {/* Gold tint overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 50%, rgba(201,168,76,0.08) 100%)',
                    }}
                />
                {/* Fade top & bottom */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, var(--wbg-black) 0%, transparent 30%, transparent 70%, var(--wbg-black) 100%)',
                    }}
                />
            </div>

            {/* Center ornament */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="180" height="24" viewBox="0 0 180 24" fill="none" style={{ opacity: 0.5 }}>
                    <line x1="0" y1="12" x2="75" y2="12" stroke="#C9A84C" strokeWidth="0.5" />
                    <circle cx="80" cy="12" r="2" fill="#C9A84C" />
                    <path d="M90 4 L94 12 L90 20 L86 12 Z" fill="#C9A84C" fillOpacity="0.8" />
                    <circle cx="100" cy="12" r="2" fill="#C9A84C" />
                    <line x1="105" y1="12" x2="180" y2="12" stroke="#C9A84C" strokeWidth="0.5" />
                </svg>
            </div>
        </div>
    );
}

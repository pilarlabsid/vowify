'use client';

/**
 * WayangSilhouette — Ornamen siluet wayang khas Jawa
 * Dapat diletakkan di kiri/kanan layar sebagai dekorasi.
 * side: 'left' → Arjuna / 'right' → Srikandi (mirror)
 */
export default function WayangSilhouette({
    side = 'left',
    className = '',
}: {
    side?: 'left' | 'right';
    className?: string;
}) {
    const isRight = side === 'right';

    return (
        <div
            className={`pointer-events-none select-none ${className}`}
            style={{ transform: isRight ? 'scaleX(-1)' : 'none' }}
        >
            <svg
                width="100"
                height="320"
                viewBox="0 0 100 320"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gold opacity-30"
            >
                {/* ── Mahkota (Gelung) ── */}
                <path d="M48 0 L46 8 L40 4 L44 12 L36 10 L42 18 L34 18 L42 26 L50 20 L58 26 L66 18 L58 18 L64 10 L56 12 L60 4 L54 8 Z" fillOpacity="0.9" />

                {/* ── Ornamen kepala mahkota ── */}
                <ellipse cx="50" cy="30" rx="10" ry="6" fillOpacity="0.7" />
                <path d="M40 30 Q50 22 60 30" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.5" />

                {/* ── Wajah / Kepala ── */}
                <ellipse cx="50" cy="46" rx="14" ry="18" fillOpacity="0.9" />

                {/* ── Hidung runcing wayang ── */}
                <path d="M50 44 L56 54 L50 52 Z" fillOpacity="0.7" />

                {/* ── Hiasan telinga & jamang ── */}
                <path d="M36 44 C30 44 28 50 32 54 C34 56 36 54 36 52 C36 48 38 46 36 44Z" fillOpacity="0.8" />
                <path d="M35 43 L30 38 L28 42 L33 46" fillOpacity="0.6" />

                {/* ── Leher ── */}
                <rect x="44" y="63" width="12" height="10" rx="2" fillOpacity="0.8" />

                {/* ── Kalung / Kelat bahu ── */}
                <path d="M36 70 Q50 66 64 70 Q60 78 50 76 Q40 78 36 70Z" fillOpacity="0.7" />
                <ellipse cx="50" cy="71" rx="14" ry="4" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />

                {/* ── Badan (baju adat) ── */}
                <path d="M38 76 L34 160 L46 160 L50 130 L54 160 L66 160 L62 76 Z" fillOpacity="0.85" />

                {/* ── Motif kain batik di badan ── */}
                <path d="M40 90 Q50 86 60 90" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.4" />
                <path d="M40 102 Q50 98 60 102" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.4" />
                <path d="M40 114 Q50 110 60 114" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.4" />
                <path d="M40 126 Q50 122 60 126" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.4" />

                {/* ── Rompi / sampur ── */}
                <path d="M36 80 L20 130 L34 132 L40 100 Z" fillOpacity="0.4" />
                <path d="M64 80 L80 130 L66 132 L60 100 Z" fillOpacity="0.4" />

                {/* ── Lengan kanan (di layar kiri) pungu ke belakang ── */}
                <path d="M38 80 C30 85 20 100 16 120 C14 130 18 140 24 138 C30 136 32 124 34 114 C36 104 38 94 38 80Z" fillOpacity="0.75" />

                {/* ── Lengan kiri (di layar kiri) tegak ke bawah dengan keris/senjata ── */}
                <path d="M62 80 C70 85 76 95 76 110 C76 124 68 130 62 128 C56 126 56 116 58 104 C60 92 62 86 62 80Z" fillOpacity="0.75" />

                {/* ── Tangan memegang keris ── */}
                <path d="M24 138 L18 158 L22 160 L28 142 Z" fillOpacity="0.6" />
                {/* Keris */}
                <path d="M18 158 L10 190 C10 190 11 198 14 194 C16 192 14 186 16 182 C18 178 20 172 20 166 Z" fillOpacity="0.7" />
                <path d="M14 194 L8 220 L12 221 L16 198 Z" fillOpacity="0.5" />

                {/* ── Kain / Jarik bawah ── */}
                <path d="M34 160 Q28 200 30 240 L44 244 L50 210 L56 244 L70 240 Q72 200 66 160 Z" fillOpacity="0.8" />

                {/* ── Motif jarik ── */}
                <path d="M34 170 Q50 165 66 170" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.35" />
                <path d="M33 185 Q50 179 67 185" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.35" />
                <path d="M32 200 Q50 194 68 200" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.35" />
                <path d="M31 215 Q50 208 69 215" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.35" />

                {/* ── Kaki ── */}
                <path d="M30 240 L26 290 L34 292 L40 260 Z" fillOpacity="0.7" />
                <path d="M70 240 L74 290 L66 292 L60 260 Z" fillOpacity="0.7" />
                <path d="M26 290 L20 300 L36 302 L34 292 Z" fillOpacity="0.5" />
                <path d="M74 290 L80 300 L64 302 L66 292 Z" fillOpacity="0.5" />

                {/* ── Selendang melayang ── */}
                <path d="M62 90 C80 70 96 60 98 80 C100 96 88 110 76 108 C70 107 66 100 62 95Z" fillOpacity="0.25" />
            </svg>
        </div>
    );
}

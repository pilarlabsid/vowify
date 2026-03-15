'use client';

/**
 * KalaOrnament — Kepala Kala (Raksasa) khas relief candi Jawa
 * Digunakan sebagai ornamen atas/bawah section untuk suasana mistis-sakral.
 */
export default function KalaOrnament({
    flipped = false,
    className = '',
}: {
    flipped?: boolean;
    className?: string;
}) {
    return (
        <div className={`flex justify-center overflow-hidden ${className}`}
            style={{ transform: flipped ? 'scaleY(-1)' : 'none' }}>
            <svg
                width="280"
                height="80"
                viewBox="0 0 280 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gold opacity-50"
            >
                {/* ── Garis horizontal hias ── */}
                <line x1="0" y1="78" x2="280" y2="78" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1="0" y1="74" x2="280" y2="74" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.25" />

                {/* ── Border ornamen kiri & kanan ── */}
                <path d="M0 78 L10 60 L5 40 L15 30 L10 10 L30 20 L40 8 L50 22 L60 14 L65 28" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.5" />
                <path d="M280 78 L270 60 L275 40 L265 30 L270 10 L250 20 L240 8 L230 22 L220 14 L215 28" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.5" />

                {/* ── Kepala Kala tengah ── */}
                {/* Wajah bulat */}
                <ellipse cx="140" cy="50" rx="36" ry="30" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" />

                {/* Mata besar melotot kiri */}
                <ellipse cx="126" cy="46" rx="9" ry="10" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
                <ellipse cx="126" cy="46" rx="5" ry="6" fill="currentColor" fillOpacity="0.5" />
                <ellipse cx="124" cy="44" rx="2" ry="2" fill="currentColor" />

                {/* Mata besar melotot kanan */}
                <ellipse cx="154" cy="46" rx="9" ry="10" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
                <ellipse cx="154" cy="46" rx="5" ry="6" fill="currentColor" fillOpacity="0.5" />
                <ellipse cx="152" cy="44" rx="2" ry="2" fill="currentColor" />

                {/* Alis tebal melengkung */}
                <path d="M116 35 Q126 30 136 35" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M144 35 Q154 30 164 35" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                {/* Hidung lebar */}
                <path d="M134 52 Q140 56 146 52 Q143 62 140 62 Q137 62 134 52Z" fill="currentColor" fillOpacity="0.5" />

                {/* Mulut menganga dengan taring */}
                <path d="M118 64 Q140 76 162 64 Q154 74 140 78 Q126 74 118 64Z" fill="currentColor" fillOpacity="0.35" />
                {/* Taring kiri */}
                <path d="M126 68 L122 80 L128 78 Z" fill="currentColor" fillOpacity="0.5" />
                {/* Taring kanan */}
                <path d="M154 68 L158 80 L152 78 Z" fill="currentColor" fillOpacity="0.5" />

                {/* Kumis / Makara kiri & kanan */}
                <path d="M104 56 C96 52 88 58 90 64 C92 70 102 66 106 62" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M176 56 C184 52 192 58 190 64 C188 70 178 66 174 62" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                {/* Mahkota / Praba Kala */}
                <path d="M110 22 L116 10 L122 20 L128 6 L134 18 L140 2 L146 18 L152 6 L158 20 L164 10 L170 22" stroke="currentColor" strokeWidth="1.2" fill="none" strokeOpacity="0.6" />
                <path d="M110 22 L170 22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />

                {/* Hiasan sisi kala ── motif sulur */}
                <path d="M65 28 C75 22 90 30 95 42 C90 52 80 52 76 46 C80 40 85 36 80 32 C75 28 68 32 65 38" stroke="currentColor" strokeWidth="0.9" fill="none" strokeOpacity="0.4" />
                <path d="M215 28 C205 22 190 30 185 42 C190 52 200 52 204 46 C200 40 195 36 200 32 C205 28 212 32 215 38" stroke="currentColor" strokeWidth="0.9" fill="none" strokeOpacity="0.4" />
            </svg>
        </div>
    );
}

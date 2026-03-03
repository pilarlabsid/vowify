'use client';

export default function GununganDivider({ className = "" }: { className?: string }) {
    return (
        <div className={`flex justify-center items-center my-8 ${className}`}>
            <svg
                width="120"
                height="100"
                viewBox="0 0 100 130"
                fill="currentColor"
                className="text-gold opacity-80"
            >
                {/* Simple Gunungan Wayang Shape Path */}
                <path d="M50 0 L100 100 L85 130 L15 130 L0 100 Z" />
                <circle cx="50" cy="65" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 35 V95 M35 65 H65" stroke="currentColor" strokeWidth="2" />
                <path d="M15 130 Q30 90 50 130 Q70 90 85 130" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
        </div>
    );
}

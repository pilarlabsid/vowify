'use client';

/** Thin gold hairline divider between sections */
export default function Divider() {
    return (
        <div className="relative flex items-center justify-center py-0" aria-hidden>
            <div className="absolute inset-0 flex items-center">
                <div className="w-full mn-hr-full" style={{ opacity: 0.6 }} />
            </div>
            <div
                className="relative z-10 w-2 h-2 rotate-45"
                style={{ background: 'var(--mn-sage)', opacity: 0.45 }}
            />
        </div>
    );
}

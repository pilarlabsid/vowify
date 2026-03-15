'use client';

import { useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamelanPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
                style={{
                    background: isPlaying ? 'var(--wbg-grad-gold)' : 'var(--wbg-black-soft)',
                    border: '1px solid var(--wbg-border-glow)',
                    boxShadow: isPlaying ? 'var(--wbg-shadow-gold)' : 'var(--wbg-shadow)',
                    color: isPlaying ? 'var(--wbg-black)' : 'var(--wbg-gold)',
                }}
                title={isPlaying ? 'Pause Musik' : 'Mainkan Gamelan'}
            >
                {isPlaying ? (
                    <>
                        <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'var(--wbg-gold)' }} />
                        <Music className="w-5 h-5 relative z-10" />
                    </>
                ) : (
                    <VolumeX className="w-5 h-5" />
                )}
            </motion.button>
        </AnimatePresence>
    );
}

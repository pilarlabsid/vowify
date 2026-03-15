'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Volume2, VolumeX, Pause, Play } from 'lucide-react';

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Local Romantic Music File
    const musicUrl = "/landing-music.mp3";

    useEffect(() => {
        // Hide tooltip after 5 seconds
        const timer = setTimeout(() => setShowTooltip(false), 5000);
        
        // Initial setup for volume and autoplay attempt
        const audio = audioRef.current;
        if (audio) {
            audio.volume = 0; // Start at 0 for fade-in
            
            const startPlayback = () => {
                audio.play().then(() => {
                    setIsPlaying(true);
                    fadeIn(audio);
                    // Remove listeners once playing
                    window.removeEventListener('click', startPlayback);
                    window.removeEventListener('touchstart', startPlayback);
                    window.removeEventListener('scroll', startPlayback);
                }).catch(err => {
                    console.log("Autoplay blocked, waiting for interaction...");
                });
            };

            // Attempt immediate autoplay
            startPlayback();

            // Fallback: Start playback on first user interaction
            window.addEventListener('click', startPlayback);
            window.addEventListener('touchstart', startPlayback);
            window.addEventListener('scroll', startPlayback);
        }

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const fadeIn = (audio: HTMLAudioElement) => {
        let vol = 0;
        const interval = 50; // ms
        const step = 0.02; // Increase volume by 2% each step
        const fadeTimer = setInterval(() => {
            if (vol < 1) {
                vol += step;
                audio.volume = Math.min(vol, 1);
            } else {
                clearInterval(fadeTimer);
            }
        }, interval);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                audioRef.current!.volume = 1; // Direct jump to full volume on manual play
            });
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center">
            {/* Hidden Audio Element */}
            <audio 
                ref={audioRef} 
                src={musicUrl} 
                loop 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Main Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className={`group relative w-12 h-12 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 ${
                    isPlaying 
                    ? 'bg-white border-2 border-[var(--lp-gold)]' 
                    : 'bg-[var(--lp-gold)] border-none'
                }`}
            >
                {/* Subtle Pulse Highlight when NOT playing (to notify user) */}
                {!isPlaying && (
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-[var(--lp-gold)] rounded-full -z-10"
                    />
                )}

                {/* Background Rotating Aura if playing */}
                {isPlaying && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-[-4px] border border-[var(--lp-gold)]/20 rounded-full animate-ping pointer-events-none"
                    />
                )}

                {/* Vinyl Record Icon for the gold theme */}
                <div className="relative z-10">
                    {isPlaying ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="text-[var(--lp-gold)]"
                        >
                            <Music2 className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <Music className="w-5 h-5 text-white" />
                    )}
                </div>

                {/* Floating Wave Icons when playing */}
                {isPlaying && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5">
                        <motion.div 
                            animate={{ height: [4, 10, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="w-0.5 bg-[var(--lp-gold)]"
                        />
                        <motion.div 
                            animate={{ height: [8, 4, 8] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-0.5 bg-[var(--lp-gold)]"
                        />
                    </div>
                )}
            </motion.button>
        </div>
    );
}

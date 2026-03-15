'use client';

import { useState, useRef, useEffect } from "react";
import { Music, Music2 } from "lucide-react";

export default function GamelanPlayer({ audioSrc = "/assets/gamelan.mp3" }: { audioSrc?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((err) => console.log("Music play blocked", err));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <audio ref={audioRef} src={audioSrc} loop />
            <button
                onClick={toggleMusic}
                className="bg-gold p-3 rounded-full shadow-lg border-2 border-primary text-primary hover:scale-110 transition-transform flex items-center justify-center animate-pulse"
                aria-label="Toggle Music"
            >
                {isPlaying ? <Music className="w-6 h-6" /> : <Music2 className="w-6 h-6 opacity-50" />}
            </button>
        </div>
    );
}

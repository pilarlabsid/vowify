"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const petalPath = "M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0Z"; // Or use a proper petal SVG shape
const customPetalPath = "M15.42 2.37c-3.1-1.3-6.23-.7-8.38 1.45C4.89 5.98 4.3 9.1 5.6 12.2c1.3 3.1 4.41 4.67 6.57 2.52 2.15-2.15 3.73-5.26 2.43-8.37-1.3-3.1-4.42-4.66-6.57-2.52-2.16 2.15-1.56 5.27.74 8.37M20 18.2c-.37 3.3-3.23 5.4-6.38 4.68-3.16-.73-5.4-3.56-5.03-6.86.37-3.3 3.23-5.4 6.38-4.68 3.16.73 5.4 3.56 5.03 6.86z";


type PetalDef = { id: number; x: number; delay: number; duration: number; scale: number; rotateStart: number; rotateEnd: number };

export default function Petals({ count = 20 }: { count?: number }) {
  const [petals, setPetals] = useState<PetalDef[]>([]);

  useEffect(() => {
    // Generate petals only on client to avoid hydration mismatch
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random X position percentage
      delay: Math.random() * 10, // random start delay
      duration: 15 + Math.random() * 20, // 15-35s fall duration
      scale: 0.3 + Math.random() * 0.5,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 720,
    }));
    setPetals(generated);
  }, [count]);

  if (petals.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-10%]"
          style={{ left: `${p.x}%` }}
          initial={{ y: "-10vh", rotate: p.rotateStart, scale: p.scale }}
          animate={{
            y: "110vh",
            rotate: p.rotateEnd,
            x: ["0vw", "5vw", "-5vw", "0vw"],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            rotate: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            x: { duration: p.duration * 0.5, repeat: Infinity, ease: "easeInOut", delay: p.delay, repeatType: "mirror" },
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ fill: "rgba(244, 214, 214, 0.6)", filter: "blur(0.5px)" }} // Blush Petal color + opacity
          >
            <path d={customPetalPath} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 *  TEMPLATE REGISTRY – Single Source of Truth
 * ─────────────────────────────────────────────────────────────
 *
 *  Cara tambah template baru:
 *  1. Buat komponen di  src/templates/[nama]/index.tsx
 *     - Props: { data: WeddingData; guestName?: string }
 *  2. Import di bawah dan tambahkan ke TEMPLATES array.
 *  3. Selesai – routing, preview, dan dashboard otomatis mengenali.
 *
 * ─────────────────────────────────────────────────────────────
 */

import { WeddingData } from './types';
import { ComponentType } from 'react';

// ── Import semua template di sini ──────────────────────────────
import JavaneseTemplate from '@/templates/javanese';
import MinimalistTemplate from '@/templates/minimalist';
import ElegantTemplate from '@/templates/elegant';

// ── Tipe ──────────────────────────────────────────────────────
export interface TemplateProps {
    data: WeddingData;
    guestName?: string;
}

export interface TemplateConfig {
    /** ID unik, harus cocok dengan nilai themeId di database */
    id: string;
    /** Nama tampilan di dashboard */
    name: string;
    /** Deskripsi singkat */
    description: string;
    /** Path gambar preview (letakkan di /public/images/templates/) */
    previewImage: string;
    /** Tag fitur yang ditampilkan saat hover */
    features: string[];
    /** Badge warna untuk UI (opsional) */
    badge?: string;
    /** Tandai jika template premium/berbayar */
    isPremium?: boolean;
    /** Komponen React yang dirender */
    component: ComponentType<TemplateProps>;
}

// ── Daftar semua template ──────────────────────────────────────
export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'javanese',
        name: 'Javanese Traditional',
        description: 'Tema tradisional Jawa yang kental dengan nuansa budaya, motif batik, dan harmonisasi warna cokelat keemasan.',
        previewImage: '/images/templates/javanese.png',
        features: ['Batik Overlay', 'Instrumen Gamelan', 'Gunungan Divider', 'Typography Klasik'],
        badge: 'Populer',
        component: JavaneseTemplate,
    },
    {
        id: 'minimalist',
        name: 'Modern Minimalist',
        description: 'Desain bersih dan modern dengan fokus pada tipografi yang elegan dan ruang putih yang luas.',
        previewImage: '/images/templates/minimalist.png',
        features: ['Clean Layout', 'Floral Line Art', 'Serif Fonts', 'Mobile Optimized'],
        component: MinimalistTemplate,
    },
    {
        id: 'elegant',
        name: 'Elegant Night',
        description: 'Nuansa mewah dengan perpaduan warna gelap dan aksen emas yang memberikan kesan prestisius.',
        previewImage: '/images/templates/elegant.png',
        features: ['Dark Mode', 'Gold Foil Accents', 'Luxury Floral', 'Premium Feel'],
        isPremium: true,
        component: ElegantTemplate,
    },

    /*
     * ── TAMBAH TEMPLATE BARU DI SINI ──────────────────────────
     *
     * Contoh:
     * {
     *   id: 'rustic',
     *   name: 'Rustic Garden',
     *   description: 'Nuansa alam yang hangat dengan sentuhan bunga liar.',
     *   previewImage: '/images/templates/rustic.png',
     *   features: ['Botanical Art', 'Warm Palette', 'Hand-lettering'],
     *   component: RusticTemplate,
     * },
     *
     */
];

// ── Helper functions ───────────────────────────────────────────

/** Ambil config template berdasarkan ID */
export function getTemplateById(id: string): TemplateConfig | undefined {
    return TEMPLATES.find(t => t.id === id);
}

/** Render template berdasarkan ID. Kembalikan null jika tidak ditemukan. */
export function resolveTemplate(themeId: string): ComponentType<TemplateProps> | null {
    return getTemplateById(themeId)?.component ?? null;
}

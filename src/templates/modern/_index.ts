/**
 * modern/_index.ts
 *
 * Daftar template bertema modern & kontemporer.
 * Tambah template modern baru di file ini.
 *
 * ─── Panduan photoSlots ───────────────────────────────────────────
 *  WAJIB: spread CANONICAL_SLOTS — slot inti yang sama di semua template
 *  OPSIONAL: tambahkan slot dari _slots.ts sesuai kebutuhan desain template
 * ─────────────────────────────────────────────────────────────────
 */

import { TemplateConfig } from '../_types';
import {
    CANONICAL_SLOTS,
    SLOT_HERO_FULLSCREEN,
    SLOT_COUPLE_PORTRAIT,
    SLOT_COUPLE_SQUARE,
} from '../_slots';

import minimalistThumb from './minimalist/assets/minimalist.png';
import elegantThumb from './elegant/assets/elegant.png';

export const MODERN_TEMPLATES: TemplateConfig[] = [
    {
        id: 'minimalist',
        name: 'Modern Minimalist',
        description: 'Desain bersih dan modern dengan fokus pada tipografi yang elegan dan ruang putih yang luas.',
        previewImage: minimalistThumb.src,
        features: ['Clean Layout', 'Floral Line Art', 'Serif Fonts', 'Mobile Optimized'],
        category: 'modern',
        status: 'active',
        tier: 'free',
        tags: ['minimal', 'clean', 'modern', 'tipografi'],
        loader: () => import('@/templates/modern/minimalist'),
        // Core wajib + foto couple portrait opsional
        photoSlots: [
            ...CANONICAL_SLOTS,
            SLOT_COUPLE_PORTRAIT, // opsional: tampil di section profil berdua
        ],
    },
    {
        id: 'elegant',
        name: 'Elegant Night',
        description: 'Nuansa mewah dengan perpaduan warna gelap dan aksen emas yang memberikan kesan prestisius.',
        previewImage: elegantThumb.src,
        features: ['Dark Mode', 'Gold Foil Accents', 'Luxury Floral', 'Premium Feel'],
        badge: 'Premium',
        category: 'elegant',
        status: 'active',
        tier: 'premium',
        tags: ['mewah', 'gelap', 'emas', 'premium'],
        loader: () => import('@/templates/modern/elegant'),
        // Core wajib + hero fullscreen & couple square opsional
        photoSlots: [
            ...CANONICAL_SLOTS,
            SLOT_HERO_FULLSCREEN, // opsional: layar penuh saat opening
            SLOT_COUPLE_SQUARE,   // opsional: foto square di section tengah
        ],
    },

    /*
     * Tambah template modern baru di sini:
     *
     * {
     *   id: 'nordic',
     *   name: 'Nordic Simple',
     *   description: 'Inspirasi Skandinavia...',
     *   previewImage: '/images/templates/nordic.webp',
     *   features: ['Sans-serif', 'Monochrome', ...],
     *   category: 'modern',
     *   status: 'active',
     *   tier: 'free',
     *   tags: ['nordic', 'simple', 'modern'],
     *   loader: () => import('@/templates/nordic'),
     *   // Wajib spread CANONICAL_SLOTS, + optional tambahan
     *   photoSlots: [...CANONICAL_SLOTS],
     * },
     */
];

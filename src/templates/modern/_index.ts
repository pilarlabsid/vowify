/**
 * modern/_index.ts
 *
 * Daftar template bertema modern & kontemporer.
 * Tambah template modern baru di file ini.
 */

import { TemplateConfig } from '../_types';
import {
    SLOT_BRIDE_PORTRAIT,
    SLOT_GROOM_PORTRAIT,
    SLOT_HERO_LANDSCAPE,
    SLOT_HERO_FULLSCREEN,
    SLOT_COUPLE_SQUARE,
} from '../_slots';

export const MODERN_TEMPLATES: TemplateConfig[] = [
    {
        id: 'minimalist',
        name: 'Modern Minimalist',
        description: 'Desain bersih dan modern dengan fokus pada tipografi yang elegan dan ruang putih yang luas.',
        previewImage: '/images/templates/minimalist.png',
        features: ['Clean Layout', 'Floral Line Art', 'Serif Fonts', 'Mobile Optimized'],
        category: 'modern',
        status: 'active',
        tier: 'free',
        tags: ['minimal', 'clean', 'modern', 'tipografi'],
        loader: () => import('@/templates/minimalist'),
        photoSlots: [
            SLOT_HERO_LANDSCAPE,
            SLOT_BRIDE_PORTRAIT,
            SLOT_GROOM_PORTRAIT,
        ],
    },
    {
        id: 'elegant',
        name: 'Elegant Night',
        description: 'Nuansa mewah dengan perpaduan warna gelap dan aksen emas yang memberikan kesan prestisius.',
        previewImage: '/images/templates/elegant.png',
        features: ['Dark Mode', 'Gold Foil Accents', 'Luxury Floral', 'Premium Feel'],
        badge: 'Premium',
        category: 'elegant',
        status: 'active',
        tier: 'premium',
        tags: ['mewah', 'gelap', 'emas', 'premium'],
        loader: () => import('@/templates/elegant'),
        photoSlots: [
            SLOT_HERO_FULLSCREEN,
            SLOT_BRIDE_PORTRAIT,
            SLOT_GROOM_PORTRAIT,
            SLOT_COUPLE_SQUARE,
        ],
    },

    /*
     * Tambah template modern baru di sini:
     *
     * {
     *   id: 'nordic',
     *   name: 'Nordic Simple',
     *   description: 'Inspirasi Skandinavia...',
     *   previewImage: '/images/templates/nordic.png',
     *   features: ['Sans-serif', 'Monochrome', ...],
     *   category: 'modern',
     *   status: 'active',
     *   tier: 'free',
     *   tags: ['nordic', 'simple', 'modern'],
     *   loader: () => import('@/templates/nordic'),
     *   photoSlots: [SLOT_BRIDE_PORTRAIT, SLOT_GROOM_PORTRAIT],
     * },
     */
];

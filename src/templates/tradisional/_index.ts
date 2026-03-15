/**
 * tradisional/_index.ts
 *
 * Daftar template bertema budaya nusantara.
 * Tambah template tradisional baru di file ini.
 *
 * ─── Panduan photoSlots ───────────────────────────────────────────
 *  WAJIB: spread CANONICAL_SLOTS — slot inti yang sama di semua template
 *  OPSIONAL: tambahkan slot dari _slots.ts sesuai kebutuhan desain template
 * ─────────────────────────────────────────────────────────────────
 */

import { TemplateConfig } from '../_types';
import { CANONICAL_SLOTS } from '../_slots';
import javaneseThumb from './javanese/assets/javanese.png';
import wayangThumb from './wayang-black-gold/assets/thumb.webp';

export const TRADISIONAL_TEMPLATES: TemplateConfig[] = [
    {
        id: 'javanese',
        name: 'Javanese Traditional',
        description: 'Tema tradisional Jawa yang kental dengan nuansa budaya, motif batik, dan harmonisasi warna cokelat keemasan.',
        previewImage: javaneseThumb.src,
        features: ['Batik Overlay', 'Instrumen Gamelan', 'Gunungan Divider', 'Typography Klasik'],
        badge: 'Populer',
        category: 'tradisional',
        status: 'active',
        tier: 'free',
        tags: ['jawa', 'batik', 'gamelan', 'traditional'],
        loader: () => import('@/templates/tradisional/javanese'),
        photoSlots: [
            ...CANONICAL_SLOTS,
        ],
    },

    {
        id: 'wayang-black-gold',
        name: 'Wayang Black & Gold',
        description: 'Undangan pernikahan eksklusif bergaya wayang Jawa klasik dengan palet hitam pekat dan emas mewah. Elegan, dramatis, dan penuh nuansa budaya.',
        previewImage: wayangThumb.src,
        features: ['Wayang Silhouette', 'Batik Kawung Pattern', 'Black & Gold Palette', 'Cinzel Typography'],
        badge: 'Baru',
        category: 'tradisional',
        status: 'active',
        tier: 'premium',
        tags: ['wayang', 'jawa', 'hitam', 'emas', 'elegan', 'traditional'],
        loader: () => import('@/templates/tradisional/wayang-black-gold'),
        photoSlots: [
            ...CANONICAL_SLOTS,
        ],
    },

    /*
     * Tambah template tradisional baru di sini:
     *
     * {
     *   id: 'sundanese',
     *   name: 'Sundanese Elegance',
     *   description: 'Keanggunan budaya Sunda...',
     *   previewImage: '/images/templates/sundanese.webp',
     *   features: ['Motif Sunda', 'Kecapi Music', ...],
     *   category: 'tradisional',
     *   status: 'active',
     *   tier: 'free',
     *   tags: ['sunda', 'tradisional'],
     *   loader: () => import('@/templates/sundanese'),
     *   photoSlots: [...CANONICAL_SLOTS],
     * },
     */
];

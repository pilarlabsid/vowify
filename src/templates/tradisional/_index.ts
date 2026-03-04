/**
 * tradisional/_index.ts
 *
 * Daftar template bertema budaya nusantara.
 * Tambah template tradisional baru di file ini.
 */

import { TemplateConfig } from '../_types';
import { SLOT_BRIDE_PORTRAIT, SLOT_GROOM_PORTRAIT } from '../_slots';

export const TRADISIONAL_TEMPLATES: TemplateConfig[] = [
    {
        id: 'javanese',
        name: 'Javanese Traditional',
        description: 'Tema tradisional Jawa yang kental dengan nuansa budaya, motif batik, dan harmonisasi warna cokelat keemasan.',
        previewImage: '/images/templates/javanese.png',
        features: ['Batik Overlay', 'Instrumen Gamelan', 'Gunungan Divider', 'Typography Klasik'],
        badge: 'Populer',
        category: 'tradisional',
        status: 'active',
        tier: 'free',
        tags: ['jawa', 'batik', 'gamelan', 'traditional'],
        loader: () => import('@/templates/tradisional/javanese'),
        photoSlots: [
            SLOT_BRIDE_PORTRAIT,
            SLOT_GROOM_PORTRAIT,
        ],
    },

    /*
     * Tambah template tradisional baru di sini:
     *
     * {
     *   id: 'sundanese',
     *   name: 'Sundanese Elegance',
     *   description: 'Keanggunan budaya Sunda...',
     *   previewImage: '/images/templates/sundanese.png',
     *   features: ['Motif Sunda', 'Kecapi Music', ...],
     *   category: 'tradisional',
     *   status: 'active',
     *   tier: 'free',
     *   tags: ['sunda', 'tradisional'],
     *   loader: () => import('@/templates/sundanese'),
     *   photoSlots: [SLOT_BRIDE_PORTRAIT, SLOT_GROOM_PORTRAIT],
     * },
     */
];

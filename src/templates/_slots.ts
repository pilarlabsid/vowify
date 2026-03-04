/**
 * _slots.ts — Canonical photo slots yang dishare lintas template
 *
 * Gunakan konstanta ini di _index.ts kategori agar key tidak typo
 * dan definisi tidak duplikat di banyak tempat.
 *
 * Slot dengan key yang SAMA di dua template berbeda → satu upload
 * berlaku untuk keduanya secara otomatis.
 */

import { PhotoSlot } from './_types';

// ─── Foto Mempelai ────────────────────────────────────────────────────────────

export const SLOT_BRIDE_PORTRAIT: PhotoSlot = {
    key: 'bride_portrait',
    label: 'Foto Mempelai Wanita',
    hint: 'Potret vertikal 3:4 — tampil di section profil mempelai',
    aspect: '3/4',
    required: true,
    section: 'Foto Mempelai',
    description: 'Foto portrait mempelai wanita di bagian perkenalan.',
    canonical: true,
};

export const SLOT_GROOM_PORTRAIT: PhotoSlot = {
    key: 'groom_portrait',
    label: 'Foto Mempelai Pria',
    hint: 'Potret vertikal 3:4 — tampil di section profil mempelai',
    aspect: '3/4',
    required: true,
    section: 'Foto Mempelai',
    description: 'Foto portrait mempelai pria di bagian perkenalan.',
    canonical: true,
};

export const SLOT_COUPLE_PORTRAIT: PhotoSlot = {
    key: 'couple_portrait',
    label: 'Foto Berdua (Portrait)',
    hint: 'Potret vertikal 3:4 — foto bersama mempelai',
    aspect: '3/4',
    required: false,
    section: 'Foto Mempelai',
    description: 'Foto kedua mempelai bersama.',
    canonical: true,
};

// ─── Foto Cover / Hero ────────────────────────────────────────────────────────

export const SLOT_HERO_LANDSCAPE: PhotoSlot = {
    key: 'hero_couple',
    label: 'Foto Cover Bersama (Hero)',
    hint: 'Landscape 16:9 — tampil penuh di halaman utama',
    aspect: '16/9',
    required: true,
    section: 'Cover',
    description: 'Foto berdua yang menjadi latar halaman pembuka.',
    canonical: true,
};

export const SLOT_HERO_FULLSCREEN: PhotoSlot = {
    key: 'hero_fullscreen',
    label: 'Foto Hero Full-Screen',
    hint: 'Landscape lebar — cover pembuka undangan',
    aspect: '16/9',
    required: true,
    section: 'Cover',
    description: 'Gambar besar yang mengisi seluruh layar saat undangan dibuka.',
    canonical: true,
};

// ─── Foto Tambahan ────────────────────────────────────────────────────────────

export const SLOT_COUPLE_SQUARE: PhotoSlot = {
    key: 'couple_together',
    label: 'Foto Berdua (Square)',
    hint: 'Format square 1:1 — opsional',
    aspect: '1/1',
    required: false,
    section: 'Foto Tambahan',
    description: 'Foto berdua yang tampil di section tambahan.',
    canonical: true,
};

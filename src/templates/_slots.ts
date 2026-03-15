/**
 * _slots.ts — Canonical photo slots yang dishare lintas template
 *
 * ═══════════════════════════════════════════════════════════════
 *  SHARED CORE + OPTIONAL FIELDS
 * ═══════════════════════════════════════════════════════════════
 *
 *  CANONICAL_SLOTS → Slot WAJIB yang harus ada di SEMUA template.
 *  Ini menjamin user tidak perlu upload ulang saat ganti tema.
 *
 *  OPTIONAL_SLOTS  → Slot tambahan yang boleh ditambah per template
 *  sesuai kebutuhan desain. Semua opsional (required: false).
 *
 *  Aturan:
 *  - Slot dengan key yang SAMA di dua template → satu upload berlaku untuk keduanya
 *  - Template WAJIB include semua CANONICAL_SLOTS di photoSlots-nya
 *  - Template BOLEH tambah slot dari OPTIONAL_SLOTS atau buat slot custom sendiri
 * ═══════════════════════════════════════════════════════════════
 */

import { PhotoSlot } from './_types';

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SLOTS — WAJIB ada di setiap template
// ─────────────────────────────────────────────────────────────────────────────

/** Foto portrait mempelai wanita (vertikal 3:4) */
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

/** Foto portrait mempelai pria (vertikal 3:4) */
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

/** Foto hero/cover berdua (landscape 16:9) */
export const SLOT_HERO_COUPLE: PhotoSlot = {
    key: 'hero_couple',
    label: 'Foto Cover Bersama',
    hint: 'Landscape 16:9 — tampil di halaman pembuka undangan',
    aspect: '16/9',
    required: true,
    section: 'Cover',
    description: 'Foto berdua yang menjadi latar halaman pembuka.',
    canonical: true,
};

/**
 * Gallery foto (6 slot standar, required: false agar tidak memaksa,
 * tapi semua template wajib menyertakan slot-slot ini)
 */
export const SLOT_GALLERY: PhotoSlot[] = [1, 2, 3, 4, 5, 6].map((n) => ({
    key: `gallery_${n}`,
    label: `Foto Galeri ${n}`,
    hint: `Foto galeri ke-${n} — landscape atau portrait`,
    aspect: '4/3',
    required: n <= 3, // foto 1-3 wajib, 4-6 opsional
    section: 'Galeri',
    description: `Foto galeri ke-${n} yang tampil di section galeri undangan.`,
    canonical: true,
}));

/**
 * CANONICAL_SLOTS — array lengkap slot wajib untuk semua template.
 * Gunakan spread ini di setiap photoSlots template:
 *
 * @example
 *   photoSlots: [...CANONICAL_SLOTS, ...OPTIONAL_SLOTS_TEMPLATE_INI]
 */
export const CANONICAL_SLOTS: PhotoSlot[] = [
    SLOT_BRIDE_PORTRAIT,
    SLOT_GROOM_PORTRAIT,
    SLOT_HERO_COUPLE,
    ...SLOT_GALLERY,
];

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONAL SLOTS — Opsional, boleh ditambah per template sesuai kebutuhan
// ─────────────────────────────────────────────────────────────────────────────

/** Foto berdua portrait (opsional — untuk template dengan section khusus couple) */
export const SLOT_COUPLE_PORTRAIT: PhotoSlot = {
    key: 'couple_portrait',
    label: 'Foto Berdua (Portrait)',
    hint: 'Potret vertikal 3:4 — foto bersama mempelai',
    aspect: '3/4',
    required: false,
    section: 'Foto Tambahan',
    description: 'Foto kedua mempelai bersama dalam format portrait.',
    canonical: false,
};

/** Foto hero fullscreen (opsional — untuk template dengan opening layar penuh) */
export const SLOT_HERO_FULLSCREEN: PhotoSlot = {
    key: 'hero_fullscreen',
    label: 'Foto Hero Full-Screen',
    hint: 'Landscape lebar — cover pembuka undangan full layar',
    aspect: '16/9',
    required: false,
    section: 'Cover',
    description: 'Gambar besar yang mengisi seluruh layar saat undangan dibuka.',
    canonical: false,
};

/** Foto berdua square (opsional — untuk template dengan section square) */
export const SLOT_COUPLE_SQUARE: PhotoSlot = {
    key: 'couple_together',
    label: 'Foto Berdua (Square)',
    hint: 'Format square 1:1 — opsional',
    aspect: '1/1',
    required: false,
    section: 'Foto Tambahan',
    description: 'Foto berdua yang tampil di section tambahan.',
    canonical: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// BACKWARD COMPAT — alias untuk nama lama (deprecated)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Gunakan SLOT_HERO_COUPLE */
export const SLOT_HERO_LANDSCAPE = SLOT_HERO_COUPLE;

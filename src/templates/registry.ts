/**
 * ═══════════════════════════════════════════════════════════════════
 *  TEMPLATE REGISTRY — Aggregator
 *  src/templates/registry.ts
 * ═══════════════════════════════════════════════════════════════════
 *
 *  File ini adalah AGREGATOR — mengumpulkan semua template dari
 *  subfolder kategori dan mengekspor API yang dipakai seluruh app.
 *
 *  ⚠️  JANGAN tambah template langsung di file ini.
 *
 *  Cara tambah template baru:
 *  1. Buat src/templates/[nama]/index.tsx  → komponen (props: TemplateProps)
 *  2. Buat src/templates/[nama]/styles.css → CSS token khusus template
 *  3. Edit src/templates/[kategori]/_index.ts → tambah entry ke array
 *  4. Selesai — tidak ada file lain yang perlu disentuh
 *
 *  Kategori yang tersedia:
 *    tradisional/_index.ts  → tema budaya nusantara
 *    modern/_index.ts       → tema modern & kontemporer
 *    (buat folder kategori baru kapanpun diperlukan)
 *
 * ═══════════════════════════════════════════════════════════════════
 */

import { ComponentType } from 'react';

// ── Re-export tipe agar konsumen tidak perlu import dari _types secara langsung
export type {
    TemplateConfig,
    TemplateProps,
    PhotoSlot,
    TemplateCategory,
    TemplateStatus,
    TemplateTier,
} from './_types';

// ── Import dari tiap kategori ──────────────────────────────────────
import { TRADISIONAL_TEMPLATES } from './tradisional/_index';
import { MODERN_TEMPLATES } from './modern/_index';
// Tambah kategori baru di sini:
// import { FLORAL_TEMPLATES } from './floral/_index';
// import { RUSTIC_TEMPLATES } from './rustic/_index';
// import { ISLAMIC_TEMPLATES } from './islamic/_index';

import type { TemplateConfig, TemplateProps, PhotoSlot } from './_types';

// ── Gabungan semua template ────────────────────────────────────────
export const TEMPLATES: TemplateConfig[] = [
    ...TRADISIONAL_TEMPLATES,
    ...MODERN_TEMPLATES,
    // ...FLORAL_TEMPLATES,
];

/** Hanya template yang statusnya 'active' — untuk ditampilkan di dashboard */
export const ACTIVE_TEMPLATES = TEMPLATES.filter(t => t.status === 'active');

/** Template berdasarkan tier */
export const FREE_TEMPLATES = TEMPLATES.filter(t => t.tier === 'free');
export const PREMIUM_TEMPLATES = TEMPLATES.filter(t => t.tier === 'premium');

// ─────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

/** Ambil config template berdasarkan ID (mencari di semua status) */
export function getTemplateById(id: string): TemplateConfig | undefined {
    return TEMPLATES.find(t => t.id === id);
}

/** Alias backward compat */
export const getTemplate = getTemplateById;

/**
 * Load dan kembalikan komponen template berdasarkan ID.
 * Dynamic import — hanya modul yang diminta yang dimuat.
 * Kembalikan null jika template tidak ditemukan.
 *
 * @example
 *   const Template = await resolveTemplate('javanese');
 */
export async function resolveTemplate(themeId: string): Promise<ComponentType<TemplateProps> | null> {
    const config = getTemplateById(themeId);
    if (!config) return null;
    const mod = await config.loader();
    return mod.default;
}

/** Ambil semua photo slots untuk satu template */
export function getPhotoSlots(themeId: string): PhotoSlot[] {
    return getTemplateById(themeId)?.photoSlots ?? [];
}

/** Kelompokkan photo slots berdasarkan section untuk UI gallery */
export function getPhotoSlotsBySection(themeId: string): Record<string, PhotoSlot[]> {
    return getPhotoSlots(themeId).reduce<Record<string, PhotoSlot[]>>((acc, slot) => {
        if (!acc[slot.section]) acc[slot.section] = [];
        acc[slot.section].push(slot);
        return acc;
    }, {});
}

/**
 * Foto tersimpan yang key-nya TIDAK ada di template aktif saat ini.
 * Foto dari template lain yang masih aman di DB.
 */
export function getOtherTemplatePhotos(
    photos: Record<string, string>,
    currentThemeId: string,
): { key: string; url: string; fromTemplates: string[] }[] {
    const activeKeys = new Set(getPhotoSlots(currentThemeId).map(s => s.key));
    const result: { key: string; url: string; fromTemplates: string[] }[] = [];

    for (const [key, url] of Object.entries(photos)) {
        if (!url) continue;
        if (activeKeys.has(key)) continue;

        const fromTemplates = TEMPLATES
            .filter(t => t.id !== currentThemeId && t.photoSlots.some(s => s.key === key))
            .map(t => t.name);

        result.push({ key, url, fromTemplates });
    }

    return result;
}

/**
 * Nama template lain yang menggunakan slot key yang sama.
 * Untuk badge "Juga dipakai oleh: ..." di dashboard gallery.
 */
export function getSharedTemplateNames(slotKey: string, currentThemeId: string): string[] {
    return TEMPLATES
        .filter(t => t.id !== currentThemeId && t.photoSlots.some(s => s.key === slotKey))
        .map(t => t.name);
}

/**
 * Resolve photo URL dari map photos, dengan fallback ke legacy field.
 * Komponen template menggunakan ini untuk backward compat.
 */
export function resolvePhoto(
    photos: Record<string, string>,
    key: string,
    legacy?: string,
): string {
    return photos?.[key] || legacy || '';
}

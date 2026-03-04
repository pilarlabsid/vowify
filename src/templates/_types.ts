/**
 * _types.ts — Definisi tipe untuk sistem template Vowify.id
 *
 * Diimport oleh registry.ts dan _index.ts per-kategori.
 * Tidak mengimport apapun dari modul lain agar tidak circular.
 */

import { ComponentType } from 'react';
import { WeddingData } from '@/lib/types';

// ─── Props standar template ───────────────────────────────────────────────────

/** Props yang WAJIB diterima setiap komponen template */
export interface TemplateProps {
    data: WeddingData;
    guestName?: string;
}

// ─── Photo Slot ───────────────────────────────────────────────────────────────

/**
 * Definisi slot foto yang dibutuhkan template.
 * Slot dengan key yang sama (canonical) otomatis dishare antar template.
 */
export interface PhotoSlot {
    key: string;           // Unique key — SAME KEY = shared photo across templates
    label: string;
    hint?: string;
    aspect: string;        // CSS aspect-ratio, e.g. "3/4" | "16/9" | "1/1"
    required: boolean;
    section: string;       // Grouping label di dashboard gallery
    description?: string;
    /** canonical = true → dipakai banyak template, dashboard tampilkan badge khusus */
    canonical?: boolean;
}

// ─── Template metadata & config ───────────────────────────────────────────────

/** Kategori template untuk filter di dashboard */
export type TemplateCategory =
    | 'tradisional'   // Budaya nusantara: jawa, sunda, bali, dll
    | 'modern'        // Clean, minimalist, contemporary
    | 'floral'        // Nuansa bunga dan alam
    | 'rustic'        // Earthy, vintage, outdoor feel
    | 'islamic'       // Nuansa islami, arabesque
    | 'elegant'       // Mewah, dark, gold accents
    | 'other';        // Kategori lain

/** Status template untuk kontrol publish/draft */
export type TemplateStatus =
    | 'active'       // Tampil di dashboard, bisa dipakai user
    | 'draft'        // Sedang dikembangkan, tidak tampil di dashboard
    | 'deprecated';  // Template lama, tidak direkomendasikan tapi masih jalan

/** Tier akses template */
export type TemplateTier =
    | 'free'         // Bisa dipakai semua user
    | 'premium'      // Hanya user dengan paket berbayar
    | 'enterprise';  // Hanya user enterprise / khusus

/** Registrasi lengkap satu template — satu entry = satu template */
export interface TemplateConfig {
    /** ID unik — harus cocok dengan nilai themeId di database */
    id: string;

    /** Nama tampilan di dashboard */
    name: string;

    /** Deskripsi singkat */
    description: string;

    /** Path / URL gambar preview */
    previewImage: string;

    /** Tag fitur yang ditampilkan saat hover */
    features: string[];

    /** Badge teks opsional (contoh: "Populer", "Baru") */
    badge?: string;

    /** Kategori untuk filter di dashboard */
    category: TemplateCategory;

    /** Status publikasi template */
    status: TemplateStatus;

    /** Tier akses template */
    tier: TemplateTier;

    /** Tag pencarian tambahan */
    tags?: string[];

    /**
     * Dynamic loader — komponen hanya dimuat saat resolveTemplate() dipanggil.
     * Pattern: () => import('@/templates/nama')
     */
    loader: () => Promise<{ default: ComponentType<TemplateProps> }>;

    /**
     * Daftar slot foto yang dibutuhkan template ini.
     * Dashboard gallery otomatis menampilkan uploader berdasarkan list ini.
     */
    photoSlots: PhotoSlot[];
}

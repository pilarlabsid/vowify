import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TEMPLATES, mergeWithDB } from '@/templates/registry';

/**
 * GET /api/templates
 * Kembalikan daftar template yang aktif dan visible SESUAI DATA DATABASE.
 * Jika DB belum disinkron (kosong) → kembalikan array kosong.
 * Gunakan POST /api/admin/templates (sync) terlebih dahulu.
 */
export async function GET() {
    // Ambil semua override dari DB
    const dbRecords = await prisma.templateMetadata.findMany();
    const dbMap = new Map(dbRecords.map(r => [r.id, r]));

    // Hanya template yang punya record di DB dan statusnya active + visible
    const merged = TEMPLATES
        .filter(tpl => dbMap.has(tpl.id))           // hanya yang sudah di-sync ke DB
        .map(tpl => mergeWithDB(tpl, dbMap.get(tpl.id) as any))
        .filter(t => t.status === 'active' && t.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

    return NextResponse.json({
        templates: merged.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            previewImage: t.previewImage,
            features: t.features,
            badge: t.badge,
            category: t.category,
            tier: t.tier,
            tags: t.tags,
            isVisible: t.isVisible,
            sortOrder: t.sortOrder,
        })),
        total: merged.length,
        synced: dbRecords.length,
        available: TEMPLATES.length,
    });
}


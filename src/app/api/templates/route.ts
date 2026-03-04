import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TEMPLATES, mergeWithDB } from '@/templates/registry';

/**
 * GET /api/templates
 * Kembalikan daftar template yang aktif dan visible.
 * Metadata diambil dari DB jika tersedia, fallback ke kode.
 */
export async function GET() {
    try {
        // Ambil semua override dari DB
        const dbRecords = await prisma.templateMetadata.findMany();
        const dbMap = new Map(dbRecords.map(r => [r.id, r]));

        // Gabungkan kode + DB, filter yang aktif dan visible
        const merged = TEMPLATES
            .map(tpl => mergeWithDB(tpl, dbMap.get(tpl.id) ?? null))
            .filter(t => t.status === 'active' && t.isVisible)
            .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

        // Kirim hanya metadata — tidak ada loader (fungsi tidak bisa di-serialize)
        return NextResponse.json(merged.map(t => ({
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
        })));
    } catch (err) {
        console.error('[GET /api/templates]', err);
        // Fallback ke kode jika DB error
        const fallback = TEMPLATES
            .filter(t => t.status === 'active')
            .map(t => ({
                id: t.id,
                name: t.name,
                description: t.description,
                previewImage: t.previewImage,
                features: t.features,
                badge: t.badge,
                category: t.category,
                tier: t.tier,
                tags: t.tags ?? [],
                isVisible: true,
                sortOrder: 0,
            }));
        return NextResponse.json(fallback);
    }
}

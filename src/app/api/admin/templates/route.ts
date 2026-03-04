import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TEMPLATES, mergeWithDB } from '@/templates/registry';

/** Cek session admin */
async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
        return null;
    }
    return session;
}

/**
 * GET /api/admin/templates
 * Kembalikan SEMUA template (semua status) dengan merge DB.
 * Termasuk info apakah template sudah disinkron ke DB atau belum.
 */
export async function GET() {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const dbRecords = await prisma.templateMetadata.findMany();
    const dbMap = new Map(dbRecords.map(r => [r.id, r]));

    const merged = TEMPLATES
        .map(tpl => {
            const dbRecord = dbMap.get(tpl.id) ?? null;
            const m = mergeWithDB(tpl, dbRecord);
            return {
                ...m,
                loader: undefined,           // tidak serialize fungsi
                photoSlots: tpl.photoSlots,
                isSynced: dbRecord !== null, // apakah sudah ada di DB
                dbValues: dbRecord,          // raw DB values untuk UI
                codeDefaults: {              // nilai asli dari kode
                    name: tpl.name,
                    description: tpl.description,
                    badge: tpl.badge,
                    category: tpl.category,
                    status: tpl.status,
                    tier: tpl.tier,
                    features: tpl.features,
                    tags: tpl.tags ?? [],
                },
            };
        })
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

    return NextResponse.json(merged);
}

/**
 * POST /api/admin/templates/sync
 * Sinkron semua template dari kode ke DB.
 * Membuat record baru untuk template yang belum ada di DB.
 * Tidak menimpa nilai yang sudah ada.
 */
export async function POST() {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const now = new Date();
    let created = 0;
    let skipped = 0;

    for (const tpl of TEMPLATES) {
        const existing = await prisma.templateMetadata.findUnique({ where: { id: tpl.id } });
        if (existing) {
            // Update syncedAt saja
            await prisma.templateMetadata.update({
                where: { id: tpl.id },
                data: { syncedAt: now },
            });
            skipped++;
        } else {
            // Buat record baru dengan defaults dari kode
            await prisma.templateMetadata.create({
                data: {
                    id: tpl.id,
                    syncedAt: now,
                    // Semua field null/kosong → gunakan kode defaults
                },
            });
            created++;
        }
    }

    return NextResponse.json({
        message: `Sync selesai: ${created} template baru dibuat, ${skipped} diperbarui.`,
        created,
        skipped,
        total: TEMPLATES.length,
    });
}

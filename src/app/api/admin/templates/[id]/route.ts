import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTemplateById } from '@/templates/registry';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') return null;
    return session;
}

/**
 * PATCH /api/admin/templates/[id]
 * Update override metadata untuk satu template.
 * Kirim null untuk field tertentu = hapus override (gunakan kode default).
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    // Pastikan template ada di kode
    const codeTemplate = getTemplateById(id);
    if (!codeTemplate) {
        return NextResponse.json({ error: `Template "${id}" tidak ditemukan di registry kode.` }, { status: 404 });
    }

    const body = await req.json();
    const {
        name, description, badge, category,
        status, tier, previewImage,
        features, tags,
        isVisible, sortOrder,
    } = body;

    const record = await prisma.templateMetadata.upsert({
        where: { id },
        create: {
            id,
            name: name ?? null,
            description: description ?? null,
            badge: badge ?? null,
            category: category ?? null,
            status: status ?? null,
            tier: tier ?? null,
            previewImage: previewImage ?? null,
            features: Array.isArray(features) ? features : [],
            tags: Array.isArray(tags) ? tags : [],
            isVisible: isVisible ?? true,
            sortOrder: sortOrder ?? 0,
            syncedAt: new Date(),
        },
        update: {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(badge !== undefined && { badge }),
            ...(category !== undefined && { category }),
            ...(status !== undefined && { status }),
            ...(tier !== undefined && { tier }),
            ...(previewImage !== undefined && { previewImage }),
            ...(features !== undefined && { features: Array.isArray(features) ? features : [] }),
            ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
            ...(isVisible !== undefined && { isVisible }),
            ...(sortOrder !== undefined && { sortOrder }),
        },
    });

    return NextResponse.json(record);
}

/**
 * DELETE /api/admin/templates/[id]
 * Hapus semua override dari DB — template kembali ke nilai kode.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    try {
        await prisma.templateMetadata.delete({ where: { id } });
        return NextResponse.json({ message: `Override untuk "${id}" telah dihapus. Template kembali ke nilai kode.` });
    } catch {
        return NextResponse.json({ error: 'Record tidak ditemukan.' }, { status: 404 });
    }
}

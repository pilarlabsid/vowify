import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
    deleteLocalFiles,
    findReplacedSlotUrls,
    findRemovedGalleryUrls,
} from '@/lib/storage';

// GET /api/weddings/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const userId = (session.user as any).id;

    const wedding = await prisma.wedding.findFirst({
        where: { id, userId },
        include: { timeline: true, bankAccounts: true, greetings: { orderBy: { createdAt: 'desc' } } },
    });

    if (!wedding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ wedding });
}

// PUT /api/weddings/[id]  — update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const userId = (session.user as any).id;
    const body = await req.json();

    const existing = await prisma.wedding.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // ── Collect files to delete BEFORE DB update ──────────────────────────
    const filesToDelete: string[] = [];

    // 1. Photo slots: delete local files for any replaced slot
    if (body.photos !== undefined) {
        const oldPhotos = (existing as Record<string, unknown>).photos as Record<string, string> ?? {};
        const mergedNew: Record<string, string> = { ...oldPhotos, ...body.photos };
        filesToDelete.push(...findReplacedSlotUrls(oldPhotos, mergedNew));
    }

    // 2. Gallery: delete local files removed from the list
    if (body.gallery !== undefined) {
        filesToDelete.push(...findRemovedGalleryUrls(existing.gallery, body.gallery));
    }

    // 3. Legacy brideImage / groomImage replacement
    if (body.brideImage !== undefined && body.brideImage !== existing.brideImage) {
        filesToDelete.push(existing.brideImage);
    }
    if (body.groomImage !== undefined && body.groomImage !== existing.groomImage) {
        filesToDelete.push(existing.groomImage);
    }
    // ─────────────────────────────────────────────────────────────────────

    const updated = await prisma.wedding.update({
        where: { id },
        data: {
            ...(body.brideName !== undefined && { brideName: body.brideName }),
            ...(body.brideShort !== undefined && { brideShort: body.brideShort }),
            ...(body.brideImage !== undefined && { brideImage: body.brideImage }),
            ...(body.brideParents !== undefined && { brideParents: body.brideParents }),
            ...(body.groomName !== undefined && { groomName: body.groomName }),
            ...(body.groomShort !== undefined && { groomShort: body.groomShort }),
            ...(body.groomImage !== undefined && { groomImage: body.groomImage }),
            ...(body.groomParents !== undefined && { groomParents: body.groomParents }),
            ...(body.date !== undefined && { date: new Date(body.date) }),
            ...(body.akadTime !== undefined && { akadTime: body.akadTime }),
            ...(body.akadLocation !== undefined && { akadLocation: body.akadLocation }),
            ...(body.akadAddress !== undefined && { akadAddress: body.akadAddress }),
            ...(body.akadMapUrl !== undefined && { akadMapUrl: body.akadMapUrl }),
            ...(body.resepsiTime !== undefined && { resepsiTime: body.resepsiTime }),
            ...(body.resepsiLocation !== undefined && { resepsiLocation: body.resepsiLocation }),
            ...(body.resepsiAddress !== undefined && { resepsiAddress: body.resepsiAddress }),
            ...(body.resepsiMapUrl !== undefined && { resepsiMapUrl: body.resepsiMapUrl }),
            ...(body.gallery !== undefined && { gallery: body.gallery }),
            ...(body.qris !== undefined && { qris: body.qris }),
            ...(body.themeId !== undefined && { themeId: body.themeId }),
            ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
            // photos: merge so partial saves don't erase other slots
            ...(body.photos !== undefined && {
                photos: {
                    ...((existing as Record<string, unknown>).photos as Record<string, string> ?? {}),
                    ...body.photos,
                },
            }),
        },
    });

    // ── Delete orphaned files AFTER successful DB update ──────────────────
    // Fire-and-forget: don't fail the request if file deletion fails
    if (filesToDelete.length > 0) {
        deleteLocalFiles(filesToDelete).catch(() => { });
    }
    // ─────────────────────────────────────────────────────────────────────

    return NextResponse.json({ wedding: updated });
}

// DELETE /api/weddings/[id]  — also cleans up ALL files for this wedding
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const userId = (session.user as any).id;

    const existing = await prisma.wedding.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Collect all local files associated with this wedding before deleting
    const allFiles: string[] = [
        existing.brideImage,
        existing.groomImage,
        ...existing.gallery,
        ...Object.values(
            ((existing as Record<string, unknown>).photos as Record<string, string>) ?? {}
        ),
    ];

    await prisma.wedding.delete({ where: { id } });

    // Clean up all files after DB record is gone
    deleteLocalFiles(allFiles).catch(() => { });

    return NextResponse.json({ success: true });
}

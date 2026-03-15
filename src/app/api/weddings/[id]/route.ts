import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
    deleteLocalFiles,
    findReplacedSlotUrls,
    findRemovedGalleryUrls,
    moveTempToFinal,
    isTempUpload,
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

    // 1. Photo slots: delete local files for replaced OR removed slots
    if (body.photos !== undefined) {
        const oldPhotos = (existing as Record<string, unknown>).photos as Record<string, string> ?? {};
        // Pass body.photos directly (not merged) so deleted keys are detected as removals
        filesToDelete.push(...findReplacedSlotUrls(oldPhotos, body.photos));
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

    // ── Move Temp files to Final destination ──────────────────────────────
    // Replace URL paths in body if they start with /uploads/temp/...
    if (body.photos !== undefined) {
        for (const [key, url] of Object.entries(body.photos)) {
            if (typeof url === 'string' && isTempUpload(url)) {
                body.photos[key] = await moveTempToFinal(url, userId);
            }
        }
    }
    if (body.gallery !== undefined && Array.isArray(body.gallery)) {
        for (let i = 0; i < body.gallery.length; i++) {
            const url = body.gallery[i];
            if (typeof url === 'string' && isTempUpload(url)) {
                body.gallery[i] = await moveTempToFinal(url, userId);
            }
        }
    }
    if (body.brideImage && isTempUpload(body.brideImage)) {
        body.brideImage = await moveTempToFinal(body.brideImage, userId);
    }
    if (body.groomImage && isTempUpload(body.groomImage)) {
        body.groomImage = await moveTempToFinal(body.groomImage, userId);
    }
    if (body.qris && isTempUpload(body.qris)) {
        body.qris = await moveTempToFinal(body.qris, userId);
    }
    // ─────────────────────────────────────────────────────────────────────

    // ── Timeline upsert (replace-all strategy) ───────────────────────────
    if (body.timeline !== undefined && Array.isArray(body.timeline)) {
        await prisma.timelineItem.deleteMany({ where: { weddingId: id } });
        if (body.timeline.length > 0) {
            await prisma.timelineItem.createMany({
                data: body.timeline.map((item: { year: string; title: string; description: string }) => ({
                    year: item.year,
                    title: item.title,
                    description: item.description,
                    weddingId: id,
                })),
            });
        }
    }

    // ── BankAccounts upsert (replace-all strategy) ────────────────────────
    if (body.bankAccounts !== undefined && Array.isArray(body.bankAccounts)) {
        await prisma.bankAccount.deleteMany({ where: { weddingId: id } });
        if (body.bankAccounts.length > 0) {
            await prisma.bankAccount.createMany({
                data: body.bankAccounts.map((acc: { bank: string; number: string; holder: string }) => ({
                    bank: acc.bank,
                    number: acc.number,
                    holder: acc.holder,
                    weddingId: id,
                })),
            });
        }
    }

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
            ...(body.slug !== undefined && { slug: body.slug }),
            ...(body.themeId !== undefined && { themeId: body.themeId }),
            ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
            // photos: merge so partial saves don't erase other slots
            // photos: replace-all (gallery page always sends full state)
            // Merge strategy caused deleted slots to reappear from DB.
            ...(body.photos !== undefined && { photos: body.photos }),
        },
        include: { timeline: true, bankAccounts: true },
    });

    // ── Delete orphaned files AFTER successful DB update ──────────────────
    if (filesToDelete.length > 0) {
        deleteLocalFiles(filesToDelete).catch(() => { });
    }

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

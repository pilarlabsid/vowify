import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
        },
    });

    return NextResponse.json({ wedding: updated });
}

// DELETE /api/weddings/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const userId = (session.user as any).id;

    const existing = await prisma.wedding.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.wedding.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

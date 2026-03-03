import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') return null;
    return session;
}

// GET /api/admin/weddings
export async function GET(req: NextRequest) {
    try {
        const session = await requireAdmin();
        if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const filterPublished = searchParams.get('published'); // 'true' | 'false' | null
        const limit = 20;

        const where: any = {};
        if (search) {
            where.OR = [
                { brideName: { contains: search, mode: 'insensitive' } },
                { groomName: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (filterPublished !== null && filterPublished !== '') {
            where.isPublished = filterPublished === 'true';
        }

        const [weddings, total] = await Promise.all([
            prisma.wedding.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                    _count: { select: { greetings: true, guests: true } },
                },
            }),
            prisma.wedding.count({ where }),
        ]);

        return NextResponse.json({ weddings, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error('[GET /api/admin/weddings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/weddings — toggle publish
export async function PATCH(req: NextRequest) {
    try {
        const session = await requireAdmin();
        if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id, isPublished } = await req.json();
        const updated = await prisma.wedding.update({
            where: { id },
            data: { isPublished },
            select: { id: true, isPublished: true },
        });

        return NextResponse.json({ wedding: updated });
    } catch (err) {
        console.error('[PATCH /api/admin/weddings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/weddings
export async function DELETE(req: NextRequest) {
    try {
        const session = await requireAdmin();
        if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id } = await req.json();
        await prisma.wedding.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/weddings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

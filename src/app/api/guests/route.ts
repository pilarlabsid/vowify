import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/guests?weddingId=xxx
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const weddingId = searchParams.get('weddingId');
        if (!weddingId) return NextResponse.json({ error: 'Missing weddingId' }, { status: 400 });

        const userId = (session.user as any).id;

        // verify ownership
        const wedding = await prisma.wedding.findFirst({ where: { id: weddingId, userId } });
        if (!wedding) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const guests = await (prisma as any).guest.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ guests });
    } catch (err) {
        console.error('[GET /api/guests]', err);
        return NextResponse.json({ error: 'Internal server error', guests: [] }, { status: 500 });
    }
}

// POST /api/guests  — create guest
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { weddingId, name, phone, note } = await req.json();
        if (!weddingId || !name || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const wedding = await prisma.wedding.findFirst({ where: { id: weddingId, userId } });
        if (!wedding) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Normalize phone: remove spaces/dashes, ensure starts with 62
        const normalized = phone.replace(/[\s\-\(\)]/g, '').replace(/^0/, '62').replace(/^\+/, '');

        const guest = await (prisma as any).guest.create({
            data: { weddingId, name, phone: normalized, note: note || null },
        });

        return NextResponse.json({ guest }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/guests]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

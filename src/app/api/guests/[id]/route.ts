import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/guests/[id]  — mark as sent
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await req.json();

        const updated = await (prisma as any).guest.update({
            where: { id },
            data: {
                ...(body.sent !== undefined && { sent: body.sent }),
                ...(body.sent === true && { sentAt: new Date() }),
            },
        });

        return NextResponse.json({ guest: updated });
    } catch (err) {
        console.error('[PATCH /api/guests/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/guests/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await (prisma as any).guest.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/guests/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

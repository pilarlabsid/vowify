import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/users/[id]  - update role or block status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        // Prevent admin from modifying themselves
        if (id === (session.user as any).id) {
            return NextResponse.json({ error: 'Tidak bisa mengubah akun sendiri.' }, { status: 400 });
        }

        const updated = await (prisma as any).user.update({
            where: { id },
            data: {
                ...(body.role !== undefined && { role: body.role }),
                ...(body.isBlocked !== undefined && { isBlocked: body.isBlocked }),
                ...(body.emailVerified !== undefined && {
                    emailVerified: body.emailVerified ? new Date() : null,
                }),
            },
            select: { id: true, name: true, email: true, role: true, isBlocked: true, emailVerified: true },
        });

        return NextResponse.json({ user: updated });
    } catch (err) {
        console.error('[PATCH /api/admin/users/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/users/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        if (id === (session.user as any).id) {
            return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri.' }, { status: 400 });
        }

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/users/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

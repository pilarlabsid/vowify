import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users?page=1&search=
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;

        let where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ];
        }
        if (role && role !== 'all') {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            (prisma as any).user.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, email: true, role: true,
                    isBlocked: true, emailVerified: true, createdAt: true,
                    _count: { select: { weddings: true } },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error('[GET /api/admin/users]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

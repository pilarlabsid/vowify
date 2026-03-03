import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') return null;
    return session;
}

// GET /api/admin/stats — extended with growth data, sent guests, theme popularity
export async function GET() {
    try {
        const session = await requireAdmin();
        if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const now = new Date();
        const startOf30Days = new Date(now);
        startOf30Days.setDate(now.getDate() - 29);
        startOf30Days.setHours(0, 0, 0, 0);

        const [
            totalUsers,
            verifiedUsers,
            blockedUsers,
            totalWeddings,
            publishedWeddings,
            totalGreetings,
            totalGuests,
            sentGuests,
            recentUsers,
            recentActivities,
            themeStats,
            newUsersLast30,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { emailVerified: { not: null } } }),
            (prisma as any).user.count({ where: { isBlocked: true } }),
            prisma.wedding.count(),
            prisma.wedding.count({ where: { isPublished: true } }),
            prisma.greeting.count(),
            (prisma as any).guest.count(),
            (prisma as any).guest.count({ where: { sent: true } }),

            // Recent 8 users
            (prisma as any).user.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, createdAt: true, role: true, emailVerified: true, isBlocked: true },
            }),

            // Recent 5 weddings created
            prisma.wedding.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, groomShort: true, brideShort: true, slug: true,
                    themeId: true, isPublished: true, createdAt: true,
                    user: { select: { name: true } },
                },
            }),

            // Theme popularity
            prisma.wedding.groupBy({
                by: ['themeId'],
                _count: { _all: true },
                orderBy: { _count: { themeId: 'desc' } },
            }),

            // Users created in last 30 days (grouped by day)
            (prisma as any).user.findMany({
                where: { createdAt: { gte: startOf30Days } },
                select: { createdAt: true },
                orderBy: { createdAt: 'asc' },
            }),
        ]);

        // Build daily counts for last 30 days
        const growthMap: Record<string, number> = {};
        for (let i = 0; i < 30; i++) {
            const d = new Date(startOf30Days);
            d.setDate(startOf30Days.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            growthMap[key] = 0;
        }
        for (const u of newUsersLast30) {
            const key = new Date(u.createdAt).toISOString().slice(0, 10);
            if (growthMap[key] !== undefined) growthMap[key]++;
        }
        const growthData = Object.entries(growthMap).map(([date, count]) => ({ date, count }));

        return NextResponse.json({
            stats: {
                totalUsers, verifiedUsers, blockedUsers,
                totalWeddings, publishedWeddings,
                totalGreetings, totalGuests, sentGuests,
            },
            recentUsers,
            recentActivities,
            themeStats: themeStats.map((t: any) => ({ theme: t.themeId, count: t._count._all })),
            growthData,
        });
    } catch (err) {
        console.error('[GET /api/admin/stats]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

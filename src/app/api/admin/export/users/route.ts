import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function escape(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function toCSV(rows: string[][]): string {
    return rows.map(r => r.map(escape).join(',')).join('\n');
}

// GET /api/admin/export/users
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await (prisma as any).user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, name: true, email: true, role: true,
                isBlocked: true, emailVerified: true, createdAt: true,
                _count: { select: { weddings: true } },
            },
        });

        const header = ['ID', 'Nama', 'Email', 'Role', 'Diblokir', 'Terverifikasi', 'Tanggal Daftar', 'Jumlah Undangan'];
        const rows = users.map((u: any) => [
            u.id,
            u.name || '',
            u.email,
            u.role,
            u.isBlocked ? 'Ya' : 'Tidak',
            u.emailVerified ? 'Ya' : 'Tidak',
            new Date(u.createdAt).toLocaleDateString('id-ID'),
            u._count.weddings,
        ]);

        const csv = toCSV([header, ...rows]);

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="vowify-users-${new Date().toISOString().slice(0, 10)}.csv"`,
            },
        });
    } catch (err) {
        console.error('[GET /api/admin/export/users]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

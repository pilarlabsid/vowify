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

// GET /api/admin/export/weddings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const weddings = await prisma.wedding.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                _count: { select: { greetings: true, guests: true } },
            },
        });

        const header = [
            'ID', 'Slug', 'Pengantin', 'Tema', 'Tanggal Akad',
            'Dipublikasi', 'Tamu', 'Ucapan',
            'Pemilik', 'Email Pemilik', 'Dibuat'
        ];

        const rows = weddings.map((w: any) => [
            w.id,
            w.slug,
            `${w.groomShort} & ${w.brideShort}`,
            w.themeId,
            new Date(w.date).toLocaleDateString('id-ID'),
            w.isPublished ? 'Ya' : 'Tidak',
            w._count.guests,
            w._count.greetings,
            w.user?.name || '-',
            w.user?.email || '-',
            new Date(w.createdAt).toLocaleDateString('id-ID'),
        ]);

        const csv = toCSV([header, ...rows]);

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="vowify-weddings-${new Date().toISOString().slice(0, 10)}.csv"`,
            },
        });
    } catch (err) {
        console.error('[GET /api/admin/export/weddings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

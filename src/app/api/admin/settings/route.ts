import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') return null;
    return session;
}

const SETTING_KEYS = ['default_wa_template', 'max_weddings_per_user', 'maintenance_mode', 'announcement'];

// GET /api/admin/settings — fetch all settings
export async function GET() {
    try {
        const session = await requireAdmin();
        if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const rows = await (prisma as any).setting.findMany({
            where: { key: { in: SETTING_KEYS } },
        });

        const settings: Record<string, string> = {};
        for (const row of rows) settings[row.key] = row.value;

        return NextResponse.json({ settings });
    } catch (err) {
        console.error('[GET /api/admin/settings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/settings — upsert one or multiple settings
export async function PUT(req: NextRequest) {
    try {
        const session = await requireAdmin();
        if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json(); // { key: string, value: string }[]  OR  { key, value }
        const items: { key: string; value: string }[] = Array.isArray(body) ? body : [body];

        for (const { key, value } of items) {
            if (!SETTING_KEYS.includes(key)) continue;
            await (prisma as any).setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[PUT /api/admin/settings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

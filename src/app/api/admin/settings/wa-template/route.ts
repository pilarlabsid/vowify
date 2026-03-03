import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DEFAULT_WA_KEY = 'default_wa_template';

// GET /api/admin/settings/wa-template
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const setting = await (prisma as any).setting.findUnique({
            where: { key: DEFAULT_WA_KEY },
        });

        return NextResponse.json({ value: setting?.value ?? null });
    } catch (err) {
        console.error('[GET /api/admin/settings/wa-template]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/settings/wa-template
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { value } = await req.json();
        if (typeof value !== 'string' || !value.trim()) {
            return NextResponse.json({ error: 'Value tidak boleh kosong.' }, { status: 400 });
        }

        await (prisma as any).setting.upsert({
            where: { key: DEFAULT_WA_KEY },
            update: { value },
            create: { key: DEFAULT_WA_KEY, value },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[PUT /api/admin/settings/wa-template]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DEFAULT_WA_KEY = 'default_wa_template';

// GET /api/user/wa-template — priority: user custom → admin global → null
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await (prisma as any).user.findUnique({
            where: { id: (session.user as any).id },
            select: { waTemplate: true },
        });

        // User has a custom template → return it
        if (user?.waTemplate) {
            return NextResponse.json({ waTemplate: user.waTemplate, source: 'user' });
        }

        // Fallback to admin-set global default
        const globalSetting = await (prisma as any).setting.findUnique({
            where: { key: DEFAULT_WA_KEY },
        });

        return NextResponse.json({
            waTemplate: globalSetting?.value ?? null,
            source: globalSetting?.value ? 'global' : 'hardcoded',
        });
    } catch (err) {
        console.error('[GET /api/user/wa-template]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/user/wa-template — save custom template for this user
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { waTemplate } = await req.json();

        await (prisma as any).user.update({
            where: { id: (session.user as any).id },
            data: { waTemplate: waTemplate ?? null },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[PUT /api/user/wa-template]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/app-config — public endpoint for frontend to check maintenance/announcement
export async function GET() {
    try {
        const rows = await (prisma as any).setting.findMany({
            where: { key: { in: ['maintenance_mode', 'announcement'] } },
        });

        const cfg: Record<string, string> = {};
        for (const r of rows) cfg[r.key] = r.value;

        return NextResponse.json({
            maintenanceMode: cfg['maintenance_mode'] === 'true',
            announcement: cfg['announcement'] || null,
        });
    } catch {
        return NextResponse.json({ maintenanceMode: false, announcement: null });
    }
}

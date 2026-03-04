import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
    getUserStorageBytes,
    formatBytes,
    QUOTA_PER_USER_BYTES,
} from '@/lib/storage';

/**
 * GET /api/storage/info
 * Returns the current user's storage usage and quota.
 */
export async function GET(_req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id as string;
    const usedBytes = await getUserStorageBytes(userId);
    const quotaBytes = QUOTA_PER_USER_BYTES;
    const percentUsed = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));

    return NextResponse.json({
        usedBytes,
        quotaBytes,
        percentUsed,
        used: formatBytes(usedBytes),
        quota: formatBytes(quotaBytes),
        remaining: formatBytes(Math.max(0, quotaBytes - usedBytes)),
    });
}

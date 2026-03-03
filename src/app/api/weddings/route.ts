import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/weddings — get all weddings for the logged-in user
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const weddings = await prisma.wedding.findMany({
        where: { userId },
        include: {
            timeline: true,
            bankAccounts: true,
            greetings: { orderBy: { createdAt: 'desc' }, take: 50 },
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ weddings });
}

// POST /api/weddings — Create a new wedding
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const body = await req.json();

    try {
        const wedding = await prisma.wedding.create({
            data: {
                userId,
                slug: body.slug,
                brideName: body.brideName,
                brideShort: body.brideShort,
                brideImage: body.brideImage || '/images/bride_groom.png',
                brideParents: body.brideParents,
                groomName: body.groomName,
                groomShort: body.groomShort,
                groomImage: body.groomImage || '/images/bride_groom.png',
                groomParents: body.groomParents,
                date: new Date(body.date),
                akadTime: body.akadTime,
                akadLocation: body.akadLocation,
                akadAddress: body.akadAddress || '',
                akadMapUrl: body.akadMapUrl || '#',
                resepsiTime: body.resepsiTime,
                resepsiLocation: body.resepsiLocation,
                resepsiAddress: body.resepsiAddress || '',
                resepsiMapUrl: body.resepsiMapUrl || '#',
                gallery: body.gallery || [],
                qris: body.qris || '/images/qris_placeholder.png',
                themeId: body.themeId || 'javanese',
            },
        });

        return NextResponse.json({ wedding }, { status: 201 });
    } catch (err: any) {
        if (err.code === 'P2002') {
            return NextResponse.json({ error: 'Slug sudah dipakai, gunakan yang lain.' }, { status: 409 });
        }
        console.error('[POST /api/weddings]', err);
        return NextResponse.json({ error: 'Gagal membuat undangan.' }, { status: 500 });
    }
}

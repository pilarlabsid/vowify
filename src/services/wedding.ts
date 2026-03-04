import { prisma } from '@/lib/prisma';
import { WeddingData, GuestGreeting } from '@/lib/types';

// Transform Prisma row to WeddingData shape
function mapToWeddingData(w: any): WeddingData {
    return {
        id: w.id,
        slug: w.slug,
        brideName: w.brideName,
        brideShort: w.brideShort,
        brideImage: w.brideImage,
        brideParents: w.brideParents,
        groomName: w.groomName,
        groomShort: w.groomShort,
        groomImage: w.groomImage,
        groomParents: w.groomParents,
        date: w.date.toISOString(),
        akad: {
            time: w.akadTime,
            location: w.akadLocation,
            address: w.akadAddress,
            mapUrl: w.akadMapUrl,
        },
        resepsi: {
            time: w.resepsiTime,
            location: w.resepsiLocation,
            address: w.resepsiAddress,
            mapUrl: w.resepsiMapUrl,
        },
        gallery: w.gallery,
        photos: (w.photos as Record<string, string>) ?? {},
        timeline: (w.timeline ?? []).map((t: any) => ({
            year: t.year,
            title: t.title,
            description: t.description,
        })),
        bankAccounts: (w.bankAccounts ?? []).map((b: any) => ({
            bank: b.bank,
            number: b.number,
            holder: b.holder,
        })),
        qris: w.qris,
        themeId: w.themeId,
    };
}

export async function getWeddingBySlug(slug: string): Promise<WeddingData | null> {
    try {
        const wedding = await prisma.wedding.findUnique({
            where: { slug },
            include: {
                timeline: true,
                bankAccounts: true,
            },
        });
        if (!wedding) return null;
        return mapToWeddingData(wedding);
    } catch (err) {
        console.error('[getWeddingBySlug] DB error:', err);
        return null;
    }
}

export async function getGreetings(weddingId: string): Promise<GuestGreeting[]> {
    try {
        const greetings = await prisma.greeting.findMany({
            where: { weddingId },
            orderBy: { createdAt: 'desc' },
        });
        return greetings.map((g: any) => ({
            id: g.id,
            weddingId: g.weddingId,
            name: g.name,
            status: g.status,
            message: g.message,
            createdAt: g.createdAt.toISOString(),
        }));
    } catch (err) {
        console.error('[getGreetings] DB error:', err);
        return [];
    }
}

export async function createGreeting(data: {
    weddingId: string;
    name: string;
    status: string;
    message: string;
}): Promise<GuestGreeting | null> {
    try {
        const greeting = await prisma.greeting.create({ data });
        return {
            id: greeting.id,
            weddingId: greeting.weddingId,
            name: greeting.name,
            status: greeting.status,
            message: greeting.message,
            createdAt: greeting.createdAt.toISOString(),
        };
    } catch (err) {
        console.error('[createGreeting] DB error:', err);
        return null;
    }
}

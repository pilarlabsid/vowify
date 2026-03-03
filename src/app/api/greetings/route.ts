import { NextRequest, NextResponse } from 'next/server';
import { createGreeting } from '@/services/wedding';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { weddingId, name, status, message } = body;

        if (!weddingId || !name || !status || !message) {
            return NextResponse.json({ error: 'Semua field harus diisi.' }, { status: 400 });
        }

        const greeting = await createGreeting({ weddingId, name, status, message });

        if (!greeting) {
            return NextResponse.json({ error: 'Gagal menyimpan ucapan.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, greeting }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/greetings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get('weddingId');

    if (!weddingId) {
        return NextResponse.json({ error: 'weddingId diperlukan.' }, { status: 400 });
    }

    const { getGreetings } = await import('@/services/wedding');
    const greetings = await getGreetings(weddingId);
    return NextResponse.json({ greetings });
}

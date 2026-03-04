import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import {
    UPLOAD_DIR,
    QUOTA_PER_USER_BYTES,
    getUserStorageBytes,
    formatBytes,
} from '@/lib/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'Tidak ada file yang diupload.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Ukuran file terlalu besar. Maksimal 5MB.' }, { status: 400 });
    }

    // ── Kuota per user ──────────────────────────────────────────────────────
    const usedBytes = await getUserStorageBytes(userId);
    if (usedBytes + file.size > QUOTA_PER_USER_BYTES) {
        const used = formatBytes(usedBytes);
        const quota = formatBytes(QUOTA_PER_USER_BYTES);
        return NextResponse.json(
            { error: `Penyimpanan Anda hampir penuh (${used} / ${quota}). Hapus foto yang tidak digunakan terlebih dahulu.` },
            { status: 413 }
        );
    }
    // ────────────────────────────────────────────────────────────────────────

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    let finalExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    let outputBuffer: any = buffer;

    // ── Kompresi Otomatis (kecuali GIF untuk menjaga animasi) ───────────────
    if (file.type !== 'image/gif') {
        try {
            outputBuffer = await sharp(buffer as any)
                .resize({ width: 1920, withoutEnlargement: true }) // Mencegah foto kecil ditarik pecah
                .webp({ quality: 80 }) // Konversi ke format ringan
                .toBuffer();
            finalExt = 'webp'; // Ubah ekstensi
        } catch (error) {
            console.error('Gagal mengkompres resolusi gambar, menggunakan aslinya:', error);
            // Kalau gagal, kita tetap menggunakan aslinya
        }
    }
    // ────────────────────────────────────────────────────────────────────────

    // Nama file unik per user
    const timestamp = Date.now();
    const fileName = `${userId}-${timestamp}.${finalExt}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, fileName), outputBuffer);

    const publicUrl = `/uploads/${fileName}`;
    // Info sisa penyimpanan kita hitung dari file SESUDAH dikompres!
    const remaining = formatBytes(QUOTA_PER_USER_BYTES - usedBytes - outputBuffer.byteLength);

    return NextResponse.json({ url: publicUrl, remaining }, { status: 200 });
}

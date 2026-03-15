import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import {
    getTempUploadDir,
    QUOTA_PER_USER_BYTES,
    getUserStorageBytes,
    formatBytes,
    deleteLocalFile,
    isLocalUpload,
} from '@/lib/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
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
        return NextResponse.json({ error: 'Ukuran file terlalu besar. Maksimal 5 MB per foto.' }, { status: 400 });
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    let finalExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    let outputBuffer: any = buffer;

    // ── Kompresi Otomatis (kecuali GIF untuk menjaga animasi) ───────────────
    if (file.type !== 'image/gif') {
        try {
            outputBuffer = await sharp(buffer as any)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            finalExt = 'webp';
        } catch (error) {
            console.error('Gagal mengkompres resolusi gambar, menggunakan aslinya:', error);
        }
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}.${finalExt}`;
    // Simpan ke folder TEMP terlebih dahulu
    const tempDir = getTempUploadDir(userId);

    await mkdir(tempDir, { recursive: true });
    await writeFile(path.join(tempDir, fileName), outputBuffer);

    const publicTempUrl = `/uploads/temp/${userId}/${fileName}`;
    const remaining = formatBytes(QUOTA_PER_USER_BYTES - usedBytes - outputBuffer.byteLength);

    return NextResponse.json({ url: publicTempUrl, remaining }, { status: 200 });
}

/**
 * DELETE /api/upload?url=/uploads/{userId}/{file}
 * Deletes a local upload file. Only the file owner can delete their own files.
 */
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const url = req.nextUrl.searchParams.get('url');

    if (!url || !isLocalUpload(url)) {
        return NextResponse.json({ error: 'URL tidak valid.' }, { status: 400 });
    }

    // Security: ensure the file belongs to this user (/uploads/final/{userId}/... or /uploads/temp/{userId}/...)
    const parts = url.replace(/^\/uploads\//, '').split('/');
    // parts[0] is either 'temp', 'final', or legacy 'userId'
    let ownerId = parts[0];
    if (parts[0] === 'temp' || parts[0] === 'final') {
        ownerId = parts[1];
    }

    if (ownerId !== userId) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    await deleteLocalFile(url);
    return NextResponse.json({ ok: true });
}

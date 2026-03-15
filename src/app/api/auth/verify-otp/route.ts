import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOtp, sendOtpEmail, sendWelcomeEmail } from '@/lib/email';

// POST /api/auth/verify-otp   — verify OTP and activate account
export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();
        if (!email || !otp) {
            return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
        }

        const emailLower = email.toLowerCase().trim();

        const record = await (prisma as any).emailOtp.findFirst({
            where: {
                email: emailLower,
                otp,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!record) {
            return NextResponse.json({ error: 'Kode OTP tidak valid atau sudah kadaluarsa.' }, { status: 400 });
        }

        // Mark OTP as used
        await (prisma as any).emailOtp.update({
            where: { id: record.id },
            data: { used: true },
        });

        // Activate user account
        const user = await prisma.user.update({
            where: { email: emailLower },
            data: { emailVerified: new Date() },
        });

        // Send Welcome Greeting
        await sendWelcomeEmail(emailLower, user.name || 'User');

        return NextResponse.json({ success: true, message: 'Email berhasil diverifikasi!' });
    } catch (err) {
        console.error('[POST /api/auth/verify-otp]', err);
        return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
    }
}

// POST /api/auth/resend-otp  — resend OTP
export async function PUT(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: 'Email diperlukan.' }, { status: 400 });

        const emailLower = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({ where: { email: emailLower } });
        if (!user) return NextResponse.json({ error: 'Akun tidak ditemukan.' }, { status: 404 });
        if (user.emailVerified) return NextResponse.json({ error: 'Email sudah terverifikasi.' }, { status: 400 });

        // Throttle: check if a recent OTP was sent (within 1 min)
        const recent = await (prisma as any).emailOtp.findFirst({
            where: {
                email: emailLower,
                used: false,
                createdAt: { gt: new Date(Date.now() - 60 * 1000) },
            },
        });
        if (recent) {
            return NextResponse.json({ error: 'Tunggu 1 menit sebelum mengirim ulang.' }, { status: 429 });
        }

        // Invalidate old OTPs
        await (prisma as any).emailOtp.updateMany({
            where: { email: emailLower, used: false },
            data: { used: true },
        });

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await (prisma as any).emailOtp.create({ data: { email: emailLower, otp, expiresAt } });
        await sendOtpEmail(emailLower, otp, user.name || 'Pengguna');

        return NextResponse.json({ success: true, message: 'OTP baru telah dikirim.' });
    } catch (err) {
        console.error('[PUT /api/auth/verify-otp]', err);
        return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
    }
}

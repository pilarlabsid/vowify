import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateOtp, sendOtpEmail } from '@/lib/email';

// POST /api/auth/register
// Step 1: Validate + save pending user + send OTP
export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 });
        }

        const emailLower = email.toLowerCase().trim();

        // Check if already registered and verified
        const existing = await prisma.user.findUnique({ where: { email: emailLower } });
        if (existing && existing.emailVerified) {
            return NextResponse.json({ error: 'Email sudah terdaftar dan diverifikasi.' }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);

        // Upsert user (create or update pending)
        await prisma.user.upsert({
            where: { email: emailLower },
            update: { name, password: hashed, emailVerified: null },
            create: { name, email: emailLower, password: hashed },
        });

        // Invalidate old OTPs for this email
        await (prisma as any).emailOtp.updateMany({
            where: { email: emailLower, used: false },
            data: { used: true },
        });

        // Generate new OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await (prisma as any).emailOtp.create({
            data: { email: emailLower, otp, expiresAt },
        });

        // Send email
        await sendOtpEmail(emailLower, otp, name);

        return NextResponse.json(
            { success: true, message: 'Kode OTP telah dikirim ke email Anda.' },
            { status: 200 }
        );
    } catch (err: any) {
        console.error('[POST /api/auth/register]', err);
        // Detect SMTP errors specifically
        if (err?.code === 'EAUTH' || err?.responseCode === 535) {
            return NextResponse.json({ error: 'Konfigurasi email server bermasalah. Hubungi admin.' }, { status: 500 });
        }
        return NextResponse.json({ error: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 });
    }
}

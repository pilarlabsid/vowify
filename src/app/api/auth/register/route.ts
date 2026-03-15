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
        try {
            await prisma.emailOtp.updateMany({
                where: { email: emailLower, used: false },
                data: { used: true },
            });
        } catch (otpErr) {
            console.error('[Register] Failed to invalidate old OTPs:', otpErr);
            // Non-critical, continue
        }

        // Generate new OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        try {
            await prisma.emailOtp.create({
                data: { email: emailLower, otp, expiresAt },
            });
        } catch (otpCreateErr) {
            console.error('[Register] Failed to create OTP record:', otpCreateErr);
            throw new Error('Gagal membuat kode verifikasi. Silakan coba lagi.');
        }

        // Send email
        try {
            await sendOtpEmail(emailLower, otp, name);
        } catch (emailErr: any) {
            console.error('[Register] Failed to send OTP email:', emailErr);
            // Handle specific SMTP errors
            if (emailErr?.code === 'EAUTH' || emailErr?.responseCode === 535) {
                throw new Error('AUTH_EMAIL_ERROR');
            }
            throw new Error('Gagal mengirim email verifikasi. Coba lagi.');
        }

        return NextResponse.json(
            { success: true, message: 'Kode OTP telah dikirim ke email Anda.' },
            { status: 200 }
        );
    } catch (err: any) {
        console.error('[POST /api/auth/register] Global Error:', err);
        
        const message = err.message || 'Terjadi kesalahan. Coba lagi.';
        
        if (message === 'AUTH_EMAIL_ERROR') {
            return NextResponse.json({ error: 'Konfigurasi email server bermasalah. Hubungi admin.' }, { status: 500 });
        }
        
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

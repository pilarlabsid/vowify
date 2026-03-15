import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOtp, sendResetPasswordEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email wajib diisi' }, { status: 100 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // we return success anyway to prevent email enumeration, 
            // but in a specialized flow like this, sometimes we tell them.
            // Let's be helpful for now since it's a small app.
            return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 404 });
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP
        await prisma.emailOtp.create({
            data: {
                email,
                otp,
                expiresAt,
            }
        });

        // Send Email
        await sendResetPasswordEmail(email, otp, user.name || 'User');

        return NextResponse.json({ message: 'OTP telah dikirim ke email Anda' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}

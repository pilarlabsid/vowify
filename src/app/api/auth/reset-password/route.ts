import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, otp, password } = await req.json();

        if (!email || !otp || !password) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
        }

        // Verify OTP
        const otpRecord = await prisma.emailOtp.findFirst({
            where: {
                email,
                otp,
                used: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRecord) {
            return NextResponse.json({ error: 'OTP tidak valid atau sudah kadaluwarsa' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password and mark OTP as used
        await prisma.$transaction([
            prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            }),
            prisma.emailOtp.update({
                where: { id: otpRecord.id },
                data: { used: true }
            })
        ]);

        return NextResponse.json({ message: 'Password berhasil diperbarui' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}

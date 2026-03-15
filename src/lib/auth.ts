import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { sendWelcomeEmail } from './email';

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    session: { strategy: 'jwt' as const },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user) throw new Error('USER_NOT_FOUND');
                if (!user.password) throw new Error('NO_PASSWORD_SET');

                const valid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!valid) throw new Error('INVALID_PASSWORD');

                if (!user.emailVerified) throw new Error('EMAIL_NOT_VERIFIED');
                if ((user as any).isBlocked) throw new Error('ACCOUNT_BLOCKED');

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: (user as any).role ?? 'user',
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account?.provider === 'google' && user?.email) {
                // Pastikan email ditandai verified jika login via Google
                await prisma.user.update({
                    where: { email: user.email },
                    data: { emailVerified: new Date() }
                }).catch(() => {
                    // Abaikan jika user belum ada (akan dibuat otomatis oleh adapter)
                });
            }
            return true;
        },
        async jwt({ token, user, account }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                // Check if user still exists and is not blocked
                const user = await prisma.user.findUnique({
                    where: { id: token.id },
                    select: { id: true, isBlocked: true }
                });

                if (!user || user.isBlocked) {
                    return {} as any; // Return empty object instead of null to prevent CLIENT_FETCH_ERROR
                }

                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.provider = token.provider as string;
            }
            return session;
        },
    },
    events: {
        async createUser({ user }: any) {
            if (user.email) {
                await sendWelcomeEmail(user.email, user.name || 'User');
            }
        }
    }
};

export default NextAuth(authOptions);

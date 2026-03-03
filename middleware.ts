import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
    const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isLandingPage = pathname === '/';

    // ── Not logged in ──────────────────────────────────────────
    if (!token) {
        if (isAdminRoute || isDashboardRoute) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    const role = (token as any).role ?? 'user';
    const isAdmin = role === 'admin';

    // ── Already logged in: redirect away from auth pages & landing ──
    if (isAuthRoute || isLandingPage) {
        return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/dashboard', req.url));
    }

    // ── Admin trying to access /dashboard → redirect to /admin ─
    if (isDashboardRoute && isAdmin) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    // ── User trying to access /admin → redirect to /dashboard ──
    if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Root landing page
        '/',
        // Auth pages
        '/login',
        '/register',
        // Dashboard — exact + sub-paths
        '/dashboard',
        '/dashboard/:path*',
        // Admin — exact + sub-paths
        '/admin',
        '/admin/:path*',
    ],
};

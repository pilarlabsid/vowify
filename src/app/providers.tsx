'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function AuthSync() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            const userData = {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                provider: (session.user as any).provider
            };
            localStorage.setItem('vowify_last_success_login', JSON.stringify(userData));
        }
    }, [session]);

    return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthSync />
            {children}
        </SessionProvider>
    );
}

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface Wedding {
    id: string;
    slug: string;
    brideName: string;
    brideShort: string;
    groomName: string;
    groomShort: string;
    date: string;
    themeId: string;
    isPublished: boolean;
    akadLocation: string;
    resepsiLocation: string;
    greetings: any[];
    bankAccounts: any[];
    timeline: any[];
}

interface DashboardContextType {
    weddings: Wedding[];
    selectedWedding: Wedding | null;
    setSelectedWedding: (w: Wedding | null) => void;
    loading: boolean;
    fetchWeddings: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

// This provider is only mounted AFTER DashboardAuthGuard confirms the user
// is authenticated, so we never need to redirect from here.
export function DashboardProvider({ children }: { children: ReactNode }) {
    const { status } = useSession();

    const [weddings, setWeddings] = useState<Wedding[]>([]);
    const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWeddings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/weddings');
            const data = await res.json();
            setWeddings(data.weddings || []);

            if (data.weddings && data.weddings.length > 0) {
                setWeddings(currentWeddings => {
                    setSelectedWedding(prev => {
                        if (prev) {
                            const updated = data.weddings.find((w: Wedding) => w.id === prev.id);
                            return updated || data.weddings[0];
                        }
                        return data.weddings[0];
                    });
                    return data.weddings;
                });
            } else {
                setSelectedWedding(null);
            }
        } catch (err) {
            console.error('Failed to fetch weddings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated') fetchWeddings();
    }, [status, fetchWeddings]);

    return (
        <DashboardContext.Provider value={{ weddings, selectedWedding, setSelectedWedding, loading, fetchWeddings }}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
    return ctx;
};

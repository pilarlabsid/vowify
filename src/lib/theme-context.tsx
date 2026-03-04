'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'vowify-theme';

/** Read initial theme from storage or system preference */
function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Apply theme to <html> element */
function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

/** Standalone theme toggle button – no provider needed */
export function ThemeToggle({ id }: { id?: string }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initial = getInitialTheme();
        setTheme(initial);
        applyTheme(initial);
        setMounted(true);

        // Listen for changes from other tabs / components
        const handler = () => {
            const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            setTheme(current);
        };
        window.addEventListener('vowify-theme-change', handler);
        return () => window.removeEventListener('vowify-theme-change', handler);
    }, []);

    const toggle = () => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
        // Notify other ThemeToggle instances
        window.dispatchEvent(new Event('vowify-theme-change'));
    };

    const isDark = theme === 'dark';

    // Prevent hydration mismatch — render a placeholder until mounted
    if (!mounted) {
        return (
            <div className="w-14 h-7 rounded-full border" style={{
                background: 'var(--ui-bg-hover)',
                borderColor: 'var(--ui-border)',
            }} />
        );
    }

    return (
        <button
            onClick={toggle}
            id={id}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/40 shrink-0"
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #1a1914 0%, #2c2920 100%)'
                    : 'linear-gradient(135deg, #f8f7f4 0%, #ede9e3 100%)',
                borderColor: isDark ? '#2c2920' : '#d1ccc4',
            }}
        >
            <span
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 text-primary"
                style={{
                    transform: isDark ? 'translateX(28px)' : 'translateX(0)',
                    background: '#C6A75E',
                }}
            >
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    );
}

/** Hook to read current theme – also works standalone without provider */
export function useThemeValue() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains('dark'));

        const handler = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        window.addEventListener('vowify-theme-change', handler);
        // Also watch class mutations
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => {
            window.removeEventListener('vowify-theme-change', handler);
            observer.disconnect();
        };
    }, []);

    return { isDark, mounted };
}

/** Script to inject before page load to prevent flash of wrong theme */
export function ThemeScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
(function() {
  try {
    var saved = localStorage.getItem('vowify-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`,
            }}
        />
    );
}

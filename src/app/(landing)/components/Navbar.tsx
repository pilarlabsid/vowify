"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Force scroll to top on mount (load/reload)
    window.scrollTo(0, 0);

    // Optional: Disable browser's automatic scroll restoration to ensure it always starts at top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Restore default behavior on unmount if needed
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled || menuOpen
          ? "py-2 bg-[rgba(251,248,243,0.95)] backdrop-blur-xl border-b border-[var(--lp-gold)]/10 shadow-sm"
          : "py-4 bg-transparent border-b border-transparent shadow-none"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span
            className="text-2xl font-script"
            style={{ color: "var(--lp-gold)" }}
          >
            Vowify.id
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[
            ["Keunggulan", "#keunggulan"],
            ["Template", "#template"],
            ["Cara Kerja", "#cara-kerja"],
            ["Harga", "#harga"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="transition-colors"
              style={{ color: "var(--lp-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--lp-gold)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--lp-text-muted)")
              }
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-24 h-10 rounded-full animate-pulse" style={{ background: "var(--lp-gold-dim)" }} />
          ) : session ? (
            <Link
              href={(session.user as any)?.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-sm font-bold px-6 py-2.5 rounded-full transition-all"
              style={{
                background: "var(--lp-gold)",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--lp-gold-light)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--lp-gold)";
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-full transition-all"
                style={{ color: "var(--lp-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--lp-gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-muted)")
                }
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                style={{
                  background: "var(--lp-gold)",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--lp-gold-light)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--lp-gold)";
                }}
              >
                Buat Undangan
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: "var(--lp-gold)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden relative"
          >
            <div
              className="px-6 pb-6 pt-4 flex flex-col gap-4"
              style={{ borderTop: "1px solid var(--lp-border-subtle)" }}
            >
              {[
                ["Keunggulan", "#keunggulan"],
                ["Template", "#template"],
                ["Cara Kerja", "#cara-kerja"],
                ["Harga", "#harga"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--lp-text-muted)" }}
                >
                  {label}
                </a>
              ))}
              {status === "loading" ? null : session ? (
                <Link
                  href={(session.user as any)?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="text-center text-sm font-bold px-5 py-3 rounded-full mt-2 transition-transform active:scale-95"
                  style={{ background: "var(--lp-gold)", color: "#FFFFFF" }}
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link
                    href="/login"
                    className="text-center text-sm font-bold px-5 py-3 rounded-full border transition-transform active:scale-95"
                    style={{ borderColor: "var(--lp-gold)", color: "var(--lp-gold)" }}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="text-center text-sm font-bold px-5 py-3 rounded-full transition-transform active:scale-95"
                    style={{ background: "var(--lp-gold)", color: "#FFFFFF" }}
                  >
                    Buat Undangan Sekarang
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

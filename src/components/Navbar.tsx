"use client";

import { useState, useEffect } from "react";
import { Menu, X, Target, Lock, Unlock, Loader2 } from "lucide-react";
import { roadmap } from "@/data/siteData";
import type { User } from "@supabase/supabase-js";

type Props = {
  isOwner: boolean;
  user: User | null;
  saving: boolean;
  onLoginClick: () => void;
  onSignOut: () => void;
};

export default function Navbar({ isOwner, user, saving, onLoginClick, onSignOut }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <Target className="w-5 h-5 text-brand-400 group-hover:text-brand-300 transition-colors" />
            <span className="font-semibold text-sm tracking-wide">
              SA <span className="text-brand-400">Roadmap</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            <a
              href="#dashboard"
              className="px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
            >
              Dashboard
            </a>
            {roadmap.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
              >
                P{p.phase}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Saving indicator */}
            {saving && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving
              </span>
            )}

            {/* Auth button */}
            {isOwner ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 transition-all"
                title={`Signed in as ${user?.email}`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Owner</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all"
                title="Owner login"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-gray-950/95 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="px-6 py-4 space-y-1">
            <a
              href="#dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
            >
              Dashboard
            </a>
            {roadmap.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
              >
                Phase {p.phase}: {p.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

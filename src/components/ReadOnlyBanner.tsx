"use client";

import { Eye } from "lucide-react";

export default function ReadOnlyBanner() {
  return (
    <div className="bg-brand-950/60 border-b border-brand-500/10">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2">
        <Eye className="w-3.5 h-3.5 text-brand-400" />
        <span className="text-xs text-gray-400">
          You&apos;re viewing this roadmap in <span className="text-brand-300 font-medium">read-only</span> mode
        </span>
      </div>
    </div>
  );
}

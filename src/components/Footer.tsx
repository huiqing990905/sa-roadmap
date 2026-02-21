import { profile } from "@/data/siteData";
import { Target, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-400" />
          <span className="text-sm text-gray-400">
            <span className="text-white font-medium">{profile.name}</span> &middot; SA Roadmap
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={profile.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-400 transition-colors"
          >
            Portfolio
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-gray-600" aria-hidden="true">&middot;</span>
          <span className="text-xs text-gray-600">
            Progress synced via Supabase
          </span>
        </div>
      </div>
    </footer>
  );
}

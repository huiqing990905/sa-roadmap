import Image from "next/image";
import { profile, getTotalItems } from "@/data/siteData";
import { ArrowDown, ExternalLink } from "lucide-react";

export default function Hero() {
  const totalItems = getTotalItems();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[128px] animate-pulse-slow [animation-delay:2s]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Avatar */}
          <div className="shrink-0 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-500 via-purple-500 to-cyan-500 opacity-60 blur-md" />
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-300 mb-5 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              {totalItems} tasks &middot; 9 phases &middot; 1 goal
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 animate-slide-up">
              <span className="text-white">{profile.name}</span>
            </h1>

            <p className="text-xl md:text-2xl gradient-text font-semibold mb-3 animate-slide-up [animation-delay:0.1s] opacity-0">
              {profile.tagline}
            </p>

            <p className="text-sm text-gray-500 mb-6 animate-slide-up [animation-delay:0.2s] opacity-0">
              Started {profile.startDate} &middot; Tracking every step of the journey.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 animate-slide-up [animation-delay:0.3s] opacity-0">
              <a
                href="#dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25"
              >
                View Progress
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass-hover text-sm font-medium text-gray-300"
              >
                My Portfolio
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Phase } from "@/data/siteData";
import {
  Layers,
  Cloud,
  Boxes,
  Database,
  Shield,
  Container,
  Presentation,
  Award,
  Rocket,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Square,
  CheckSquare,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  cloud: Cloud,
  boxes: Boxes,
  database: Database,
  shield: Shield,
  container: Container,
  presentation: Presentation,
  award: Award,
  rocket: Rocket,
};

const colorMap: Record<string, { badge: string; accent: string; border: string; glow: string; bar: string }> = {
  emerald: { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", accent: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/5", bar: "from-emerald-500 to-emerald-400" },
  blue: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/20", accent: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/5", bar: "from-blue-500 to-blue-400" },
  violet: { badge: "bg-violet-500/15 text-violet-400 border-violet-500/20", accent: "text-violet-400", border: "border-violet-500/20", glow: "shadow-violet-500/5", bar: "from-violet-500 to-violet-400" },
  amber: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/20", accent: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/5", bar: "from-amber-500 to-amber-400" },
  red: { badge: "bg-red-500/15 text-red-400 border-red-500/20", accent: "text-red-400", border: "border-red-500/20", glow: "shadow-red-500/5", bar: "from-red-500 to-red-400" },
  cyan: { badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20", accent: "text-cyan-400", border: "border-cyan-500/20", glow: "shadow-cyan-500/5", bar: "from-cyan-500 to-cyan-400" },
  pink: { badge: "bg-pink-500/15 text-pink-400 border-pink-500/20", accent: "text-pink-400", border: "border-pink-500/20", glow: "shadow-pink-500/5", bar: "from-pink-500 to-pink-400" },
  orange: { badge: "bg-orange-500/15 text-orange-400 border-orange-500/20", accent: "text-orange-400", border: "border-orange-500/20", glow: "shadow-orange-500/5", bar: "from-orange-500 to-orange-400" },
  indigo: { badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20", accent: "text-indigo-400", border: "border-indigo-500/20", glow: "shadow-indigo-500/5", bar: "from-indigo-500 to-indigo-400" },
};

type Props = {
  phase: Phase;
  completedSet: Set<string>;
  onToggle: (id: string) => void;
  isOwner: boolean;
  defaultOpen?: boolean;
  even?: boolean;
};

export default function PhaseSection({ phase, completedSet, onToggle, isOwner, defaultOpen = false, even = false }: Props) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const Icon = iconMap[phase.icon] || Layers;
  const c = colorMap[phase.color] || colorMap.blue;

  const phaseTotal = phase.sections.reduce((s, sec) => s + sec.items.length, 0);
  const phaseDone = phase.sections.reduce(
    (s, sec) => s + sec.items.filter((item) => completedSet.has(item.id)).length,
    0
  );
  const phasePercent = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;
  const phaseComplete = phaseDone === phaseTotal && phaseTotal > 0;

  const toggleSection = (sectionId: string) => {
    setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <section
      id={phase.id}
      className={`py-12 md:py-16 px-6 md:px-12 ${
        even ? "bg-white/[0.01]" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Phase header — clickable to expand/collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full text-left glass p-6 md:p-8 border ${c.border} hover:shadow-lg ${c.glow} transition-all ${
            expanded ? "mb-6" : ""
          } ${phaseComplete ? "ring-1 ring-emerald-500/20" : ""}`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${c.badge} border shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${c.badge}`}>
                  Phase {phase.phase}
                </span>
                <span className="text-xs text-gray-500">{phase.timeline}</span>
                {phaseComplete && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Phase Complete
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {phase.title}
              </h2>
              <p className="text-sm text-gray-500">{phase.subtitle}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className={`text-3xl font-bold ${c.accent}`}>
                  {phasePercent}%
                </div>
                <div className="text-xs text-gray-500">
                  {phaseDone}/{phaseTotal} tasks
                </div>
              </div>
              {expanded ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700 ease-out`}
              style={{ width: `${phasePercent}%` }}
            />
          </div>
        </button>

        {/* Sections — only shown when expanded */}
        {expanded && (
          <div className="space-y-4">
            {phase.sections.map((section) => {
              const secDone = section.items.filter((item) => completedSet.has(item.id)).length;
              const secTotal = section.items.length;
              const secComplete = secDone === secTotal && secTotal > 0;
              const isCollapsed = collapsed[section.id] ?? false;

              return (
                <div key={section.id} className={`glass overflow-hidden ${secComplete ? "border border-emerald-500/10" : ""}`}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                    <span className={`font-medium flex-1 ${secComplete ? "text-gray-400" : "text-white"}`}>
                      {section.title}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {secDone}/{secTotal}
                    </span>
                    {secComplete && (
                      <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Done
                      </span>
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="border-t border-white/[0.04] px-5 pb-4">
                      {section.items.map((item) => {
                        const checked = completedSet.has(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`flex items-start gap-3 py-3 border-b border-white/[0.03] last:border-0 ${
                              isOwner ? "cursor-pointer group" : ""
                            } ${checked ? "opacity-50" : ""}`}
                            onClick={() => isOwner && onToggle(item.id)}
                          >
                            <div className="pt-0.5 shrink-0">
                              {checked ? (
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Square className={`w-5 h-5 ${
                                  isOwner
                                    ? "text-gray-600 group-hover:text-gray-400 transition-colors"
                                    : "text-gray-700"
                                }`} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-sm leading-relaxed ${
                                  checked
                                    ? "text-gray-500 line-through decoration-gray-700"
                                    : isOwner
                                    ? "text-gray-300 group-hover:text-white transition-colors"
                                    : "text-gray-300"
                                }`}
                              >
                                {item.task}
                              </span>

                              {item.resource && (
                                <span className="inline-flex items-center gap-1 ml-2">
                                  {item.resourceUrl ? (
                                    <a
                                      href={item.resourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                      {item.resource}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <span className="text-xs text-gray-600">
                                      {item.resource}
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

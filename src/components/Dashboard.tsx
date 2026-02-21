"use client";

import { memo, useMemo } from "react";
import { roadmap, getTotalItems } from "@/data/siteData";
import type { CompletedMap } from "@/hooks/useChecklist";
import { CheckCircle2, Circle, Flame, FileCheck } from "lucide-react";

const colorMap: Record<string, { bar: string; text: string; bg: string }> = {
  emerald: { bar: "from-emerald-500 to-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10" },
  blue: { bar: "from-blue-500 to-blue-400", text: "text-blue-400", bg: "bg-blue-400/10" },
  violet: { bar: "from-violet-500 to-violet-400", text: "text-violet-400", bg: "bg-violet-400/10" },
  amber: { bar: "from-amber-500 to-amber-400", text: "text-amber-400", bg: "bg-amber-400/10" },
  red: { bar: "from-red-500 to-red-400", text: "text-red-400", bg: "bg-red-400/10" },
  cyan: { bar: "from-cyan-500 to-cyan-400", text: "text-cyan-400", bg: "bg-cyan-400/10" },
  pink: { bar: "from-pink-500 to-pink-400", text: "text-pink-400", bg: "bg-pink-400/10" },
  orange: { bar: "from-orange-500 to-orange-400", text: "text-orange-400", bg: "bg-orange-400/10" },
  indigo: { bar: "from-indigo-500 to-indigo-400", text: "text-indigo-400", bg: "bg-indigo-400/10" },
};

type Props = {
  completedSet: Set<string>;
  completedMap?: CompletedMap;
};

export default memo(function Dashboard({ completedSet, completedMap }: Props) {
  const totalItems = getTotalItems();
  const completedCount = completedSet.size;
  const overallPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  const documentedCount = useMemo(
    () => completedMap ? Object.values(completedMap).filter((p) => p.note || p.link).length : 0,
    [completedMap]
  );

  const phaseStats = useMemo(() => roadmap.map((phase) => {
    const phaseTotal = phase.sections.reduce((s, sec) => s + sec.items.length, 0);
    const phaseDone = phase.sections.reduce(
      (s, sec) => s + sec.items.filter((item) => completedSet.has(item.id)).length,
      0
    );
    return { ...phase, total: phaseTotal, done: phaseDone, percent: phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0 };
  }), [completedSet]);

  return (
    <section id="dashboard" className="py-12 md:py-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Overall stats */}
        <div className="glass p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-6">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                Overall Progress
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold gradient-text">
                  {overallPercent}%
                </span>
                <span className="text-sm text-gray-500">
                  ({completedCount}/{totalItems})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-400/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{completedCount}</div>
                  <div className="text-xs text-gray-500">Done</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gray-400/10">
                  <Circle className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{totalItems - completedCount}</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-400/10">
                  <FileCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{documentedCount}</div>
                  <div className="text-xs text-gray-500">Documented</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-400/10">
                  <Flame className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{roadmap.length}</div>
                  <div className="text-xs text-gray-500">Phases</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall bar */}
          <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-400 transition-all duration-700 ease-out"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Phase breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {phaseStats.map((p) => {
            const c = colorMap[p.color] || colorMap.blue;
            return (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="glass-hover p-4 md:p-5 group block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-mono ${c.text} ${c.bg} px-2 py-0.5 rounded shrink-0`}>
                    P{p.phase}
                  </span>
                  <span className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors truncate flex-1">
                    {p.title}
                  </span>
                  <span className="text-xs font-mono text-gray-500 shrink-0">
                    {p.done}/{p.total}
                  </span>
                </div>

                <div className="h-1.5 md:h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700 ease-out`}
                    style={{ width: `${p.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-600">{p.timeline}</span>
                  <span className={`text-xs font-medium ${c.text}`}>{p.percent}%</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
});

"use client";

import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <span className="text-xs text-gray-600">Loading...</span>,
});
import { Phase } from "@/data/siteData";
import type { CompletedMap, Proof } from "@/hooks/useChecklist";
import { uploadProofImage, deleteProofImage } from "@/lib/supabase";
import QuizModal from "./QuizModal";
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
  FileText,
  Link as LinkIcon,
  Calendar,
  Pencil,
  X,
  ImagePlus,
  Trash2,
  Loader2,
  Brain,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers, cloud: Cloud, boxes: Boxes, database: Database,
  shield: Shield, container: Container, presentation: Presentation,
  award: Award, rocket: Rocket,
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
  completedMap: CompletedMap;
  completedSet: Set<string>;
  onToggle: (id: string) => void;
  onUpdateProof: (id: string, proof: Partial<Proof>) => void;
  isOwner: boolean;
  defaultOpen?: boolean;
  even?: boolean;
};

/* ──────────────────────────────────────────────
   Image Lightbox — click to view full size
   ────────────────────────────────────────────── */
function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white z-10">
        <X className="w-7 h-7" />
      </button>
      <img
        src={src}
        alt="Proof"
        className="max-w-full max-h-[90vh] rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}

/* ──────────────────────────────────────────────
   Proof Display — visible to everyone
   ────────────────────────────────────────────── */
function ProofDisplay({ proof }: { proof: Proof }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [quizExpanded, setQuizExpanded] = useState(false);
  const hasContent = proof.note || proof.link || (proof.images && proof.images.length > 0) || proof.quiz;
  if (!hasContent && !proof.date) return null;

  const isLong = (proof.note?.split("\n").length ?? 0) > 4 || (proof.note?.length ?? 0) > 200;

  return (
    <div className="mt-3 space-y-2">
      {/* Meta row: date + link + images */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {proof.date && (
          <span className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            {proof.date}
          </span>
        )}
        {proof.link && (
          <a
            href={proof.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            Evidence
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
        {proof.images && proof.images.length > 0 && proof.images.map((url, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setLightbox(url); }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] hover:border-brand-500/30 text-gray-500 hover:text-brand-400 transition-all"
          >
            <ImagePlus className="w-3 h-3" />
            {proof.images!.length === 1 ? "View image" : `Image ${i + 1}`}
          </button>
        ))}
        {proof.quiz && (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${
              proof.quiz.bestScore >= 70
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="font-medium">{proof.quiz.bestScore}%</span>
            <span className="text-[10px] opacity-70">{proof.quiz.date}</span>
          </span>
        )}
      </div>

      {/* Note — markdown rendered, collapsible */}
      {proof.note && (
        <div onClick={(e) => e.stopPropagation()}>
          <div
            className={`prose-proof border-l-2 border-brand-500/20 pl-3 ml-0.5 ${
              !expanded && isLong ? "max-h-24 overflow-hidden relative" : ""
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{proof.note}</ReactMarkdown>
            {!expanded && isLong && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
            )}
          </div>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 ml-3 text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              {expanded ? "Show less" : "Read more..."}
            </button>
          )}
        </div>
      )}

      {/* Quiz Q&A — visible to everyone */}
      {proof.quiz && (proof.quiz.mcq || proof.quiz.scenario) && (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setQuizExpanded(!quizExpanded)}
            className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            <Brain className="w-3 h-3" />
            {quizExpanded ? "Hide quiz details" : "View quiz Q&A"}
          </button>

          {quizExpanded && (
            <div className="mt-2 space-y-3">
              {/* MCQ results */}
              {proof.quiz.mcq && proof.quiz.mcq.length > 0 && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                    <Zap className="w-3 h-3" />
                    Quick Check
                  </p>
                  {proof.quiz.mcq.map((q, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs ${
                        q.correct
                          ? "border-emerald-500/15 bg-emerald-500/5"
                          : "border-red-500/15 bg-red-500/5"
                      }`}
                    >
                      <div className="flex items-start gap-1.5 mb-1.5">
                        {q.correct ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                        )}
                        <span className="text-gray-300">{q.question}</span>
                      </div>
                      <div className="ml-[18px] space-y-0.5 text-gray-500">
                        <p>
                          My answer: <span className={q.correct ? "text-emerald-400" : "text-red-400"}>{q.options[q.selected]}</span>
                        </p>
                        {!q.correct && (
                          <p>Correct: <span className="text-emerald-400">{q.options[q.correctIndex]}</span></p>
                        )}
                        <p className="text-gray-600 mt-1">{q.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Scenario result */}
              {proof.quiz.scenario && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                    <Target className="w-3 h-3" />
                    Deep Dive — {proof.quiz.scenario.score}/{proof.quiz.scenario.maxScore}
                  </p>
                  <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs space-y-2">
                    <div>
                      <p className="text-gray-500 mb-1">Scenario:</p>
                      <p className="text-gray-300 leading-relaxed">{proof.quiz.scenario.question}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">My answer:</p>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{proof.quiz.scenario.answer}</p>
                    </div>
                    {proof.quiz.scenario.strengths.length > 0 && (
                      <div>
                        <p className="text-emerald-400/80 mb-0.5">Strengths:</p>
                        <ul className="space-y-0.5 text-gray-400">
                          {proof.quiz.scenario.strengths.map((s, i) => (
                            <li key={i} className="flex gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400/60 mt-0.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {proof.quiz.scenario.improvements.length > 0 && (
                      <div>
                        <p className="text-amber-400/80 mb-0.5">Areas to improve:</p>
                        <ul className="space-y-0.5 text-gray-400">
                          {proof.quiz.scenario.improvements.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 mb-0.5">Model answer:</p>
                      <div className="prose-proof">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{proof.quiz.scenario.modelAnswer}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {lightbox && <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Proof Editor — owner only (rich)
   ────────────────────────────────────────────── */
function ProofEditor({
  proof,
  onSave,
  onClose,
}: {
  proof: Proof;
  onSave: (p: Partial<Proof>) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(proof.note || "");
  const [link, setLink] = useState(proof.link || "");
  const [images, setImages] = useState<string[]>(proof.images || []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.max(80, el.scrollHeight) + "px";
    }
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be under 5 MB");
        continue;
      }
      const url = await uploadProofImage(file);
      if (url) newUrls.push(url);
    }

    if (newUrls.length > 0) {
      setImages((prev) => [...prev, ...newUrls]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = async (url: string) => {
    await deleteProofImage(url);
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  const handleSave = () => {
    onSave({
      note: note || undefined,
      link: link || undefined,
      images: images.length > 0 ? images : undefined,
    });
    onClose();
  };

  return (
    <div
      className="mt-3 p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-4"
      onClick={(e) => e.stopPropagation()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Document your learning</span>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Rich text area */}
      <div>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <FileText className="w-3 h-3" />
          Notes
        </label>
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => { setNote(e.target.value); autoResize(); }}
          onFocus={autoResize}
          rows={3}
          placeholder={"What did you learn? What did you build?\n\ne.g.\n- Completed AWS SAA course by Adrian Cantrill\n- Built a 3-tier architecture on AWS\n- Scored 85% on practice exam"}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500/40 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Link input */}
      <div>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <LinkIcon className="w-3 h-3" />
          Evidence link
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://github.com/..., blog post, certification URL"
          className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500/40 transition-all"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <ImagePlus className="w-3 h-3" />
          Screenshots / Certificates
        </label>

        {/* Uploaded images preview */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.02] group">
                <Image src={url} alt={`Upload ${i + 1}`} fill className="object-contain p-0.5" sizes="80px" />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload zone */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full py-4 rounded-lg border-2 border-dashed border-white/[0.06] hover:border-brand-500/30 bg-white/[0.02] hover:bg-white/[0.03] transition-all flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-400 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4" />
              Click or drag images here
              <span className="text-xs text-gray-600">(max 5 MB each)</span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-sm text-white font-medium transition-all"
        >
          Save proof
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Phase Section
   ────────────────────────────────────────────── */
export default memo(function PhaseSection({
  phase, completedMap, completedSet, onToggle, onUpdateProof, isOwner, defaultOpen = false, even = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [editingProof, setEditingProof] = useState<string | null>(null);
  const [quizTask, setQuizTask] = useState<{ id: string; name: string } | null>(null);
  const Icon = iconMap[phase.icon] || Layers;
  const c = colorMap[phase.color] || colorMap.blue;

  const { phaseTotal, phaseDone, phasePercent, phaseComplete } = useMemo(() => {
    const total = phase.sections.reduce((s, sec) => s + sec.items.length, 0);
    const done = phase.sections.reduce(
      (s, sec) => s + sec.items.filter((item) => completedSet.has(item.id)).length, 0
    );
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { phaseTotal: total, phaseDone: done, phasePercent: percent, phaseComplete: done === total && total > 0 };
  }, [phase, completedSet]);

  const toggleSection = (sectionId: string) => {
    setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <section id={phase.id} className={`py-8 md:py-16 px-4 md:px-12 ${even ? "bg-white/[0.01]" : ""}`}>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full text-left glass p-4 md:p-8 border ${c.border} hover:shadow-lg ${c.glow} transition-all ${
            expanded ? "mb-6" : ""
          } ${phaseComplete ? "ring-1 ring-emerald-500/20" : ""}`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className={`hidden md:flex items-center justify-center w-14 h-14 rounded-2xl ${c.badge} border shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${c.badge}`}>Phase {phase.phase}</span>
                <span className="text-xs text-gray-500">{phase.timeline}</span>
                {phaseComplete && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Complete</span>
                )}
              </div>
              <h2 className="text-lg md:text-3xl font-bold text-white mb-0.5 md:mb-1">{phase.title}</h2>
              <p className="text-xs md:text-sm text-gray-500 hidden md:block">{phase.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="text-right">
                <div className={`text-xl md:text-3xl font-bold ${c.accent}`}>{phasePercent}%</div>
                <div className="text-[10px] md:text-xs text-gray-500">{phaseDone}/{phaseTotal}</div>
              </div>
              {expanded ? <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500" /> : <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />}
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-gray-800 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700 ease-out`} style={{ width: `${phasePercent}%` }} />
          </div>
        </button>

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
                    {isCollapsed
                      ? <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    }
                    <span className={`font-medium flex-1 ${secComplete ? "text-gray-400" : "text-white"}`}>{section.title}</span>
                    <span className="text-xs text-gray-500 font-mono">{secDone}/{secTotal}</span>
                    {secComplete && (
                      <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Done</span>
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="border-t border-white/[0.04] px-5 pb-4">
                      {section.items.map((item) => {
                        const checked = completedSet.has(item.id);
                        const proof = completedMap[item.id];
                        const isEditing = editingProof === item.id;

                        return (
                          <div key={item.id} className={`py-3 border-b border-white/[0.03] last:border-0`}>
                            <div
                              className={`flex items-start gap-3 ${isOwner ? "cursor-pointer group" : ""}`}
                              onClick={() => {
                                if (!isOwner) return;
                                if (checked && proof && (proof.note || proof.link || (proof.images && proof.images.length > 0) || proof.quiz)) {
                                  if (!window.confirm("This task has documented proof. Are you sure you want to uncheck it? All proof data will be lost.")) return;
                                }
                                onToggle(item.id);
                              }}
                            >
                              <div className="pt-0.5 shrink-0">
                                {checked
                                  ? <CheckSquare className="w-5 h-5 text-emerald-400" />
                                  : <Square className={`w-5 h-5 ${isOwner ? "text-gray-600 group-hover:text-gray-400 transition-colors" : "text-gray-700"}`} />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm leading-relaxed break-words ${
                                  checked
                                    ? "text-gray-400"
                                    : isOwner ? "text-gray-300 group-hover:text-white transition-colors" : "text-gray-300"
                                }`}>
                                  {item.task}
                                </span>
                                {item.resource && (
                                  <span className="inline-flex items-center gap-1 ml-2">
                                    {item.resourceUrl ? (
                                      <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                                        {item.resource} <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ) : (
                                      <span className="text-xs text-gray-600">{item.resource}</span>
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Verified badge — visible to everyone */}
                              {checked && proof?.quiz && proof.quiz.bestScore >= 70 && !isOwner && (
                                <span className="shrink-0 flex items-center justify-center p-1.5" title={`Verified: ${proof.quiz.bestScore}%`}>
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </span>
                              )}

                              {/* Quiz Me button — owner only */}
                              {checked && isOwner && !isEditing && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setQuizTask({ id: item.id, name: item.task }); }}
                                  className={`shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg transition-all ${
                                    proof?.quiz && proof.quiz.bestScore >= 70
                                      ? "text-emerald-400/60 hover:text-emerald-400 hover:bg-white/[0.04]"
                                      : "text-gray-600 hover:text-brand-400 hover:bg-white/[0.04]"
                                  }`}
                                  title={proof?.quiz ? `Best: ${proof.quiz.bestScore}% — Quiz again` : "Quiz Me"}
                                >
                                  {proof?.quiz && proof.quiz.bestScore >= 70 ? (
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  ) : (
                                    <Brain className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}

                              {/* Edit proof button — owner only */}
                              {checked && isOwner && !isEditing && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingProof(item.id); }}
                                  className={`shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg transition-all ${
                                    proof && (proof.note || proof.link || (proof.images && proof.images.length > 0))
                                      ? "text-brand-400/60 hover:text-brand-400 hover:bg-white/[0.04]"
                                      : "text-gray-600 hover:text-brand-400 hover:bg-white/[0.04]"
                                  }`}
                                  title={proof?.note ? "Edit proof" : "Add proof"}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Proof display — visible to everyone */}
                            {checked && proof && !isEditing && <div className="ml-8"><ProofDisplay proof={proof} /></div>}

                            {/* Proof editor — owner only */}
                            {isEditing && proof && (
                              <div className="ml-8">
                                <ProofEditor
                                  proof={proof}
                                  onSave={(p) => onUpdateProof(item.id, p)}
                                  onClose={() => setEditingProof(null)}
                                />
                              </div>
                            )}
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

      {quizTask && (
        <QuizModal
          taskId={quizTask.id}
          taskName={quizTask.name}
          existingBestScore={completedMap[quizTask.id]?.quiz?.bestScore}
          onClose={() => setQuizTask(null)}
          onSaveResult={(result) => {
            onUpdateProof(quizTask.id, {
              quiz: {
                score: result.score,
                total: result.total,
                correct: result.correct,
                date: new Date().toISOString().slice(0, 10),
                bestScore: result.bestScore,
                mcq: result.mcq,
                scenario: result.scenario,
              },
            });
          }}
        />
      )}
    </section>
  );
});

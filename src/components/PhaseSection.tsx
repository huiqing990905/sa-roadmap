"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Phase } from "@/data/siteData";
import type { CompletedMap, Proof } from "@/hooks/useChecklist";
import { uploadProofImage, deleteProofImage } from "@/lib/supabase";
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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
        <X className="w-6 h-6" />
      </button>
      <img src={src} alt="Proof" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Proof Display — visible to everyone
   ────────────────────────────────────────────── */
function ProofDisplay({ proof }: { proof: Proof }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const hasContent = proof.note || proof.link || (proof.images && proof.images.length > 0);
  if (!hasContent && !proof.date) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Meta row: date + link */}
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
      </div>

      {/* Note — rendered with preserved whitespace */}
      {proof.note && (
        <div
          className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap pl-0.5 border-l-2 border-brand-500/20 ml-0.5 py-1"
          style={{ paddingLeft: "0.75rem" }}
          onClick={(e) => e.stopPropagation()}
        >
          {proof.note}
        </div>
      )}

      {/* Images gallery */}
      {proof.images && proof.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
          {proof.images.map((url, i) => (
            <button
              key={i}
              onClick={() => setLightbox(url)}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/[0.06] hover:border-brand-500/30 transition-all group"
            >
              <Image
                src={url}
                alt={`Proof ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="96px"
              />
            </button>
          ))}
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
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/[0.08] group">
                <Image src={url} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="96px" />
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
export default function PhaseSection({
  phase, completedMap, completedSet, onToggle, onUpdateProof, isOwner, defaultOpen = false, even = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [editingProof, setEditingProof] = useState<string | null>(null);
  const Icon = iconMap[phase.icon] || Layers;
  const c = colorMap[phase.color] || colorMap.blue;

  const phaseTotal = phase.sections.reduce((s, sec) => s + sec.items.length, 0);
  const phaseDone = phase.sections.reduce(
    (s, sec) => s + sec.items.filter((item) => completedSet.has(item.id)).length, 0
  );
  const phasePercent = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;
  const phaseComplete = phaseDone === phaseTotal && phaseTotal > 0;

  const toggleSection = (sectionId: string) => {
    setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <section id={phase.id} className={`py-12 md:py-16 px-6 md:px-12 ${even ? "bg-white/[0.01]" : ""}`}>
      <div className="max-w-5xl mx-auto">
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
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${c.badge}`}>Phase {phase.phase}</span>
                <span className="text-xs text-gray-500">{phase.timeline}</span>
                {phaseComplete && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Phase Complete</span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{phase.title}</h2>
              <p className="text-sm text-gray-500">{phase.subtitle}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className={`text-3xl font-bold ${c.accent}`}>{phasePercent}%</div>
                <div className="text-xs text-gray-500">{phaseDone}/{phaseTotal} tasks</div>
              </div>
              {expanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
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
                              onClick={() => isOwner && onToggle(item.id)}
                            >
                              <div className="pt-0.5 shrink-0">
                                {checked
                                  ? <CheckSquare className="w-5 h-5 text-emerald-400" />
                                  : <Square className={`w-5 h-5 ${isOwner ? "text-gray-600 group-hover:text-gray-400 transition-colors" : "text-gray-700"}`} />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm leading-relaxed ${
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

                              {/* Edit proof button — owner only */}
                              {checked && isOwner && !isEditing && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingProof(item.id); }}
                                  className={`shrink-0 p-1.5 rounded-lg transition-all ${
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
    </section>
  );
}

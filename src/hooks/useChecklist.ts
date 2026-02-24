"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { TrackId } from "@/data/siteData";

export type McqRecord = {
  question: string;
  options: string[];
  correctIndex: number;
  selected: number;
  correct: boolean;
  explanation: string;
};

export type ScenarioRecord = {
  question: string;
  answer: string;
  score: number;
  maxScore: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
};

export type QuizResult = {
  score: number;
  total: number;
  correct: number;
  date: string;
  bestScore: number;
  mcq?: McqRecord[];
  scenario?: ScenarioRecord;
};

export type Proof = {
  date: string;
  note?: string;
  link?: string;
  images?: string[];
  quiz?: QuizResult;
};

export type CompletedMap = Record<string, Proof>;

const TABLE = "checklist_progress";
const DEBOUNCE_MS = 400;
const LEGACY_TRACK: TrackId = "sa";

function migrateFromArray(data: unknown): CompletedMap {
  if (Array.isArray(data)) {
    const migrated: CompletedMap = {};
    for (const id of data) {
      if (typeof id === "string") {
        migrated[id] = { date: new Date().toISOString().slice(0, 10) };
      }
    }
    return migrated;
  }
  if (data && typeof data === "object") return data as CompletedMap;
  return {};
}

export function useChecklist(trackId: TrackId) {
  const [completed, setCompleted] = useState<CompletedMap>({});
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [supportsTrackColumn, setSupportsTrackColumn] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowId = useRef<string | null>(null);

  useEffect(() => {
    rowId.current = null;
    setHydrated(false);
  }, [trackId]);

  // 1. Auth
  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setCompleted({});
      setSyncError("Supabase is not configured. Progress sync is disabled.");
      setHydrated(true);
      return;
    }
    setSyncError(null);

    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [trackId]);

  // 2. Load
  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setCompleted({});
      setSyncError("Supabase is not configured. Progress sync is disabled.");
      setHydrated(true);
      return;
    }

    async function load() {
      // Primary path: schema with track_id.
      if (supportsTrackColumn) {
        const { data, error } = await client!
          .from(TABLE)
          .select("id, completed")
          .eq("track_id", trackId)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          rowId.current = data.id;
          const migrated = migrateFromArray(data.completed);
          setCompleted(migrated);
          setSyncError(null);
          setHydrated(true);
          return;
        }

        if (error && error.message.includes("track_id")) {
          setSupportsTrackColumn(false);
          if (trackId !== LEGACY_TRACK) {
            setSyncError("Database schema is missing track_id. Run migration before using Mastery track.");
            setHydrated(true);
            return;
          }
        } else if (error) {
          setSyncError(`Failed to load progress: ${error.message}`);
          setHydrated(true);
          return;
        } else {
          setCompleted({});
          setSyncError(null);
          setHydrated(true);
          return;
        }
      }

      // Fallback for legacy schema without track_id.
      if (trackId === LEGACY_TRACK) {
        const { data, error } = await client!
          .from(TABLE)
          .select("id, completed")
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          rowId.current = data.id;
          const migrated = migrateFromArray(data.completed);
          setCompleted(migrated);
          setSyncError(null);
          setHydrated(true);
          return;
        }

        if (error) {
          setSyncError(`Failed to load progress: ${error.message}`);
          setHydrated(true);
          return;
        }

        setCompleted({});
        setSyncError(null);
        setHydrated(true);
        return;
      }

      setCompleted({});
      setSyncError("Database schema is missing track_id. Run migration before using this track.");
      setHydrated(true);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, trackId, supportsTrackColumn]);

  // 3. Persist
  const persist = useCallback(
    (newData: CompletedMap) => {
      const client = getSupabase();
      if (!user) return;
      if (!client) {
        setSyncError("Supabase is not configured. Save failed.");
        return;
      }

      if (saveTimer.current) clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          if (rowId.current && supportsTrackColumn) {
            const { error } = await client
              .from(TABLE)
              .update({ completed: newData })
              .eq("id", rowId.current)
              .eq("track_id", trackId);
            if (error) {
              setSyncError(`Save failed: ${error.message}`);
              console.error("Supabase update error:", error.message);
            } else {
              setSyncError(null);
            }
          } else if (supportsTrackColumn) {
            const { data, error } = await client
              .from(TABLE)
              .insert({ user_id: user.id, track_id: trackId, completed: newData })
              .select("id")
              .single();
            if (error) {
              setSyncError(`Save failed: ${error.message}`);
              console.error("Supabase insert error:", error.message);
            } else {
              if (data) rowId.current = data.id;
              setSyncError(null);
            }
          } else if (trackId === LEGACY_TRACK) {
            if (rowId.current) {
              const { error } = await client
                .from(TABLE)
                .update({ completed: newData })
                .eq("id", rowId.current);
              if (error) {
                setSyncError(`Save failed: ${error.message}`);
                console.error("Supabase update error:", error.message);
              } else {
                setSyncError(null);
              }
            } else {
              const { data, error } = await client
                .from(TABLE)
                .insert({ user_id: user.id, completed: newData })
                .select("id")
                .single();
              if (error) {
                setSyncError(`Save failed: ${error.message}`);
                console.error("Supabase insert error:", error.message);
              } else {
                if (data) rowId.current = data.id;
                setSyncError(null);
              }
            }
          } else {
            setSyncError("Save blocked: database schema missing track_id for this track.");
            console.warn("Supabase schema missing track_id. Save blocked.");
          }
        } catch (err) {
          setSyncError("Save failed due to an unexpected error.");
          console.error("Supabase save failed:", err);
        }
        setSaving(false);
      }, DEBOUNCE_MS);
    },
    [user, trackId, supportsTrackColumn]
  );

  // 4. Toggle check
  const toggle = useCallback(
    (id: string) => {
      if (!user) return;

      setCompleted((prev) => {
        const next = { ...prev };
        if (next[id]) {
          delete next[id];
        } else {
          next[id] = { date: new Date().toISOString().slice(0, 10) };
        }
        persist(next);
        return next;
      });
    },
    [user, persist]
  );

  // 5. Update proof for a completed item
  const updateProof = useCallback(
    (id: string, proof: Partial<Proof>) => {
      if (!user) return;

      setCompleted((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev, [id]: { ...prev[id], ...proof } };
        persist(next);
        return next;
      });
    },
    [user, persist]
  );

  const isOwner = !!user;
  const completedCount = Object.keys(completed).length;
  const completedSet = useMemo(() => new Set(Object.keys(completed)), [completed]);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabase();
    if (!client) return { message: "Supabase not configured" };
    const { error } = await client.auth.signInWithPassword({ email, password });
    return error;
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabase();
    if (!client) return;
    await client.auth.signOut();
    setUser(null);
  }, []);

  return {
    completed,
    completedSet,
    toggle,
    updateProof,
    completedCount,
    hydrated,
    saving,
    syncError,
    isOwner,
    user,
    signIn,
    signOut,
  };
}

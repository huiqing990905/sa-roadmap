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
const LOCAL_KEY = "sa-journey-checklist";
const DEBOUNCE_MS = 400;
const LEGACY_TRACK: TrackId = "sa";

function getLocalKey(trackId: TrackId): string {
  return `${LOCAL_KEY}:${trackId}`;
}

function saveLocal(data: CompletedMap, trackId: TrackId) {
  try {
    localStorage.setItem(getLocalKey(trackId), JSON.stringify(data));
  } catch {}
}

function loadLocal(trackId: TrackId): CompletedMap {
  try {
    const raw = localStorage.getItem(getLocalKey(trackId));
    if (raw) {
      const parsed = JSON.parse(raw);
      // migrate old format (string[]) to new format
      if (Array.isArray(parsed)) {
        const migrated: CompletedMap = {};
        for (const id of parsed) {
          migrated[id] = { date: new Date().toISOString().slice(0, 10) };
        }
        return migrated;
      }
      return parsed;
    }

    // Backward compatibility for pre-track data.
    if (trackId === LEGACY_TRACK) {
      const legacy = localStorage.getItem(LOCAL_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return migrateFromArray(parsed);
      }
    }
  } catch {}
  return {};
}

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
      setCompleted(loadLocal(trackId));
      setHydrated(true);
      return;
    }

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
      if (!hydrated) {
        setCompleted(loadLocal(trackId));
        setHydrated(true);
      }
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
          saveLocal(migrated, trackId);
          setHydrated(true);
          return;
        }

        if (error && error.message.includes("track_id")) {
          setSupportsTrackColumn(false);
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
          saveLocal(migrated, trackId);
          setHydrated(true);
          return;
        }
      }

      setCompleted(loadLocal(trackId));
      setHydrated(true);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, trackId, supportsTrackColumn]);

  // 3. Persist
  const persist = useCallback(
    (newData: CompletedMap) => {
      saveLocal(newData, trackId);

      const client = getSupabase();
      if (!user || !client) return;

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
            if (error) console.error("Supabase update error:", error.message);
          } else if (supportsTrackColumn) {
            const { data, error } = await client
              .from(TABLE)
              .insert({ user_id: user.id, track_id: trackId, completed: newData })
              .select("id")
              .single();
            if (error) console.error("Supabase insert error:", error.message);
            if (data) rowId.current = data.id;
          } else if (trackId === LEGACY_TRACK) {
            if (rowId.current) {
              const { error } = await client
                .from(TABLE)
                .update({ completed: newData })
                .eq("id", rowId.current);
              if (error) console.error("Supabase update error:", error.message);
            } else {
              const { data, error } = await client
                .from(TABLE)
                .insert({ user_id: user.id, completed: newData })
                .select("id")
                .single();
              if (error) console.error("Supabase insert error:", error.message);
              if (data) rowId.current = data.id;
            }
          } else {
            // Legacy schema does not support non-SA track persistence.
            console.warn("Supabase schema missing track_id. Persisting mastery track locally only.");
          }
        } catch (err) {
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
    isOwner,
    user,
    signIn,
    signOut,
  };
}

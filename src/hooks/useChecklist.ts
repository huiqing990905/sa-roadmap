"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type Proof = {
  date: string;
  note?: string;
  link?: string;
  images?: string[];
};

export type CompletedMap = Record<string, Proof>;

const TABLE = "checklist_progress";
const LOCAL_KEY = "sa-journey-checklist";
const DEBOUNCE_MS = 400;

function saveLocal(data: CompletedMap) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {}
}

function loadLocal(): CompletedMap {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
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

export function useChecklist() {
  const [completed, setCompleted] = useState<CompletedMap>({});
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowId = useRef<string | null>(null);

  // 1. Auth
  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setCompleted(loadLocal());
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
  }, []);

  // 2. Load
  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      if (!hydrated) {
        setCompleted(loadLocal());
        setHydrated(true);
      }
      return;
    }

    async function load() {
      const { data, error } = await client!
        .from(TABLE)
        .select("id, completed")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        rowId.current = data.id;
        const migrated = migrateFromArray(data.completed);
        setCompleted(migrated);
        saveLocal(migrated);
      } else {
        setCompleted(loadLocal());
      }
      setHydrated(true);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 3. Persist
  const persist = useCallback(
    (newData: CompletedMap) => {
      saveLocal(newData);

      const client = getSupabase();
      if (!user || !client) return;

      if (saveTimer.current) clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
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
        } catch (err) {
          console.error("Supabase save failed:", err);
        }
        setSaving(false);
      }, DEBOUNCE_MS);
    },
    [user]
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
  const completedSet = new Set(Object.keys(completed));

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

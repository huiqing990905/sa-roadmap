"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const TABLE = "checklist_progress";
const LOCAL_KEY = "sa-journey-checklist";
const DEBOUNCE_MS = 400;

function saveLocal(items: string[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  } catch {}
}

function loadLocal(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function useChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowId = useRef<string | null>(null);

  // 1. Auth — restore session on mount
  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setHydrated(true);
      // No Supabase — load from localStorage only
      setCompleted(new Set(loadLocal()));
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

  // 2. Load data — from Supabase (public read), fallback to localStorage
  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      if (!hydrated) {
        setCompleted(new Set(loadLocal()));
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
        const items: string[] = Array.isArray(data.completed) ? data.completed : [];
        setCompleted(new Set(items));
        saveLocal(items); // sync to localStorage as cache
      } else {
        // Fallback to localStorage if Supabase fails
        setCompleted(new Set(loadLocal()));
      }
      setHydrated(true);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 3. Save — debounced to Supabase, immediate to localStorage
  const persistToSupabase = useCallback(
    (newSet: Set<string>) => {
      const payload = [...newSet];
      // Always save to localStorage immediately (survives refresh)
      saveLocal(payload);

      const client = getSupabase();
      if (!user || !client) return;

      if (saveTimer.current) clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          if (rowId.current) {
            const { error } = await client
              .from(TABLE)
              .update({ completed: payload })
              .eq("id", rowId.current);
            if (error) console.error("Supabase update error:", error.message);
          } else {
            const { data, error } = await client
              .from(TABLE)
              .insert({ user_id: user.id, completed: payload })
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

  // 4. Toggle
  const toggle = useCallback(
    (id: string) => {
      if (!user) return;

      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        persistToSupabase(next);
        return next;
      });
    },
    [user, persistToSupabase]
  );

  const isOwner = !!user;
  const completedCount = completed.size;

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
    toggle,
    completedCount,
    hydrated,
    saving,
    isOwner,
    user,
    signIn,
    signOut,
  };
}

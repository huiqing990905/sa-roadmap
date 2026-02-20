import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "your-supabase-url-here") return null;

  _client = createClient(url, key);
  return _client;
}

const BUCKET = "proof-images";

export async function uploadProofImage(file: File): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  const ext = file.name.split(".").pop() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProofImage(url: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  const parts = url.split(`/storage/v1/object/public/${BUCKET}/`);
  if (parts.length < 2) return;

  const path = parts[1];
  const { error } = await client.storage.from(BUCKET).remove([path]);
  if (error) console.error("Delete image error:", error.message);
}

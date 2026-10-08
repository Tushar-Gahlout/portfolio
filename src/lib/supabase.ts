import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env as Record<string, string | undefined>)["VITE_SUPABASE_URL"];
const key = (import.meta.env as Record<string, string | undefined>)["VITE_SUPABASE_ANON_KEY"];

// null when the env vars are missing, so the site still works without a database.
export const supabase = url && key ? createClient(url, key) : null;

export const OWNER_EMAIL = "rajputtushar119@gmail.com";
export const BUCKET = "portfolio-images";

export type DbProject = {
  id: string;
  name: string;
  description: string | null;
  tech: string[] | null;
  github: string | null;
  demo: string | null;
  image_url: string | null;
};

export type DbHackathonPhoto = { id: string; hackathon_key: string; image_url: string };

function resizeImage(file: File, maxW = 1400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image"));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))), "image/jpeg", 0.85);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** Resizes the image, uploads it to Supabase Storage and returns its public URL. */
export async function uploadImage(file: File, folder: "projects" | "hackathons"): Promise<string> {
  if (!supabase) throw new Error("Database is not configured");
  const blob = await resizeImage(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OWNER_EMAIL, supabase, uploadImage } from "@/lib/supabase";

/** True only when the signed-in user is the portfolio owner. */
export function useOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (!supabase) return;
    const apply = (mail?: string | null) => {
      setEmail(mail ?? "");
      setIsOwner(mail?.toLowerCase() === OWNER_EMAIL.toLowerCase());
    };
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user.email));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => apply(session?.user.email));
    return () => data.subscription.unsubscribe();
  }, []);
  return { isOwner, email };
}

export function AdminLogin({ isOwner, email }: { isOwner: boolean; email: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!supabase) {
    return <div className="mb-10 border border-dashed border-foreground p-5 text-sm">Database not configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see README) to enable uploads.</div>;
  }
  if (isOwner) {
    return (
      <div className="mb-10 flex items-center justify-between border border-dashed border-foreground p-4 text-sm">
        <span>Owner mode — signed in as <strong>{email}</strong></span>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => supabase?.auth.signOut()}><LogOut className="h-4 w-4" />Sign out</Button>
      </div>
    );
  }
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    const { error: err } = await supabase!.auth.signInWithPassword({ email: String(data.get("email")), password: String(data.get("password")) });
    setBusy(false);
    if (err) setError(err.message);
  };
  return (
    <form onSubmit={onSubmit} className="mb-10 grid gap-3 border border-dashed border-foreground p-5 md:grid-cols-[1fr_1fr_auto]">
      <input name="email" type="email" className="field" placeholder="Owner email" required />
      <input name="password" type="password" className="field" placeholder="Password" required />
      <Button type="submit" disabled={busy} className="rounded-full">{busy ? "Signing in..." : "Owner sign in"}</Button>
      {error && <p className="text-sm text-destructive md:col-span-3">{error}</p>}
    </form>
  );
}

export function ProjectUploadForm({ onAdded }: { onAdded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("pname") ?? "").trim();
    if (!name || !supabase) return;
    setBusy(true); setStatus("");
    try {
      const image_url = file ? await uploadImage(file, "projects") : null;
      const { error } = await supabase.from("projects").insert({
        name,
        description: String(data.get("pdesc") ?? "").trim() || null,
        tech: String(data.get("ptech") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
        github: String(data.get("pgithub") ?? "").trim() || null,
        demo: String(data.get("pdemo") ?? "").trim() || null,
        image_url,
      });
      if (error) throw error;
      form.reset(); setFile(null); setStatus("Project added — it is now live for everyone."); onAdded();
    } catch (err) {
      setStatus(`Could not add project: ${err instanceof Error ? err.message : "unknown error"}`);
    }
    setBusy(false);
  };
  return (
    <div className="mb-12 border border-dashed border-foreground p-6">
      <h3 className="flex items-center gap-2 text-xl font-semibold"><ImagePlus className="h-5 w-5" />Add a project</h3>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <input name="pname" className="field" placeholder="Project name" required />
        <input name="ptech" className="field" placeholder="Tech used (comma separated)" />
        <input name="pgithub" className="field" placeholder="GitHub link (optional)" />
        <input name="pdemo" className="field" placeholder="Live demo link (optional)" />
        <textarea name="pdesc" rows={3} className="field resize-none md:col-span-2" placeholder="Short description" />
        <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} className="field md:col-span-2" />
        <Button type="submit" disabled={busy} className="rounded-full md:col-span-2">{busy ? "Uploading..." : "Add project"}</Button>
      </form>
      {status && <p className="mt-4 text-sm" aria-live="polite">{status}</p>}
    </div>
  );
}

export function HackathonPhotoUpload({ hackathonKey, onAdded }: { hackathonKey: string; onAdded: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !supabase) return;
    setBusy(true); setError("");
    try {
      for (const file of files) {
        const image_url = await uploadImage(file, "hackathons");
        const { error: err } = await supabase.from("hackathon_photos").insert({ hackathon_key: hackathonKey, image_url });
        if (err) throw err;
      }
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setBusy(false);
    event.target.value = "";
  };
  return (
    <div className="mt-3">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-foreground">
        <ImagePlus className="h-4 w-4" />{busy ? "Uploading..." : "Add photos"}
        <input type="file" accept="image/*" multiple className="hidden" onChange={onChange} disabled={busy} />
      </label>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

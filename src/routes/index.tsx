import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  Award,
  Braces,
  BrainCircuit,
  CheckCircle2,
  Circle,
  Code2,
  Database,
  FileText,
  FolderGit2,
  Globe,
  ImagePlus,
  Trash2,
  Trophy,
  Mail,
  Menu,
  Phone,
  Server,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLogin, HackathonPhotoUpload, ProjectUploadForm, useOwner } from "@/components/admin";
import { supabase, type DbHackathonPhoto, type DbProject } from "@/lib/supabase";
import {
  careerInterests,
  certificates,
  education,
  hackathons,
  journey,
  links,
  profile,
  projects,
  skills,
  type Project,
} from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tushar Gahlout — Backend Developer Portfolio" },
      { name: "description", content: "Portfolio of Tushar Gahlout, a B.Tech CSE student focused on backend development, databases, and scalable web applications." },
      { property: "og:title", content: "Tushar Gahlout — Backend Developer Portfolio" },
      { property: "og:description", content: "Explore Tushar Gahlout's backend development skills, education, projects, and learning journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const nav = ["About", "Education", "Skills", "Projects", "Hackathons", "Certificates", "Contact"];

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z" /></svg>;
}

function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" /></svg>;
}

const profileLinks = [
  { label: "GitHub", href: links.github, icon: <GithubIcon /> },
  { label: "LeetCode", href: links.leetcode, icon: <Code2 className="h-5 w-5" /> },
  { label: "LinkedIn", href: links.linkedin, icon: <LinkedinIcon /> },
  { label: "Email", href: links.email && `mailto:${links.email}`, icon: <Mail className="h-5 w-5" /> },
  { label: "Phone", href: links.phone && `tel:${links.phone}`, icon: <Phone className="h-5 w-5" /> },
];

function IconLink({ label, href, icon }: { label: string; href: string; icon: ReactNode }) {
  const classes = "inline-flex min-h-11 items-center gap-3 rounded-full border border-border bg-background px-5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-foreground";
  return href ? <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={classes}>{icon}{label}</a> : <span title={`${label} — coming soon`} className={`${classes} opacity-45`}>{icon}{label}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5" aria-label="Main navigation">
        <a href="#home" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium sm:text-sm"><span className="h-2.5 w-2.5 rounded-full bg-success" />Available for New Projects</a>
        <ul className="hidden gap-8 md:flex">{nav.map((item) => <li key={item}><a href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">{item}</a></li>)}</ul>
        <a href="#contact" className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground md:inline-flex">Let's talk <ArrowUpRight className="h-4 w-4" /></a>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <ul className="border-t border-border bg-background px-5 py-3 md:hidden">{nav.map((item) => <li key={item}><a onClick={() => setOpen(false)} href={`#${item.toLowerCase()}`} className="block py-3 font-medium">{item}</a></li>)}</ul>}
    </header>
  );
}

function Avatar() {
  return (
    <div className="relative mx-auto h-[210px] w-[210px] md:h-[340px] md:w-[340px]">
      <div className="portrait-ring absolute -inset-4 rounded-full" />
      <div className="avatar-orbit relative h-full w-full overflow-hidden rounded-full border border-foreground/10 bg-secondary shadow-portrait">
        {profile.photo ? (
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-8xl font-bold md:text-9xl">TG</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ id, eyebrow, title, children, muted = false }: { id: string; eyebrow: string; title: string; children: ReactNode; muted?: boolean }) {
  return <section id={id} className={`scroll-mt-20 border-t border-border py-20 md:py-28 ${muted ? "bg-muted" : "bg-background"}`}><div className="mx-auto max-w-6xl px-5"><p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{eyebrow}</p><h2 className="mt-3 font-display text-4xl font-bold md:text-6xl">{title}</h2><div className="mt-10">{children}</div></div></section>;
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete?: () => void }) {
  const linkCls = "inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4";
  return (
    <article className="border-t border-foreground pt-5">
      <div className="aspect-video overflow-hidden bg-secondary">{project.image ? <img src={project.image} alt={project.name} className="h-full w-full object-cover" /> : <FolderGit2 className="m-auto h-full w-12 text-muted-foreground" />}</div>
      <h3 className="mt-5 font-display text-2xl font-semibold">{project.name}</h3>
      <p className="mt-2 text-muted-foreground">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{project.tech.map((item) => <span key={item} className="chip">{item}</span>)}</div>
      {onDelete && <button type="button" onClick={onDelete} className="mt-4 inline-flex items-center gap-1.5 text-sm text-destructive"><Trash2 className="h-4 w-4" />Delete project</button>}
      {(project.github || project.demo) && <div className="mt-4 flex gap-5">{project.github && <a href={project.github} target="_blank" rel="noreferrer" className={linkCls}>GitHub <ArrowUpRight className="h-4 w-4" /></a>}{project.demo && <a href={project.demo} target="_blank" rel="noreferrer" className={linkCls}>Live demo <ArrowUpRight className="h-4 w-4" /></a>}</div>}
    </article>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Please enter a message").max(1000),
});

type FormStatus = "idle" | "sending" | "ok" | "err" | "fail" | "activate";

const CONTACT_EMAIL = "rajputtushar119@gmail.com";
// Free key from https://web3forms.com (enter your email, key arrives instantly). Set it in .env as VITE_WEB3FORMS_KEY.
const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) ?? "";

function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { nextErrors[String(issue.path[0])] = issue.message; });
      setErrors(nextErrors); setStatus("err"); return;
    }
    setErrors({}); setStatus("sending");
    try {
      const useWeb3 = Boolean(WEB3FORMS_KEY);
      const response = await fetch(useWeb3 ? "https://api.web3forms.com/submit" : `https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(
          useWeb3
            ? {
                access_key: WEB3FORMS_KEY,
                name: parsed.data.name,
                email: parsed.data.email,
                message: parsed.data.message,
                subject: `Portfolio message from ${parsed.data.name}`,
                from_name: "Portfolio Contact Form",
                replyto: parsed.data.email,
              }
            : {
                name: parsed.data.name,
                email: parsed.data.email,
                message: parsed.data.message,
                _subject: `Portfolio message from ${parsed.data.name}`,
                _replyto: parsed.data.email,
                _template: "table",
                _captcha: "false",
              },
        ),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string };
      const activation = result.message?.toLowerCase().includes("activat") ?? false;
      if (activation) { setStatus("activate"); return; }
      // Only report success when the provider explicitly confirms delivery.
      const sent = response.ok && (result.success === true || result.success === "true");
      if (!sent) throw new Error("Delivery failed");
      form.reset(); setStatus("ok");
    } catch { setStatus("fail"); }
  };
  const field = (name: string, label: string, control: ReactNode) => <div><label htmlFor={name} className="mb-2 block text-sm font-medium">{label}</label>{control}{errors[name] && <p id={`${name}-error`} className="mt-1.5 text-sm text-destructive">{errors[name]}</p>}</div>;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 border-t border-foreground pt-7">
      {field("name", "Name", <input id="name" name="name" className="field" placeholder="Your name" aria-invalid={Boolean(errors["name"])} aria-describedby={errors["name"] ? "name-error" : undefined} />)}
      {field("email", "Email", <input id="email" name="email" type="email" className="field" placeholder="you@example.com" aria-invalid={Boolean(errors["email"])} aria-describedby={errors["email"] ? "email-error" : undefined} />)}
      {field("message", "Message", <textarea id="message" name="message" rows={5} className="field resize-none" placeholder="Tell me about your project" aria-invalid={Boolean(errors["message"])} aria-describedby={errors["message"] ? "message-error" : undefined} />)}
      <Button type="submit" disabled={status === "sending"} size="lg" className="w-full rounded-full">{status === "sending" ? "Sending..." : "Send Message"}<ArrowUpRight /></Button>
      <div aria-live="polite">
        {status === "ok" && <p className="flex items-center gap-2 bg-accent p-3 text-sm text-accent-foreground"><CheckCircle2 className="h-4 w-4" />Thank you! Your message has been sent successfully.</p>}
        {status === "err" && <p className="bg-destructive/10 p-3 text-sm text-destructive">Please fix the highlighted fields above.</p>}
        {status === "fail" && <p className="bg-destructive/10 p-3 text-sm text-destructive">Could not send the message. Please email me directly at <a className="underline font-medium" href={`mailto:${links.email}`}>{links.email}</a>.</p>}
        {status === "activate" && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-2">
            <p className="font-semibold">⚠️ One-time activation required</p>
            <p>formsubmit.co sent a confirmation email to <strong>{CONTACT_EMAIL}</strong>. Open that email and click the activation link — after that, the form will work for all visitors.</p>
            <p>In the meantime, reach me directly: <a className="underline font-medium" href={`mailto:${links.email}`}>{links.email}</a>.</p>
          </div>
        )}
      </div>
    </form>
  );
}

const skillIcons: Record<string, ReactNode> = {
  "Programming Languages": <Braces />, "Web Development": <Globe />, Database: <Database />, "Tools & Platforms": <Wrench />, "AI & ML": <BrainCircuit />, "Computer Science": <Terminal />,
};

function Index() {
  const [admin, setAdmin] = useState(false);
  const { isOwner, email } = useOwner();
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [dbPhotos, setDbPhotos] = useState<DbHackathonPhoto[]>([]);
  const load = useCallback(async () => {
    if (!supabase) return;
    const [p, h] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: true }),
      supabase.from("hackathon_photos").select("*").order("created_at", { ascending: true }),
    ]);
    if (p.data) setDbProjects(p.data as DbProject[]);
    if (h.data) setDbPhotos(h.data as DbHackathonPhoto[]);
  }, []);
  useEffect(() => {
    setAdmin(new URLSearchParams(window.location.search).has("admin"));
    void load();
  }, [load]);
  const removeProject = async (id: string) => {
    if (!supabase || !window.confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    void load();
  };
  const removePhoto = async (id: string) => {
    if (!supabase || !window.confirm("Remove this photo?")) return;
    await supabase.from("hackathon_photos").delete().eq("id", id);
    void load();
  };
  const toProject = (row: DbProject): Project => ({ name: row.name, description: row.description ?? "", tech: row.tech ?? [], image: row.image_url ?? undefined, github: row.github ?? undefined, demo: row.demo ?? undefined });
  const extraLinks = [
    { label: "Portfolio / Website", href: links.website, icon: <Globe className="h-4 w-4" /> },
    { label: "Resume / CV", href: links.resume, icon: <FileText className="h-4 w-4" /> },
    ...links.other.map((item) => ({ label: item.label, href: item.url, icon: <Globe className="h-4 w-4" /> })),
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="home" className="relative min-h-[calc(100vh-5rem)] scroll-mt-20 overflow-hidden border-b border-border">
          <div className="hero-scrim absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 pt-10 md:pt-8">
            <h1 className="relative z-10 text-center font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none"><span className="text-outline">Tushar</span> Gahlout</h1>
            <div className="relative mt-5 grid items-end gap-6 pb-8 md:mt-3 md:gap-8 md:grid-cols-[1fr_1.2fr_1fr] md:pb-0">
              <div className="order-2 pb-4 md:order-1 md:pb-20"><p className="text-2xl font-bold md:text-3xl">Backend Developer</p><p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">Building reliable, scalable web applications with a focus on server-side systems and databases.</p><a href="#contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Let's collaborate <ArrowUpRight className="h-4 w-4" /></a></div>
              <div className="order-1 md:order-2"><Avatar /></div>
              <div className="order-3 flex flex-wrap gap-3 pb-8 md:flex-col md:items-end md:pb-16">{profileLinks.filter((item) => item.label !== "Phone").map((item) => <IconLink key={item.label} {...item} />)}</div>
            </div>
          </div>
        </section>

        <Section id="about" eyebrow="01 / About" title="About Me" muted><div className="grid gap-12 md:grid-cols-[1.5fr_1fr]"><div className="space-y-5 text-lg leading-relaxed text-muted-foreground">{profile.about.map((item) => <p key={item}>{item}</p>)}</div><div className="border-t border-foreground pt-5"><h3 className="flex items-center gap-2 text-xl font-semibold"><Server className="h-5 w-5" />Career Goal</h3><div className="mt-5 flex flex-wrap gap-2">{careerInterests.map((item) => <span key={item} className="chip">{item}</span>)}</div></div></div></Section>

        <Section id="education" eyebrow="02 / Education" title="Education"><div className="divide-y divide-border border-y border-border">{education.map((item, index) => <article key={item.degree} className="grid gap-3 py-7 md:grid-cols-[5rem_1fr_auto] md:items-center"><span className="font-mono text-sm text-muted-foreground">0{index + 1}</span><div><h3 className="text-lg font-semibold">{item.degree}</h3><p className="mt-1 text-muted-foreground">{item.school}</p></div><div className="flex flex-wrap gap-2">{item.details.map((detail) => <span key={detail} className="chip">{detail}</span>)}</div></article>)}</div></Section>

        <Section id="skills" eyebrow="03 / Skills" title="Technical Toolkit" muted><div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">{skills.map((skill) => <article key={skill.category} className="bg-background p-7"><span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border">{skillIcons[skill.category] ?? <Code2 />}</span><h3 className="mt-7 text-xl font-semibold">{skill.category}</h3><div className="mt-5 flex flex-wrap gap-2">{skill.items.map((item) => <span key={item} className="chip">{item}</span>)}</div></article>)}</div></Section>

        <Section id="projects" eyebrow="04 / Projects" title="Selected Work">{admin && <AdminLogin isOwner={isOwner} email={email} />}{admin && isOwner && <ProjectUploadForm onAdded={load} />}{projects.length + dbProjects.length ? <div className="grid gap-8 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.name} project={project} />)}{dbProjects.map((row) => <ProjectCard key={row.id} project={toProject(row)} onDelete={isOwner ? () => removeProject(row.id) : undefined} />)}</div> : <div className="grid items-center gap-8 border-y border-border py-10 md:grid-cols-[auto_1fr_auto]"><FolderGit2 className="h-12 w-12" /><div><h3 className="text-2xl font-semibold">Projects are coming soon</h3><p className="mt-2 text-muted-foreground">I'm preparing clear write-ups for the work I'm building.</p></div><span className="font-mono text-sm text-muted-foreground">IN PROGRESS</span></div>}</Section>

        <Section id="hackathons" eyebrow="05 / Hackathons" title="Hackathon Wins"><div className="grid gap-8 md:grid-cols-2">{hackathons.map((item) => <article key={item.name} className="border-t border-foreground pt-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border"><Trophy className="h-5 w-5" /></span><span className="chip">{item.level}</span></div>{(() => {
              const uploaded = dbPhotos.filter((photo) => photo.hackathon_key === item.name);
              const all = [...item.photos.map((src) => ({ id: "", src })), ...uploaded.map((photo) => ({ id: photo.id, src: photo.image_url }))];
              return (
                <>
                  {all.length ? <div className={`mt-6 grid gap-2 ${all.length > 1 ? "grid-cols-2" : ""}`}>{all.map((photo) => <div key={photo.src} className="relative"><img src={photo.src} alt={`${item.name} journey`} className="max-h-[28rem] w-full bg-secondary object-contain" />{isOwner && photo.id && <button type="button" aria-label="Remove photo" onClick={() => removePhoto(photo.id)} className="absolute right-2 top-2 rounded-full bg-background p-1.5 text-destructive shadow"><Trash2 className="h-4 w-4" /></button>}</div>)}</div> : <div className="mt-6 flex aspect-video flex-col items-center justify-center gap-2 border border-dashed border-border bg-secondary text-muted-foreground"><ImagePlus className="h-8 w-8" /><span className="text-sm">Journey photo coming soon</span></div>}
                  {isOwner && <HackathonPhotoUpload hackathonKey={item.name} onAdded={load} />}
                </>
              );
            })()}<h3 className="mt-6 font-display text-2xl font-semibold">{item.name}</h3><p className="mt-2 text-sm text-muted-foreground">{item.organizer}</p><p className="mt-5 text-3xl font-bold">{item.result}</p><p className="mt-1 font-mono text-lg">{item.prize} prize</p><p className="mt-4 text-muted-foreground">{item.description}</p></article>)}</div></Section>

        <Section id="certificates" eyebrow="06 / Certificates" title="Certificates" muted><div className="grid gap-8 sm:grid-cols-2">{certificates.map((cert) => <article key={cert.image} className="border-t border-foreground pt-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border"><Award className="h-5 w-5" /></span><span className="chip">{cert.date}</span></div><a href={cert.image} target="_blank" rel="noreferrer" aria-label={`View ${cert.title} certificate`} className="mt-6 block overflow-hidden border border-border bg-secondary"><img src={cert.image} alt={`${cert.title} — ${cert.type}`} loading="lazy" className="aspect-[4/3] w-full object-contain transition hover:scale-[1.02]" /></a><h3 className="mt-6 font-display text-xl font-semibold">{cert.title}</h3><p className="mt-1 font-medium">{cert.type}</p><p className="mt-2 text-sm text-muted-foreground">{cert.issuer}</p></article>)}</div></Section>

        <Section id="journey" eyebrow="07 / Journey" title="Learning Path" muted><div className="grid gap-px border border-border bg-border md:grid-cols-3">{journey.map((item, index) => <article key={item.stage} className="bg-background p-7"><span className="font-mono text-sm text-muted-foreground">0{index + 1}</span><h3 className="mt-5 text-2xl font-semibold">{item.stage}</h3><ul className="mt-5 space-y-3">{item.items.map((entry) => <li key={entry} className="flex items-start gap-3 text-muted-foreground"><Circle className="mt-2 h-2 w-2 shrink-0 fill-current" />{entry}</li>)}</ul></article>)}</div></Section>

        <Section id="contact" eyebrow="08 / Contact" title="Let's Build Something"><div className="grid gap-14 md:grid-cols-2"><div><p className="max-w-md text-xl leading-relaxed text-muted-foreground">Open to internships, college opportunities, and collaborations. Tell me what you are working on.</p><div className="mt-9 flex flex-wrap gap-3">{[...profileLinks, ...extraLinks].map((item) => <IconLink key={item.label} {...item} />)}</div></div><ContactForm /></div></Section>
      </main>
      <footer className="bg-primary py-10 text-primary-foreground"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-5 md:flex-row"><div><p className="text-xl font-bold">{profile.name}</p><p className="text-sm opacity-70">Aspiring Backend Developer</p></div><p className="text-sm opacity-70">©️ {new Date().getFullYear()} {profile.name}. All rights reserved.</p></div></footer>
    </div>
  );
}
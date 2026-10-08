import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Boxes,
  Braces,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileText,
  FolderGit2,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Server,
  Share2,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  Trophy,
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
  type Certificate,
  type Project,
} from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tushar Gahlout — Backend & Software Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Tushar Gahlout, B.Tech CSE (AI & ML) student specializing in Backend Development, Scalable Databases, and High-Performance APIs.",
      },
      { property: "og:title", content: "Tushar Gahlout — Backend & Software Engineer" },
      {
        property: "og:description",
        content:
          "Discover Tushar Gahlout's backend systems, competitive hackathon wins, AI/ML skills, and developer projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModernPortfolio,
});

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Hackathons", href: "#hackathons" },
  { name: "Certificates", href: "#certificates" },
  { name: "Journey", href: "#journey" },
  { name: "Contact", href: "#contact" },
];

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
    </svg>
  );
}

function LeetCodeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .271 3.543 5.629 5.629 0 0 0 2.223 2.662l4.069 2.755.08.056 1.41 1.054a1.378 1.378 0 0 0 1.905-.246 1.37 1.37 0 0 0-.25-1.905l-1.41-1.054a2.89 2.89 0 0 1-1.14-1.365 2.81 2.81 0 0 1-.137-1.815 2.7 2.7 0 0 1 .618-1.077L14.52 9.8a1.37 1.37 0 0 0-.002-1.942 1.377 1.377 0 0 0-1.035-.41zM9.465 8.869a1.372 1.372 0 0 0-.969.402L4.01 13.757a1.376 1.376 0 1 0 1.947 1.946l4.486-4.486a1.37 1.37 0 0 0-.978-2.348zm6.543 4.148h-8.02a1.375 1.375 0 1 0 0 2.75h8.02a1.375 1.375 0 1 0 0-2.75z" />
    </svg>
  );
}

function Navbar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="group flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-sm text-foreground transition-transform duration-300 group-hover:scale-105 group-hover:border-emerald-500/60 shadow-sm">
            <span className="text-emerald-400">&lt;</span>TG<span className="text-cyan-400">/&gt;</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-base leading-none text-foreground tracking-tight">
              Tushar Gahlout
            </p>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Backend Dev
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-card/60 backdrop-blur-lg border border-border/70 rounded-full px-4 py-1.5 shadow-sm">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            className="h-9 w-9 rounded-full border border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-all duration-200 shadow-sm hover:scale-[1.02]"
          >
            <span>Let's Connect</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-full border border-border/70 bg-card/60 flex items-center justify-center text-foreground"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 mx-4 p-5 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/80 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="flex gap-2">
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
              >
                <GithubIcon />
              </a>
              <a
                href={links.leetcode}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
              >
                <LeetCodeIcon />
              </a>
            </div>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-foreground text-background"
            >
              Contact Me <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Please enter a message").max(1000),
});

type FormStatus = "idle" | "sending" | "ok" | "err" | "fail" | "activate";

function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const web3FormsKey = (import.meta.env as Record<string, string | undefined>)["VITE_WEB3FORMS_KEY"] ?? "";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      setStatus("err");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      if (web3FormsKey) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: parsed.data.name,
            email: parsed.data.email,
            message: parsed.data.message,
            subject: `Portfolio inquiry from ${parsed.data.name}`,
            from_name: "Portfolio Contact Form",
            replyto: parsed.data.email,
          }),
        });
        const result = (await response.json().catch(() => ({}))) as { success?: boolean | string };
        if (response.ok && (result.success === true || result.success === "true")) {
          form.reset();
          setStatus("ok");
          return;
        }
      }

      // Relayed via validated same-origin API route per LOVABLE agent architecture
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; code?: string };
      if (response.status === 409 || result.code === "activation_required") {
        setStatus("activate");
        return;
      }
      if (!response.ok || !result.ok) {
        throw new Error(result.code ?? "Failed");
      }

      form.reset();
      setStatus("ok");
    } catch {
      setStatus("fail");
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-border/80">
      <div className="flex items-center gap-2 mb-6">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="font-display text-xl font-bold text-foreground">Send a Direct Message</h3>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            className="field"
            placeholder="Alex Rivera"
            aria-invalid={Boolean(errors["name"])}
          />
          {errors["name"] && <p className="mt-1 text-xs text-rose-500">{errors["name"]}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            placeholder="alex@domain.com"
            aria-invalid={Boolean(errors["email"])}
          />
          {errors["email"] && <p className="mt-1 text-xs text-rose-500">{errors["email"]}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            Project Details or Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="field resize-none"
            placeholder="Let's build something scalable together..."
            aria-invalid={Boolean(errors["message"])}
          />
          {errors["message"] && <p className="mt-1 text-xs text-rose-500">{errors["message"]}</p>}
        </div>

        <Button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl py-6 font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
        >
          {status === "sending" ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Transmitting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Send Message <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        <div aria-live="polite">
          {status === "ok" && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 mt-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Thank you! Your message was delivered successfully. I'll get back to you promptly.</span>
            </div>
          )}
          {status === "err" && (
            <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mt-3">
              Please check and complete the required fields above.
            </p>
          )}
          {status === "fail" && (
            <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mt-3">
              Transmission failed. Please reach out directly to{" "}
              <a href={`mailto:${links.email}`} className="underline font-semibold">
                {links.email}
              </a>
              .
            </p>
          )}
          {status === "activate" && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5 mt-3">
              <p className="font-semibold">⚠️ Initial Setup Confirmation Required</p>
              <p>Form backend sent an activation verification to {links.email}. Click that email link once to activate visitor submissions.</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function CertificateModal({
  certificate,
  onClose,
}: {
  certificate: Certificate | null;
  onClose: () => void;
}) {
  if (!certificate) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-card rounded-2xl border border-border/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60">
          <div>
            <h3 className="font-display font-bold text-base text-foreground leading-tight">
              {certificate.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{certificate.type}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 bg-background/50 flex justify-center max-h-[70vh] overflow-auto">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="rounded-lg object-contain max-h-[60vh] w-auto shadow-md"
          />
        </div>

        <div className="px-6 py-4 border-t border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{certificate.issuer} • {certificate.date}</span>
          <a
            href={certificate.image}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline"
          >
            Open Original <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ModernPortfolio() {
  const [admin, setAdmin] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { isOwner, email } = useOwner();
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [dbPhotos, setDbPhotos] = useState<DbHackathonPhoto[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [skillsFilter, setSkillsFilter] = useState<string>("All");
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Sync theme
  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(isDarkClass);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
    }
  };

  const copyEmail = () => {
    void navigator.clipboard.writeText(links.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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

  const toProject = (row: DbProject): Project => ({
    name: row.name,
    description: row.description ?? "",
    tech: row.tech ?? [],
    image: row.image_url ?? undefined,
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    category: "Backend",
  });

  const allProjects: Project[] = [
    ...projects,
    ...dbProjects.map((row) => toProject(row)),
  ];

  const filteredProjects =
    projectFilter === "All"
      ? allProjects
      : allProjects.filter((p) => p.category?.toLowerCase() === projectFilter.toLowerCase());

  const categoryList = ["All", ...skills.map((s) => s.category)];
  const filteredSkills =
    skillsFilter === "All" ? skills : skills.filter((s) => s.category === skillsFilter);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-emerald-500/20">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* Background Ambient Orbs */}
      <div className="glow-orb -top-20 -left-20 h-[500px] w-[500px] bg-emerald-500/20" />
      <div className="glow-orb top-1/4 -right-20 h-[550px] w-[550px] bg-cyan-500/15" />
      <div className="glow-orb top-2/3 left-1/3 h-[600px] w-[600px] bg-indigo-500/10" />

      <main className="relative z-10 pt-24 sm:pt-28">
        {/* ===================== HERO SECTION ===================== */}
        <section id="home" className="tech-grid-bg relative overflow-hidden py-16 sm:py-24 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines & Actions */}
              <div className="lg:col-span-6 space-y-6">
                {/* Live Status Pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-mono font-medium text-emerald-400 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Available for Internships & Projects</span>
                </div>

                {/* Big Headline */}
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
                  Architecting <br />
                  <span className="text-gradient-accent">Scalable Backend</span> <br />
                  Systems & APIs
                </h1>

                {/* Intro summary */}
                <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Hi, I'm <strong className="text-foreground font-semibold">Tushar Gahlout</strong> — a B.Tech CSE (AI & ML)
                  student at Graphic Era Hill University. I specialize in server-side architecture, high-throughput REST APIs,
                  database optimization, and intelligent machine learning systems.
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    <span>View Projects</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border/80 hover:border-foreground/30 text-foreground font-medium text-sm transition-all hover:bg-foreground/5"
                  >
                    <span>Get in Touch</span>
                  </a>

                  <div className="h-6 w-px bg-border/80 mx-1 hidden sm:block" />

                  {/* Social Quick Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub profile"
                      className="p-3 rounded-xl bg-card/60 border border-border/70 hover:border-foreground/40 text-muted-foreground hover:text-foreground transition-all hover:-translate-y-0.5"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>

                    <a
                      href={links.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LeetCode profile"
                      className="p-3 rounded-xl bg-card/60 border border-border/70 hover:border-amber-500/50 text-muted-foreground hover:text-amber-400 transition-all hover:-translate-y-0.5"
                    >
                      <LeetCodeIcon className="h-4 w-4" />
                    </a>

                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                      className="p-3 rounded-xl bg-card/60 border border-border/70 hover:border-emerald-500/50 text-muted-foreground hover:text-emerald-400 transition-all hover:-translate-y-0.5 relative group"
                    >
                      {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Mail className="h-4 w-4" />}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono bg-popover text-popover-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {copiedEmail ? "Copied!" : "Copy email"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Mini tech badge row */}
                <div className="pt-3 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">Core Stack:</span>
                  {["Node.js", "Express", "SQL", "Python", "C++", "REST APIs"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-card/70 border border-border/70 text-foreground font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Large High-Tech Portrait & Details */}
              <div className="lg:col-span-6 relative flex flex-col items-center">
                {/* Glowing ambient halo behind the photo */}
                <div className="absolute inset-0 max-w-[460px] mx-auto bg-gradient-to-tr from-emerald-500/25 via-cyan-500/20 to-indigo-500/25 rounded-3xl blur-3xl -z-10" />

                <div className="glass-card rounded-3xl p-5 sm:p-7 w-full max-w-[460px] border border-border/80 shadow-2xl relative space-y-5">
                  {/* Large High-Res Portrait Frame */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 shadow-2xl group">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center font-display font-bold text-7xl text-emerald-400">
                        TG
                      </div>
                    )}

                    {/* Gradient shade on bottom of photo for text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                    {/* Floating Glass Badges */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="font-mono text-xs font-semibold text-emerald-400">Open to Work</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg text-amber-300 font-mono text-xs font-semibold">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      <span>2x Hackathon Win</span>
                    </div>

                    {/* Bottom overlay inside photo */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div>
                        <h2 className="font-display font-bold text-lg text-white leading-tight drop-shadow-md">
                          {profile.name}
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Graphic Era Hill University, Bhimtal
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full font-semibold backdrop-blur-md">
                        B.Tech AI & ML
                      </span>
                    </div>
                  </div>

                  {/* Interactive Code snippet preview */}
                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto shadow-inner">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="h-3.5 w-3.5 text-emerald-400" /> developer.config.ts
                      </span>
                      <span className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500/70" />
                        <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                      </span>
                    </div>
                    <p className="text-slate-500">// Real-time Profile Status</p>
                    <p>
                      <span className="text-cyan-400">export const</span> engineer = &#123;
                    </p>
                    <p className="pl-4">
                      name: <span className="text-emerald-300">"Tushar Gahlout"</span>,
                    </p>
                    <p className="pl-4">
                      role: <span className="text-emerald-300">"Backend Developer & AI/ML Specialist"</span>,
                    </p>
                    <p className="pl-4">
                      stack: [<span className="text-amber-300">"Node.js"</span>, <span className="text-amber-300">"SQL"</span>, <span className="text-amber-300">"Python"</span>, <span className="text-amber-300">"C++"</span>],
                    </p>
                    <p className="pl-4">
                      location: <span className="text-cyan-400">"Bhimtal, India"</span>,
                    </p>
                    <p>&#125;;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== METRICS BANNER ===================== */}
        <section className="py-10 border-b border-border/50 bg-card/30">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Academic Standing", value: "3rd Sem", sub: "Graphic Era Hill Univ.", icon: <GraduationCap className="h-5 w-5 text-emerald-400" /> },
                { label: "Hackathon Podiums", value: "2x Winner", sub: "National & Univ. Level", icon: <Trophy className="h-5 w-5 text-amber-400" /> },
                { label: "Problem Solving", value: "500+ Solved", sub: "Data Structures & Algos", icon: <Code2 className="h-5 w-5 text-cyan-400" /> },
                { label: "System Focus", value: "Scalable APIs", sub: "High Availability & DBs", icon: <Server className="h-5 w-5 text-indigo-400" /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:border-foreground/20"
                >
                  <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/80 flex items-center justify-center shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="font-display font-bold text-xl sm:text-2xl text-foreground leading-tight">{stat.value}</p>
                    <p className="text-xs font-medium text-foreground/80 mt-0.5">{stat.label}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== ABOUT SECTION (BENTO GRID) ===================== */}
        <section id="about" className="py-20 sm:py-28 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 01 / Identity
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-2">
                About Me & Vision
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Main Story Card */}
              <div className="lg:col-span-7 glass-card rounded-3xl p-7 sm:p-9 space-y-5 border border-border/80">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                  <Terminal className="h-4 w-4" /> The Journey & Motivation
                </div>
                {profile.about.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}

                <div className="pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <MapPin className="h-4 w-4 text-emerald-400" /> Bhimtal, Uttarakhand, India
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <BookOpen className="h-4 w-4 text-cyan-400" /> Graphic Era Hill University
                  </div>
                </div>
              </div>

              {/* Career Goal & Interests Bento */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-card rounded-3xl p-7 border border-border/80 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
                    <Server className="h-4 w-4" /> Career Specialization
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Backend & Scalable Systems Engineer
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Focused on creating high-performance services, efficient data layers, reliable background jobs, and robust APIs.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {careerInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-border/80 transition-colors"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-border/80 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase">Interested in Collaboration?</p>
                    <p className="text-base font-bold font-display text-foreground mt-0.5">Let's discuss opportunities</p>
                  </div>
                  <a
                    href="#contact"
                    className="p-3 rounded-xl bg-foreground text-background hover:scale-105 transition-all shadow-md shrink-0"
                    aria-label="Contact directly"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SKILLS SECTION ===================== */}
        <section id="skills" className="py-20 sm:py-28 border-b border-border/50 bg-card/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 02 / Capabilities
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-2">
                  Technical Toolkit
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-card/80 p-1.5 rounded-2xl border border-border/80 backdrop-blur-md">
                {categoryList.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSkillsFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      skillsFilter === cat
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((group) => {
                const getIcon = () => {
                  switch (group.category) {
                    case "Programming Languages":
                      return <Braces className="h-5 w-5 text-emerald-400" />;
                    case "Web Development":
                      return <Globe className="h-5 w-5 text-cyan-400" />;
                    case "Database":
                      return <Database className="h-5 w-5 text-amber-400" />;
                    case "Tools & Platforms":
                      return <Wrench className="h-5 w-5 text-indigo-400" />;
                    case "AI & ML":
                      return <BrainCircuit className="h-5 w-5 text-rose-400" />;
                    case "Computer Science":
                      return <Terminal className="h-5 w-5 text-purple-400" />;
                    default:
                      return <Code2 className="h-5 w-5 text-emerald-400" />;
                  }
                };

                return (
                  <div
                    key={group.category}
                    className="glass-card rounded-3xl p-6 sm:p-7 border border-border/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-foreground/5 border border-border/80 flex items-center justify-center">
                          {getIcon()}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {group.items.length} tools
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-4">
                        {group.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-border/70 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== PROJECTS SECTION ===================== */}
        <section id="projects" className="py-20 sm:py-28 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 03 / Selected Work
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-2">
                  Featured Projects
                </h2>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 bg-card/80 p-1.5 rounded-2xl border border-border/80 backdrop-blur-md">
                {["All", "Backend", "AI & ML", "Database", "Algorithms"].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setProjectFilter(category)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      projectFilter === category
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Controls */}
            {admin && <AdminLogin isOwner={isOwner} email={email} />}
            {admin && isOwner && <ProjectUploadForm onAdded={load} />}

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProjects.map((project, index) => {
                const dbRow = dbProjects.find((p) => p.name === project.name);
                return (
                  <article
                    key={project.name + index}
                    className="glass-card rounded-3xl p-7 border border-border/80 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top banner / image / mock */}
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-border/70 mb-6 flex items-center justify-center p-6">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-center space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                              <Server className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                {project.category ?? "Backend System"}
                              </span>
                              <p className="font-display font-semibold text-sm text-slate-300">
                                Scalable Architecture
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                          {project.name}
                        </h3>
                        {project.category && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-muted-foreground">
                            {project.category}
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-foreground/5 text-foreground border border-border/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-emerald-400 transition-colors"
                          >
                            <GithubIcon className="h-4 w-4" /> Code Repository
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" /> Live Demo
                          </a>
                        )}
                      </div>

                      {isOwner && dbRow && (
                        <button
                          type="button"
                          onClick={() => void removeProject(dbRow.id)}
                          className="text-xs text-rose-500 hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== HACKATHONS SECTION ===================== */}
        <section id="hackathons" className="py-20 sm:py-28 border-b border-border/50 bg-card/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="font-mono text-xs uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 04 / Competitions & Awards
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-2">
                Hackathon Podiums
              </h2>
              <p className="text-muted-foreground mt-2">
                Building solutions under strict time limits, solving high-impact problems, and earning recognition.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {hackathons.map((hackathon) => {
                const uploaded = dbPhotos.filter((p) => p.hackathon_key === hackathon.name);
                const allPhotos = [
                  ...hackathon.photos.map((src) => ({ id: "", src })),
                  ...uploaded.map((p) => ({ id: p.id, src: p.image_url })),
                ];

                return (
                  <article
                    key={hackathon.name}
                    className="glass-card rounded-3xl p-7 sm:p-8 border border-border/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Trophy className="h-6 w-6" />
                        </div>
                        <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
                          {hackathon.level}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-bold text-foreground">
                        {hackathon.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{hackathon.organizer}</p>

                      <div className="my-6 p-4 rounded-2xl bg-foreground/5 border border-border/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-mono">Result Achieved</p>
                          <p className="font-display font-extrabold text-2xl text-foreground mt-0.5">
                            {hackathon.result}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-mono">Award Purse</p>
                          <p className="font-mono font-bold text-xl text-emerald-400 mt-0.5">
                            {hackathon.prize}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {hackathon.description}
                      </p>

                      {/* Photo showcase */}
                      {allPhotos.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {allPhotos.map((photo) => (
                            <div key={photo.src} className="relative rounded-xl overflow-hidden border border-border">
                              <img
                                src={photo.src}
                                alt={`${hackathon.name} event`}
                                className="aspect-video w-full object-cover"
                              />
                              {isOwner && photo.id && (
                                <button
                                  type="button"
                                  onClick={() => void removePhoto(photo.id)}
                                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:text-rose-300"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {isOwner && (
                        <HackathonPhotoUpload hackathonKey={hackathon.name} onAdded={load} />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== CERTIFICATES SECTION ===================== */}
        <section id="certificates" className="py-20 sm:py-28 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 05 / Credentials
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-2">
                  Certificates & Accreditations
                </h2>
                <p className="text-muted-foreground mt-2">
                  Click on any certificate to preview in full resolution.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <article
                  key={cert.title + cert.type}
                  className="glass-card rounded-3xl p-5 border border-border/80 flex flex-col justify-between group cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                >
                  <div>
                    {/* Certificate Thumbnail Preview */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border mb-4">
                      <img
                        src={cert.image}
                        alt={`${cert.title} — ${cert.type}`}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-foreground text-background shadow">
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Verified
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{cert.date}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-foreground leading-snug line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-400 mt-1">{cert.type}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cert.issuer}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground">
                    <span>Click to view</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== EDUCATION & JOURNEY ===================== */}
        <section id="journey" className="py-20 sm:py-28 border-b border-border/50 bg-card/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Education Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 06 / Academics
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2">
                    Formal Education
                  </h2>
                </div>

                <div className="space-y-4 pt-2">
                  {education.map((item, idx) => (
                    <div
                      key={item.degree}
                      className="glass-card rounded-2xl p-6 border border-border/80 flex items-start gap-4"
                    >
                      <div className="h-10 w-10 rounded-xl bg-foreground/5 border border-border/80 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 shrink-0">
                        0{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-foreground">
                          {item.degree}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{item.school}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.details.map((detail) => (
                            <span
                              key={detail}
                              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-foreground/5 border border-border/70 text-foreground"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Journey & Roadmap Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> 07 / Roadmap
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2">
                    Evolution & Aspirations
                  </h2>
                </div>

                <div className="space-y-4 pt-2">
                  {journey.map((step, idx) => (
                    <div
                      key={step.stage}
                      className="glass-card rounded-2xl p-6 border border-border/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                          Phase 0{idx + 1}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {step.stage}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {step.items.map((entry) => (
                          <span
                            key={entry}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground/5 border border-border/70 text-foreground"
                          >
                            {entry}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== CONTACT SECTION ===================== */}
        <section id="contact" className="py-20 sm:py-28 relative">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Info & Socials */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 08 / Get in Touch
                  </p>
                  <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">
                    Let's Build Together.
                  </h2>
                  <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                    I am actively seeking backend engineering internships, collaborative development projects, and technical opportunities. Feel free to ping me directly or fill out the form.
                  </p>
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-3">
                  <div className="glass-card rounded-2xl p-4 border border-border/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">Email</p>
                        <a
                          href={`mailto:${links.email}`}
                          className="font-medium text-sm text-foreground hover:underline"
                        >
                          {links.email}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Copy email"
                    >
                      {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {links.phone && (
                    <div className="glass-card rounded-2xl p-4 border border-border/80 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">Phone</p>
                        <a
                          href={`tel:${links.phone}`}
                          className="font-medium text-sm text-foreground hover:underline"
                        >
                          +91 {links.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="glass-card rounded-2xl p-4 border border-border/80 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-mono">Location</p>
                      <p className="font-medium text-sm text-foreground">Bhimtal, Uttarakhand, India</p>
                    </div>
                  </div>
                </div>

                {/* Profiles row */}
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase mb-3">Professional Profiles</p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/80 hover:border-foreground text-sm font-medium transition-all"
                    >
                      <GithubIcon className="h-4 w-4" /> GitHub
                    </a>
                    <a
                      href={links.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/80 hover:border-amber-400 text-sm font-medium transition-all"
                    >
                      <LeetCodeIcon className="h-4 w-4" /> LeetCode
                    </a>
                    {links.linkedin && (
                      <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/80 hover:border-cyan-400 text-sm font-medium transition-all"
                      >
                        <LinkedinIcon className="h-4 w-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border/50 bg-card/60 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-xs text-foreground">
              TG
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{profile.name}</p>
              <p className="text-xs">Backend Developer • B.Tech CSE (AI & ML)</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            {navLinks.slice(0, 5).map((l) => (
              <a key={l.name} href={l.href} className="hover:text-foreground transition-colors">
                {l.name}
              </a>
            ))}
          </div>

          <p className="text-xs">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
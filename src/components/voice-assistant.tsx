import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Download,
  ExternalLink,
  HelpCircle,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Play,
  Radio,
  Send,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { profile, projects, skills, education, hackathons, links } from "@/data/portfolio";

// Web Speech API interfaces
interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SpeechRecognition?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webkitSpeechRecognition?: any;
}

type Message = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  action?: {
    label: string;
    targetId?: string | undefined;
    url?: string | undefined;
  } | undefined;
};

const quickSuggestions = [
  "Tell me about Tushar",
  "Show me your projects",
  "What are your technical skills?",
  "Tell me about hackathon wins",
  "Download Resume",
  "How can I contact you?",
];

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  quality: "HD" | "Standard";
}

export function VoiceAssistant({ onToggleTheme }: { onToggleTheme?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      sender: "assistant",
      text: `Hi! I'm Tushar's AI Assistant. You can speak to me or type questions about his projects, skills, resume, or hackathons.`,
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Load and pick the highest clarity voice available
  const updateVoices = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    // Filter to English voices
    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
    const listToUse = englishVoices.length > 0 ? englishVoices : voices;
    setAvailableVoices(listToUse);

    // Pick best voice if not already picked or valid
    setSelectedVoiceURI((currentURI) => {
      if (currentURI && listToUse.some((v) => v.voiceURI === currentURI)) {
        return currentURI;
      }

      // Priority list of crystal-clear high quality voices
      const priorityMatches = [
        (v: SpeechSynthesisVoice) => /natural|neural|online|premium|enhanced/i.test(v.name) && v.lang.startsWith("en"),
        (v: SpeechSynthesisVoice) => /google us english/i.test(v.name),
        (v: SpeechSynthesisVoice) => /google uk english female/i.test(v.name),
        (v: SpeechSynthesisVoice) => /samantha/i.test(v.name),
        (v: SpeechSynthesisVoice) => /daniel/i.test(v.name),
        (v: SpeechSynthesisVoice) => /serena|karen|victoria|ava/i.test(v.name),
        (v: SpeechSynthesisVoice) => /jenny|aria|guy/i.test(v.name),
        (v: SpeechSynthesisVoice) => v.lang === "en-US",
        (v: SpeechSynthesisVoice) => v.lang === "en-GB",
        (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
      ];

      for (const matcher of priorityMatches) {
        const found = listToUse.find(matcher);
        if (found) return found.voiceURI;
      }

      return listToUse[0]?.voiceURI || "";
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      updateVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSpeaking]);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/[*_#`[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/B\.Tech/gi, "B-Tech")
      .replace(/AI & ML/gi, "A.I. and Machine Learning")
      .replace(/CGPA (\d+\.\d+)\/10/gi, "CGPA of $1 out of 10")
      .replace(/CGPA (\d+\.\d+)/gi, "CGPA $1")
      .replace(/2x/gi, "two-time")
      .replace(/₹5,000/g, "5,000 rupees")
      .replace(/GFG × Miro/gi, "GeeksforGeeks and Miro")
      .replace(/CBSE/gi, "C.B.S.E.")
      .replace(/ICSE/gi, "I.C.S.E.")
      .replace(/CSE/gi, "Computer Science")
      .replace(/\s+/g, " ")
      .trim();
  };

  const speakText = (text: string) => {
    if (isMuted || !synthRef.current) return;
    synthRef.current.cancel();

    const cleanSpeech = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);

    // Apply voice settings
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    if (selectedVoiceURI && availableVoices.length > 0) {
      const chosenVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setMicError("Speech recognition is not supported in this browser. You can still type queries!");
      return;
    }

    stopSpeaking();
    setMicError(null);

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-US";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (interimTranscript) {
          setInputText(interimTranscript);
        }

        if (finalTranscript) {
          setInputText(finalTranscript);
          setIsListening(false);
          handleUserQuery(finalTranscript);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicError("Microphone permission denied. Please allow microphone access in browser settings.");
        } else if (event.error !== "no-speech") {
          console.warn("Speech recognition error:", event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  };

  const processResponse = (query: string): { text: string; action?: Message["action"] } => {
    const q = query.toLowerCase().trim();

    // Voice Command: Stop audio / Mute
    if (/(stop talking|be quiet|shut up|silence|mute voice|mute)/i.test(q)) {
      stopSpeaking();
      setIsMuted(true);
      return {
        text: `I've muted audio responses. You can click the unmute button or say "unmute" whenever you'd like to hear me again.`,
      };
    }

    // Voice Command: Unmute
    if (/(unmute|speak again|turn on sound|voice on)/i.test(q)) {
      setIsMuted(false);
      return {
        text: `Audio voice response is now unmuted and active!`,
      };
    }

    // Voice Command: Scroll to top / Home / Hero
    if (/(scroll (to )?(top|up)|go (to )?home|header|top of page)/i.test(q)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return {
        text: `Navigated to the top of the page.`,
        action: { label: "Top of Page", targetId: "hero" },
      };
    }

    // Voice Command: Clear Chat
    if (/(clear chat|clear history|reset chat|restart assistant)/i.test(q)) {
      setMessages([
        {
          id: "intro",
          sender: "assistant",
          text: `Chat cleared! How can I help you explore Tushar's portfolio?`,
        },
      ]);
      return {
        text: `I've refreshed our conversation.`,
      };
    }

    // Voice Command: Theme Toggle
    if (/(dark mode|light mode|toggle theme|switch theme|change theme|color mode)/i.test(q)) {
      if (onToggleTheme) onToggleTheme();
      return {
        text: `I've toggled the color theme for you!`,
      };
    }

    // Voice Command: Specific Project - AI Time Table Generator
    if (/(timetable|time table|schedule generator|clash free)/i.test(q)) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `Tushar built the AI Time Table Generator! It generates clash-free academic timetables with automated faculty allocation, deployed live on Vercel.`,
        action: { label: "Open Live Time Table Demo", url: "https://aitime-tablegenerator.vercel.app/" },
      };
    }

    // Voice Command: Specific Project - College Bus Management System
    if (/(bus|college bus|bus management|transportation)/i.test(q)) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `The College Bus Management System features real-time route coordination, pass verification, and student attendance tracking. It won 2nd Position in the Innovate 1.0 Ideathon!`,
        action: { label: "View Bus Project GitHub", url: "https://github.com/Tushar-Gahlout/College_Bus_Management_System.git" },
      };
    }

    // Voice Command: Navigation - All Projects
    if (/(project|projects|work|built|portfolio|apps|creations|show projects|go to projects)/i.test(q)) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `Here are Tushar's featured projects: The AI Time Table Generator (deployed live on Vercel) and the College Bus Management System (2nd Place Hackathon win).`,
        action: { label: "Explore Projects", targetId: "projects" },
      };
    }

    // Voice Command: Navigation - Resume
    if (/(resume|cv|curriculum vitae|biodata|download resume|get resume|view resume)/i.test(q)) {
      document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `You can view and download Tushar's official ATS-friendly resume here. It includes his 8.34 CGPA at GEHU Bhimtal, technical skills, and projects.`,
        action: { label: "Download Resume PDF", url: "/Tushar_Gahlout_Resume.pdf" },
      };
    }

    // Voice Command: Navigation - Skills & Tech Stack
    if (/(skill|skills|tech|stack|language|languages|tool|tools|framework|frameworks|backend|frontend|database|python|react|node|c\+\+|java)/i.test(q)) {
      document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `Tushar's core stack includes JavaScript, React.js, Node.js, Express.js, REST APIs, MongoDB, MySQL, Supabase, Python, C++, Java, and AI/ML libraries like Scikit-learn and TensorFlow.`,
        action: { label: "Explore Toolkit", targetId: "skills" },
      };
    }

    // Voice Command: Navigation - Hackathons & Awards
    if (/(hackathon|hackathons|award|awards|prize|prizes|achievement|achievements|win|winner|watch the code|innovate)/i.test(q)) {
      document.getElementById("hackathons")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `Tushar is a 2x Hackathon podium finisher: Consolation Prize in the National Watch the Code Hackathon (GFG × Miro, ₹5,000) and 2nd Position in Innovate 1.0 Ideathon (AWS Club).`,
        action: { label: "View Hackathons", targetId: "hackathons" },
      };
    }

    // Voice Command: Navigation - Certificates
    if (/(certificate|certificates|certifications?|credentials?)/i.test(q)) {
      document.getElementById("certificates")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `Tushar holds verified certifications from Watch the Code National Hackathon, SAARTHI Hackathon 2025, and Webathon 4.0. Click any certificate to preview in full resolution.`,
        action: { label: "View Certificates", targetId: "certificates" },
      };
    }

    // Voice Command: Navigation - Education & Academics
    if (/(education|college|university|academic|study|school|degree|btech|b\.tech|cgpa|gpa|marks|percentage|10th|12th|gehu|graphic era|bhimtal)/i.test(q)) {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `Tushar is pursuing B.Tech (Hons.) in Computer Science & Engineering with AI & ML specialization at Graphic Era Hill University, Bhimtal (2025–2029) with a CGPA of 8.34/10. He completed Class XII from Baldev Singh Inter College (CBSE 84%) and Class X from Maria School (ICSE 88.6%).`,
        action: { label: "View Education Details", targetId: "about" },
      };
    }

    // Voice Command: Navigation - Contact & Hire
    if (/(contact|email|phone|call|hire|reach|message|talk|socials?|linkedin|github)/i.test(q)) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      return {
        text: `You can contact Tushar directly via email at rajputtushar119@gmail.com, call +91 9389147847, or send a message using the verified form below.`,
        action: { label: "Go to Contact Form", targetId: "contact" },
      };
    }

    // Voice Command: About / Intro
    if (/(who are you|who is tushar|about tushar|introduce|tell me about yourself|intro|bio)/i.test(q)) {
      return {
        text: `Tushar Gahlout is a Full-Stack Web & Backend Developer and AI/ML enthusiast pursuing B.Tech CSE (AI & ML) at Graphic Era Hill University. He specializes in scalable backend APIs, intelligent tools, and modern web applications.`,
        action: { label: "Read Full Bio", targetId: "about" },
      };
    }

    // Default intelligent fallback
    return {
      text: `I can help you navigate to projects, review skills, inspect hackathon achievements, check educational background, or download Tushar's resume. Just say "show projects", "download resume", or "go to contact"!`,
    };
  };

  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const { text, action } = processResponse(queryText);
      const botMsg: Message = {
        id: "a-" + Date.now(),
        sender: "assistant",
        text,
        action,
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(text);
    }, 350);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserQuery(inputText);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300 border border-emerald-400/40"
            aria-label="Open AI Voice Assistant"
          >
            {/* Pulsing ring indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950" />
            </span>

            <span className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span>Talk to TG-AI</span>
            </span>

            {/* Subtle waveform animation preview */}
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-full bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-0.5 h-2/3 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-0.5 h-full bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </button>
        )}
      </div>

      {/* Assistant Modal/Drawer Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[85vh] flex flex-col glass-card rounded-3xl border border-emerald-500/30 bg-slate-950/95 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 text-foreground">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border/80 bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md">
                <Bot className="h-6 w-6" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                  TG-AI Assistant <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                </h4>
                <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  {isListening ? (
                    <span className="flex items-center gap-1.5 text-rose-400 animate-pulse font-semibold">
                      <Radio className="h-3 w-3" /> Listening to you...
                    </span>
                  ) : isSpeaking ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Volume2 className="h-3 w-3 animate-pulse" /> Speaking answer...
                    </span>
                  ) : (
                    <span>Ready • Voice & Text enabled</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl border border-border/70 hover:bg-foreground/10 transition-colors ${
                  showSettings ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "text-slate-400"
                }`}
                title="Voice & Clarity Settings"
                aria-label="Voice settings"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) stopSpeaking();
                }}
                className={`p-2 rounded-xl border border-border/70 hover:bg-foreground/10 transition-colors ${
                  isMuted ? "text-rose-400" : "text-emerald-400"
                }`}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  stopListening();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Voice & Clarity Settings Panel */}
          {showSettings && (
            <div className="p-3.5 bg-slate-900/95 border-b border-emerald-500/30 text-xs space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> Assistant Voice
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {availableVoices.length} voices found
                  </span>
                </div>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    stopSpeaking();
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-sans"
                >
                  {availableVoices.map((v) => {
                    const isHD = /natural|neural|online|premium|enhanced|google/i.test(v.name);
                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {isHD ? "🌟 " : ""}{v.name} ({v.lang})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Speed: {speechRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.25"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Pitch: {speechPitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => speakText("Hello! This is how I sound now. Is this clear?")}
                  className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-[11px] border border-emerald-500/40 transition-colors flex items-center gap-1.5"
                >
                  <Play className="h-3 w-3" /> Test Voice Sample
                </button>
              </div>
            </div>
          )}

          {/* Active Speaking / Equalizer Banner */}
          {isSpeaking && (
            <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 h-3">
                  <span className="w-1 h-full bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-2/3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-full bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="w-1 h-1/2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
                </div>
                <span>Speaking response aloud</span>
              </div>
              <button
                type="button"
                onClick={stopSpeaking}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
              >
                Stop Audio
              </button>
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Action Link Button if available */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                      {msg.action.url ? (
                        <a
                          href={msg.action.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] border border-emerald-500/40 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> {msg.action.label}
                        </a>
                      ) : msg.action.targetId ? (
                        <button
                          type="button"
                          onClick={() => {
                            document.getElementById(msg.action!.targetId!)?.scrollIntoView({ behavior: "smooth" });
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-[11px] border border-cyan-500/40 transition-colors"
                        >
                          {msg.action.label} →
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-muted-foreground mt-1 px-1">
                  {msg.sender === "user" ? "You" : "TG-AI"}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Mic Error Banner if any */}
          {micError && (
            <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/20 text-rose-300 text-[11px] flex items-center justify-between">
              <span>{micError}</span>
              <button
                type="button"
                onClick={() => setMicError(null)}
                className="text-rose-400 hover:text-rose-200 ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 border-t border-border/50 bg-slate-950/50 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickSuggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleUserQuery(sug)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-emerald-500/40 transition-all shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Voice & Text Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-border/80 bg-slate-950 flex items-center gap-2">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-2xl transition-all shadow-md shrink-0 ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse shadow-rose-500/40 scale-105"
                  : "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
              }`}
              title={isListening ? "Stop Listening" : "Speak to Assistant"}
              aria-label={isListening ? "Stop speech recognition" : "Start speech recognition"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "🎙️ Listening... speak command now..." : "Ask or say 'show projects', 'download resume'..."}
              className={`flex-1 bg-slate-900 border rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none transition-colors ${
                isListening ? "border-rose-500/50 bg-rose-950/20 placeholder:text-rose-300/80" : "border-slate-800 focus:border-emerald-500"
              }`}
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 disabled:opacity-40 text-slate-950 hover:bg-emerald-600 transition-colors shrink-0 shadow-sm"
              aria-label="Send query"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

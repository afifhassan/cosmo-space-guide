import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import cosmoLogoUrl from "./assets/images/cosmo_logo_1783875081713.jpg";
import realMoonUrl from "./assets/images/real_moon_1783875097652.jpg";
import { 
  Rocket, 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Compass, 
  HelpCircle, 
  Check, 
  Flame, 
  Atom, 
  User, 
  Globe, 
  MessageSquare,
  Info,
  ChevronRight,
  Sparkle,
  Maximize2,
  Minimize2,
  History,
  Plus,
  Trash2,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, ChatSession, PRESET_QUESTIONS, SPACE_FACTS, SpaceFact, HEAVY_TEXT_SAMPLES } from "./types";
import CosmoAvatar from "./components/CosmoAvatar";
import SpaceFactCard from "./components/SpaceFactCard";
import TextSimplifier from "./components/TextSimplifier";
import NasaExplorer from "./components/NasaExplorer";
import ExploreSpace from "./components/ExploreSpace";
import DailyUpdates from "./components/DailyUpdates";
import { 
  Home as HomeIcon,
  Newspaper,
  BookOpen,
  Search
} from "lucide-react";
import { 
  playRobotBeep, 
  playRocketSwoosh, 
  playStellarChime, 
  playCosmicRumble 
} from "./components/AudioSynthesizer";

// Define Planet properties for our Interactive Space Monitor
interface PlanetData {
  name: string;
  color: string;
  gradient: string;
  glowColor: string;
  atmosphere: string;
  gravity: string;
  gravityValue: string; // percentage/fraction of Earth's gravity
  analogy: string;
  emoji: string;
  funFact: string;
}

const PLANETS: PlanetData[] = [
  {
    name: "Mars",
    color: "#ef4444",
    gradient: "radial-gradient(circle at 30% 30%, #ef4444 0%, #7f1d1d 60%, #000 100%)",
    glowColor: "rgba(239, 68, 68, 0.45)",
    atmosphere: "95% Carbon Dioxide (Super thin!)",
    gravity: "0.38g",
    gravityValue: "38%",
    analogy: "Walking on Mars is like jumping on a huge trampoline!",
    emoji: "🪐",
    funFact: "Mars is red because it's literally covered in rust! It's like an old bicycle left out in the cosmic rain for millions of years."
  },
  {
    name: "Jupiter",
    color: "#f59e0b",
    gradient: "radial-gradient(circle at 30% 30%, #f59e0b 0%, #78350f 60%, #000 100%)",
    glowColor: "rgba(245, 158, 11, 0.45)",
    atmosphere: "90% Hydrogen, 10% Helium (Super thick!)",
    gravity: "2.52g",
    gravityValue: "100%", // Limit visually or scale
    analogy: "Walking on Jupiter would feel like having 3 friends sitting on your shoulders!",
    emoji: "🌀",
    funFact: "Jupiter is a giant gas ball with a massive storm called the Great Red Spot that is wider than two whole Earths combined!"
  },
  {
    name: "Venus",
    color: "#ec4899",
    gradient: "radial-gradient(circle at 30% 30%, #ec4899 0%, #831843 60%, #000 100%)",
    glowColor: "rgba(236, 72, 153, 0.45)",
    atmosphere: "96% Carbon Dioxide (Thick & acidic!)",
    gravity: "0.90g",
    gravityValue: "90%",
    analogy: "Being on Venus feels like being squeezed deep underwater inside a giant greenhouse oven!",
    emoji: "🌋",
    funFact: "Venus is the hottest planet in our solar system (475°C) and it rotates backwards! One day there is longer than its whole year!"
  },
  {
    name: "Neptune",
    color: "#06b6d4",
    gradient: "radial-gradient(circle at 30% 30%, #06b6d4 0%, #1e3a8a 60%, #000 100%)",
    glowColor: "rgba(6, 182, 212, 0.45)",
    atmosphere: "80% Hydrogen, 19% Helium, Methane",
    gravity: "1.14g",
    gravityValue: "95%",
    analogy: "Walking on Neptune is like pushing through super heavy, freezing supersonic hurricanes!",
    emoji: "🥶",
    funFact: "Neptune is a cold, blue ice giant swept by the fastest winds in the solar system, reaching up to 2,100 kilometers per hour!"
  },
  {
    name: "Saturn",
    color: "#fbbf24",
    gradient: "radial-gradient(circle at 30% 30%, #fbbf24 0%, #78350f 60%, #000 100%)",
    glowColor: "rgba(251, 191, 36, 0.45)",
    atmosphere: "96% Hydrogen, 3% Helium",
    gravity: "1.06g",
    gravityValue: "92%",
    analogy: "Floating on Saturn is like drifting on a cosmic ice rink surrounded by golden dust rings!",
    emoji: "🪐",
    funFact: "Saturn has beautiful rings made of trillions of tiny pieces of ice and rock! The planet is so light, it could float in a giant bathtub!"
  }
];

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem("cosmo_chat_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load chat sessions", e);
    }
    
    // Default initial session
    const initialSessionId = `session-${Date.now()}`;
    return [
      {
        id: initialSessionId,
        title: "Initial Orbit Transmission",
        messages: [
          {
            id: "welcome",
            sender: "cosmo",
            text: "Greetings! I am **COSMO**, your intelligent astronomical exploration companion. I am designed to assist you in navigating the complexities of astrophysics, planetary sciences, and stellar flight telemetry. Feel free to ask any advanced questions about the universe, or insert academic space research texts into the **Cosmic Synthesizer** below to extract high-fidelity conceptual summaries instantly. Clear skies and stellar discoveries! 🌌",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ],
        timestamp: Date.now(),
        rigorLevel: "explorer" as const
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem("cosmo_current_session_id");
      if (savedId) {
        return savedId;
      }
    } catch (e) {
      console.error("Failed to load current session id", e);
    }
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || {
    id: "session-fallback",
    title: "Initial Orbit Transmission",
    messages: [
      {
        id: "welcome",
        sender: "cosmo",
        text: "Greetings! I am **COSMO**, your intelligent astronomical exploration companion. I am designed to assist you in navigating the complexities of astrophysics, planetary sciences, and stellar flight telemetry. Feel free to ask any advanced questions about the universe, or insert academic space research texts into the **Cosmic Synthesizer** below to extract high-fidelity conceptual summaries instantly. Clear skies and stellar discoveries! 🌌",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ],
    timestamp: Date.now(),
    rigorLevel: "explorer"
  };

  const messages = currentSession.messages;

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem("cosmo_chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Sync currentSessionId to localStorage
  useEffect(() => {
    localStorage.setItem("cosmo_current_session_id", currentSessionId);
  }, [currentSessionId]);

  const updateCurrentSessionMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setSessions(prevSessions => {
      return prevSessions.map(s => {
        if (s.id === currentSessionId) {
          const resolvedMessages = typeof newMessages === "function" ? newMessages(s.messages) : newMessages;
          
          let title = s.title;
          if (title === "Initial Orbit Transmission" || title === "New Conversation" || !title) {
            const firstUserMessage = resolvedMessages.find(m => m.sender === "user");
            if (firstUserMessage) {
              const cleaned = firstUserMessage.text.replace(/SIMPLIFY THIS TECHNICAL TEXT:/g, "Simplify:").trim();
              title = cleaned.length > 28 ? cleaned.substring(0, 26) + "..." : cleaned;
            }
          }

          return {
            ...s,
            messages: resolvedMessages,
            title,
            timestamp: Date.now()
          };
        }
        return s;
      });
    });
  };

  const handleStartNewConversation = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New Conversation",
      messages: [
        {
          id: "welcome",
          sender: "cosmo",
          text: "Greetings! I am **COSMO**, your intelligent astronomical exploration companion. I am designed to assist you in navigating the complexities of astrophysics, planetary sciences, and stellar flight telemetry. Feel free to ask any advanced questions about the universe, or insert academic space research texts into the **Cosmic Synthesizer** below to extract high-fidelity conceptual summaries instantly. Clear skies and stellar discoveries! 🌌",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
      timestamp: Date.now(),
      rigorLevel: "explorer"
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setRigorLevel("explorer");
    triggerSound("swoosh");
  };

  const handleDeleteConversation = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSound("beep");
    
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== idToDelete);
      if (filtered.length === 0) {
        const defaultId = `session-${Date.now()}`;
        return [
          {
            id: defaultId,
            title: "Initial Orbit Transmission",
            messages: [
              {
                id: "welcome",
                sender: "cosmo",
                text: "Greetings! I am **COSMO**, your intelligent astronomical exploration companion. I am designed to assist you in navigating the complexities of astrophysics, planetary sciences, and stellar flight telemetry. Feel free to ask any advanced questions about the universe, or insert academic space research texts into the **Cosmic Synthesizer** below to extract high-fidelity conceptual summaries instantly. Clear skies and stellar discoveries! 🌌",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ],
            timestamp: Date.now(),
            rigorLevel: "explorer" as const
          }
        ];
      }
      return filtered;
    });

    if (currentSessionId === idToDelete) {
      setSessions(prev => {
        const remaining = prev.filter(s => s.id !== idToDelete);
        const nextActive = remaining[0];
        if (nextActive) {
          setCurrentSessionId(nextActive.id);
          setRigorLevel(nextActive.rigorLevel);
        }
        return prev;
      });
    }
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session) {
      setRigorLevel(session.rigorLevel);
    }
    triggerSound("beep");
  };

  const handleSetRigorLevelAndSave = (level: "explorer" | "academic") => {
    setRigorLevel(level);
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, rigorLevel: level } : s));
  };

  const [inputVal, setInputVal] = useState("");
  const [cosmoState, setCosmoState] = useState<"idle" | "thinking" | "talking" | "happy">("idle");
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANETS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState<"home" | "explore" | "daily">("home");
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Custom states to make the AI agent more powerful & chat bubble surface highly readable
  const [rigorLevel, setRigorLevel] = useState<"explorer" | "academic">("explorer");
  const [isChatExpanded, setIsChatExpanded] = useState<boolean>(false);
  const [chatFontSize, setChatFontSize] = useState<"normal" | "large" | "cosmic">("normal");
  const [copiedLogs, setCopiedLogs] = useState<boolean>(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState<boolean>(false);
  const [hasEntered, setHasEntered] = useState<boolean>(() => sessionStorage.getItem("cosmo_entered") === "true");

  const handleCopyLogs = () => {
    const textLogs = messages
      .map((m) => `[${m.timestamp}] ${m.sender === "user" ? "Cadet" : m.sender === "system" ? "SYSTEM" : "COSMO"}: ${m.text.replace(/\*\*/g, "")}`)
      .join("\n\n");
    navigator.clipboard.writeText(textLogs);
    triggerSound("chime");
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  const handleAskCosmoAndNavigate = (question: string) => {
    setActivePage("home");
    handleSendMessage(question);
  };

  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return;
    setGlobalSearchQuery(query.trim());
    setActivePage("explore");
    triggerSound("swoosh");
  };

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize random star positions
  useEffect(() => {
    const newStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, cosmoState]);

  // General audio trigger helper
  const triggerSound = (type: "beep" | "swoosh" | "chime" | "rumble") => {
    if (!soundEnabled) return;
    if (type === "beep") playRobotBeep();
    if (type === "swoosh") playRocketSwoosh();
    if (type === "chime") playStellarChime();
    if (type === "rumble") playCosmicRumble();
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Check guardrails client-side for simple feedback
    const promptLower = textToSend.toLowerCase();
    const isSimplifyTask = textToSend.startsWith("SIMPLIFY THIS TECHNICAL TEXT:");
    
    // Add user message to state
    const userMsgId = `msg-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: isSimplifyTask ? `Please simplify this scientific writing for me! 🧐` : textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    updateCurrentSessionMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);
    setCosmoState("thinking");
    triggerSound("swoosh");

    try {
      // Build conversations payload for the server
      const chatHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));

      // Append latest question
      chatHistory.push({
        role: "user",
        parts: [{ text: textToSend }]
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: chatHistory, rigorLevel: rigorLevel }),
      });

      if (!response.ok) {
        throw new Error("Star system network failure!");
      }

      const data = await response.json();
      
      setCosmoState("talking");
      triggerSound("chime");

      updateCurrentSessionMessages((prev) => [
        ...prev,
        {
          id: `cosmo-${Date.now()}`,
          sender: "cosmo",
          text: data.text || "I apologize, my communication telescope is a bit foggy right now!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);

      // Return to happy/idle after response
      setTimeout(() => {
        setCosmoState("happy");
        setTimeout(() => setCosmoState("idle"), 2500);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setCosmoState("idle");
      updateCurrentSessionMessages((prev) => [
        ...prev,
        {
          id: `system-error-${Date.now()}`,
          sender: "system",
          text: "Houston, we have a connection issue! Please check your space transmission and try again! 📡",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanet(planet);
    triggerSound("rumble");
  };

  // Helper to render message text with clean custom bold highlighting & lists
  const renderMessageText = (text: string) => {
    const getFontSizeClass = () => {
      if (chatFontSize === "large") return "text-sm sm:text-base md:text-lg leading-relaxed";
      if (chatFontSize === "cosmic") return "text-base sm:text-lg md:text-xl leading-relaxed font-semibold";
      return "text-xs sm:text-sm leading-relaxed";
    };

    return (
      <div className={`markdown-body ${getFontSizeClass()} text-slate-100`}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="my-2 leading-relaxed text-slate-100 font-sans">{children}</p>,
            strong: ({ children }) => (
              <strong className="text-yellow-300 font-extrabold font-display">
                {children}
              </strong>
            ),
            em: ({ children }) => <em className="text-cyan-200 italic">{children}</em>,
            li: ({ children }) => (
              <li className="ml-4 list-disc text-slate-100 my-1 font-sans">
                {children}
              </li>
            ),
            ul: ({ children }) => <ul className="my-2 space-y-1 list-none pl-1">{children}</ul>,
            ol: ({ children }) => <ol className="my-2 list-decimal ml-4 space-y-1 font-sans">{children}</ol>,
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return <code className="bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-cyan-300 border border-slate-800/80" {...props}>{children}</code>;
              }
              return (
                <pre className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 my-2 overflow-x-auto">
                  <code className="font-mono text-xs text-emerald-400" {...props}>{children}</code>
                </pre>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 pl-3 my-2 text-indigo-200 italic bg-indigo-950/20 py-1.5 px-2 rounded-r-xl font-sans">
                {children}
              </blockquote>
            )
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  const planetMonitorJSX = (
    <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="bg-[#fbbf24] text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider font-display">
            Interactive Lab
          </span>
          <h3 className="text-base font-bold font-display text-white mt-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            Stellar Planet Monitor
          </h3>
        </div>
        
        {/* Planet Selectors */}
        <div className="flex flex-wrap gap-1">
          {PLANETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPlanet(p)}
              className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium font-display ${
                selectedPlanet.name === p.name
                  ? "bg-indigo-600/30 border-indigo-500 text-white shadow-sm"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center min-h-[220px]">
        
        {/* Giant planet visual representation */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative py-4">
          {/* Simulated Planet Glow Circle */}
          <motion.div
            key={selectedPlanet.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-36 h-36 rounded-full relative"
            style={{
              background: selectedPlanet.gradient,
              boxShadow: `0 0 50px ${selectedPlanet.glowColor}, inset -15px -15px 30px rgba(0,0,0,0.85)`
            }}
          >
            {/* Planet atmospheric haze simulation overlay */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
          </motion.div>

          <div className="absolute -bottom-1 font-mono text-[10px] text-slate-400 mt-2">
            Orbital Simulation: ON
          </div>
        </div>

        {/* Planet Data Panel with Analogy */}
        <div className="md:col-span-7 space-y-3.5">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-lg font-bold font-display text-white">
                {selectedPlanet.emoji} {selectedPlanet.name}
              </h4>
              <span className="text-[11px] px-2 py-0.5 bg-indigo-950 border border-indigo-500/30 rounded text-cyan-400 font-mono">
                Target Acquired
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {selectedPlanet.funFact}
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-800/60 pt-3">
            {/* Gravity visual indicator */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-mono">SURFACE GRAVITY ({selectedPlanet.gravity})</span>
                <span className="text-indigo-400 font-bold">{selectedPlanet.gravity === "1.00g" ? "EARTH STANDARD" : selectedPlanet.gravity === "0.38g" || selectedPlanet.gravity === "0.90g" ? "BOUNCY!" : "HEAVY!"}</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500" 
                  initial={{ width: "0%" }}
                  animate={{ width: selectedPlanet.gravityValue }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Atmosphere info */}
            <div className="flex justify-between items-center text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-mono">ATMOSPHERE:</span>
              <span className="text-white font-medium text-right">{selectedPlanet.atmosphere}</span>
            </div>

            {/* Fun gravity analogy banner */}
            <div className="bg-indigo-600/10 border-l-4 border-indigo-500 p-2.5 rounded-r-xl flex items-start gap-2">
              <div className="text-sm mt-0.5">💡</div>
              <div>
                <p className="text-[11px] font-bold text-white uppercase font-display">Cosmo Gravity Analogy</p>
                <p className="text-xs text-indigo-200 mt-0.5">{selectedPlanet.analogy}</p>
              </div>
            </div>
          </div>

          {/* Prompt Cosmo */}
          <div className="pt-1">
            <button
              onClick={() => handleAskCosmoAndNavigate(`Tell me some more mind-blowing facts about the planet ${selectedPlanet.name}!`)}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Ask Cosmo more about {selectedPlanet.name}!
            </button>
          </div>

        </div>

      </div>

    </div>
  );

  if (!hasEntered) {
    return (
      <div className="min-h-screen bg-[#020208] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Twinkling star field */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((star) => (
            <div
              key={`landing-star-${star.id}`}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.id * 0.15}s`,
              }}
            />
          ))}
          {/* Nebula dust */}
          <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-pink-500/5 blur-[150px]" />
        </div>

        <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 relative z-10 py-10">
          
          {/* LUNAR PHOTOGRAPH VISUAL EFFECT */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Aura */}
            <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-pink-500/10 blur-xl animate-pulse" />
            
            {/* Spinning Telemetry Ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[320px] h-[320px] sm:w-[390px] sm:h-[390px] md:w-[460px] md:h-[460px] border border-dashed border-indigo-500/20 rounded-full"
            />

            {/* Spinning Telemetry Ring 2 */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] sm:w-[370px] sm:h-[370px] md:w-[440px] md:h-[440px] border border-dashed border-cyan-400/10 rounded-full"
            />

            {/* Static Outer Compass Scale */}
            <div className="absolute w-[340px] h-[340px] sm:w-[410px] sm:h-[410px] md:w-[480px] md:h-[480px] border border-white/[0.03] rounded-full hidden sm:flex items-center justify-center">
              <span className="absolute top-2 text-[8px] font-mono text-slate-600">N 000°</span>
              <span className="absolute right-2 text-[8px] font-mono text-slate-600">E 090°</span>
              <span className="absolute bottom-2 text-[8px] font-mono text-slate-600">S 180°</span>
              <span className="absolute left-2 text-[8px] font-mono text-slate-600">W 270°</span>
            </div>

            {/* THE DETAILED REAL MOON SPHERE */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.08)] flex-shrink-0"
            >
              {/* Overlay shadow to integrate it with deep space */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none z-10" />
              
              <motion.img
                src={realMoonUrl}
                alt="Detailed Lunar Surface"
                referrerPolicy="no-referrer"
                animate={{ rotate: 360 }}
                transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
                className="w-full h-full object-cover select-none pointer-events-none scale-105"
              />
            </motion.div>

            {/* Dynamic Telemetry Badges Floating Around */}
            <div className="absolute -top-4 -left-4 bg-slate-900/90 border border-indigo-500/30 px-3 py-1.5 rounded-xl font-mono text-[9px] text-cyan-300 shadow-xl hidden sm:block">
              <span className="text-slate-500 block">SECTOR</span>
              <span>LUNAR DELTA-4</span>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-slate-900/90 border border-pink-500/30 px-3 py-1.5 rounded-xl font-mono text-[9px] text-pink-300 shadow-xl hidden sm:block">
              <span className="text-slate-500 block">DISTANCE</span>
              <span>384,400 KM</span>
            </div>

            <div className="absolute top-1/2 -right-12 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono text-[9px] text-amber-300 shadow-xl hidden md:block">
              <span className="text-slate-500 block">VELOCITY</span>
              <span>1.022 KM/S</span>
            </div>
          </div>

          {/* BRANDING, MOTTO & ENTRANCE BUTTON */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-lg">
            {/* Header branding */}
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-8 h-8 bg-slate-950 rounded-lg overflow-hidden border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.3)] flex items-center justify-center p-0.5">
                  <img src={cosmoLogoUrl} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-md scale-125" />
                </div>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider font-display">
                  Mission Dispatch
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-display">
                COSMO<span className="text-indigo-400">.AI</span>
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-cyan-300 font-mono">
                Advanced Space Science Exploration Guide
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Welcome, Space Cadet. COSMO is an interactive astrophysics intelligence designed to decode cosmic mysteries, process solar telemetry, and answer complex questions with simple, highly intuitive physical analogies.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl">
                  <span className="text-[10px] font-mono text-indigo-400 block uppercase">Gravity lab</span>
                  <span className="text-xs text-slate-400">Simulate physical metrics across celestial realms.</span>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl">
                  <span className="text-[10px] font-mono text-cyan-400 block uppercase">NASA ARCHIVES</span>
                  <span className="text-xs text-slate-400">Query live imagery and scientific data from deep space.</span>
                </div>
              </div>
            </div>

            {/* Entrance controls */}
            <div className="w-full pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  triggerSound("chime");
                  triggerSound("rumble");
                  sessionStorage.setItem("cosmo_entered", "true");
                  setHasEntered(true);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-500 text-white font-extrabold uppercase text-xs rounded-2xl tracking-widest cursor-pointer shadow-lg shadow-indigo-600/25 hover:shadow-pink-600/35 transition-all border border-white/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Initiate Space Orbit</span>
                <Rocket className="w-4 h-4 animate-bounce" />
              </button>

              {/* Sound toggle on landing page */}
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) {
                    playStellarChime();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 ${
                  soundEnabled 
                    ? "bg-indigo-600/15 border-indigo-500/30 text-cyan-300 hover:bg-indigo-600/25" 
                    : "bg-slate-800/20 border-slate-700/40 text-slate-400 hover:bg-slate-800"
                }`}
                title={soundEnabled ? "Mute Cosmic Sounds" : "Enable Cosmic Sounds"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-[10px] font-mono uppercase tracking-wider">{soundEnabled ? "Audio On" : "Muted"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info line */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500 gap-2 border-t border-slate-900/50 pt-4 max-w-7xl mx-auto w-full">
          <span>APOLLO TARGET DETECTED // SECURE CORE INTERFACE</span>
          <span>COSMO ENGINE V1.4.2 // ONLINE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col relative overflow-x-hidden font-sans">
      {/* Absolute Starry Sky Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.id * 0.15}s`,
            }}
          />
        ))}

        {/* Ambient Nebula Gradients (Artistic Flair Theme) */}
        <div className="absolute top-[15%] left-[5%] w-[45%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[45%] rounded-full bg-pink-600/8 blur-[130px]" />
        <div className="absolute top-[60%] left-[45%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      {/* STUNNING HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-[#050510]/60 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerSound("rumble")}
              className="w-12 h-12 bg-slate-950 rounded-2xl overflow-hidden border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center p-0.5 hover:border-cyan-400/50 transition-colors focus:outline-none cursor-pointer"
              title="Cosmo Core Module"
            >
              <img 
                src={cosmoLogoUrl} 
                alt="COSMO.AI Logo Symbol" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl scale-125"
              />
            </button>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white font-display">
                  COSMO<span className="text-indigo-400">.AI</span>
                </h1>
                <span className="bg-[#fbbf24] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider font-display">
                  NASA Space Apps
                </span>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-indigo-300 font-mono mt-0.5">
                Astronomy Companion for Kids & Beginners
              </p>
            </div>
          </div>

          {/* GLOBAL SEARCH BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("headerSearch") as HTMLInputElement;
              if (input && input.value.trim()) {
                handleGlobalSearch(input.value.trim());
                input.value = "";
              }
            }}
            className="relative w-full max-w-xs md:max-w-sm flex items-center"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4 text-indigo-400" />
            </span>
            <input
              type="text"
              name="headerSearch"
              placeholder="Search NASA archives & cosmic sectors..."
              className="w-full pl-9 pr-16 py-2 bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-[10px] uppercase font-bold rounded-lg text-white cursor-pointer shadow-sm shadow-indigo-600/30 transition-all"
            >
              Search
            </button>
          </form>

          {/* THREE-PAGE NAVIGATION TABS */}
          <div className="flex items-center bg-slate-950/80 p-1 border border-slate-800/80 rounded-2xl shadow-inner relative z-20">
            <button
              onClick={() => {
                setActivePage("home");
                triggerSound("beep");
              }}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide font-display transition-all cursor-pointer ${
                activePage === "home"
                  ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home Guide</span>
            </button>

            <button
              onClick={() => {
                setActivePage("explore");
                triggerSound("beep");
              }}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide font-display transition-all cursor-pointer ${
                activePage === "explore"
                  ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Space</span>
            </button>

            <button
              onClick={() => {
                setActivePage("daily");
                triggerSound("beep");
              }}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide font-display transition-all cursor-pointer ${
                activePage === "daily"
                  ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Daily Updates</span>
            </button>
          </div>

          {/* Navigation Simulation / Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <span className="font-mono text-indigo-300">Astrophysical Telemetry: Active</span>
            </div>

            {/* Audio Toggle button */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) {
                  // Play dynamic startup chime
                  playStellarChime();
                }
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled 
                  ? "bg-indigo-600/20 border-indigo-500/40 text-cyan-300 hover:bg-indigo-600/30" 
                  : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800"
              }`}
              title={soundEnabled ? "Mute Cosmic Sound Effects" : "Enable Cosmic Sound Effects"}
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        
        {/* PAGE 1: HOME (AI CHAT & COSMO GUIDE) */}
        {activePage === "home" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN (Width: 5/12) - Cosmo Avatar, Fact Cards, and Simplifier */}
            <section className={`${isChatExpanded ? "hidden lg:hidden" : "lg:col-span-5"} space-y-6 flex flex-col h-full justify-start transition-all duration-300`}>
              
              {/* Cosmo Live Panel */}
              <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col items-center text-center">
                {/* Design accents */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />

                <CosmoAvatar state={cosmoState} />

                <h2 className="text-xl font-bold font-display text-white mt-1">
                  Ask COSMO AI
                </h2>
                <p className="text-xs text-indigo-200 mt-1 max-w-xs leading-relaxed">
                  COSMO provides detailed astrophysical telemetry and conceptual translations of heavy physical theories.
                </p>

                {/* Quick Helper Tip */}
                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-3 text-left w-full">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                    COSMO AI Directives
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    🧠 Explains using <strong>intuitive physics metaphors</strong>. 🛰️ Incorporates live NASA telemetry. 🔭 Focused strictly on astronomical research & astrophysics.
                  </p>
                </div>
              </div>

              {/* Stellar Discovery Card */}
              <SpaceFactCard onAskCosmo={handleSendMessage} soundEnabled={soundEnabled} />

              {/* Cosmic Simplifier Card */}
              <TextSimplifier onSimplify={handleSendMessage} isLoading={isLoading} soundEnabled={soundEnabled} />

            </section>

            {/* RIGHT COLUMN (Width: 7/12 or 12/12) - Chat Interface */}
            <section className={`${isChatExpanded ? "lg:col-span-12 max-w-5xl mx-auto w-full" : "lg:col-span-7"} space-y-6 flex flex-col h-full justify-start transition-all duration-300`}>
              
              {/* MAIN CHAT INTERFACE WITH COSMO */}
              <div className={`bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col transition-all duration-300 ${
                isChatExpanded ? "h-[660px]" : "h-[520px]"
              }`}>
                
                {/* Absolute Sliding History Panel */}
                <AnimatePresence>
                  {isHistorySidebarOpen && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="absolute top-0 left-0 h-full w-72 bg-slate-950/98 border-r border-indigo-500/30 z-30 p-4 flex flex-col shadow-2xl backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider font-display">
                          <History className="w-4 h-4 text-cyan-400" />
                          <span>Mission Logs History</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setIsHistorySidebarOpen(false); triggerSound("swoosh"); }}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Create new chat */}
                      <button
                        type="button"
                        onClick={() => {
                          handleStartNewConversation();
                          setIsHistorySidebarOpen(false);
                        }}
                        className="w-full py-2.5 px-3 mb-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl border border-indigo-400/20 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-500/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Start New Conversation</span>
                      </button>

                      {/* Session items */}
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                        {sessions.map((session) => {
                          const isActive = session.id === currentSessionId;
                          return (
                            <div
                              key={session.id}
                              onClick={() => {
                                handleSelectSession(session.id);
                                setIsHistorySidebarOpen(false);
                              }}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                                isActive
                                  ? "bg-slate-900 border-indigo-500/50 text-indigo-200"
                                  : "bg-slate-950 border-slate-900 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 hover:border-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                                <span className="text-xs truncate font-medium font-sans">{session.title}</span>
                              </div>
                              
                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteConversation(session.id, e)}
                                className="text-slate-500 hover:text-rose-400 p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer shrink-0"
                                title="Delete log transmission"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chat header area */}
                <div className="flex flex-col gap-2.5 border-b border-slate-800 pb-3 mb-3">
                  
                  {/* Top decker: Status indicators and action buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
                      <h3 className="text-sm font-bold font-display tracking-wide uppercase text-indigo-300">
                        Cosmo Transmission logs
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* HISTORY TOGGLE */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsHistorySidebarOpen(!isHistorySidebarOpen);
                          triggerSound("swoosh");
                        }}
                        className={`text-[10px] font-mono transition-colors flex items-center gap-1 px-2.5 py-1 rounded border cursor-pointer ${
                          isHistorySidebarOpen 
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "text-slate-400 hover:text-cyan-300 bg-slate-800/60 border-slate-700/50"
                        }`}
                        title="View chat history and saved mission logs"
                      >
                        <History className="w-3 h-3 text-cyan-400" />
                        <span className="hidden sm:inline">History</span>
                        <span>({sessions.length})</span>
                      </button>

                      {/* CLEAR SCREEN */}
                      <button
                        onClick={() => {
                          triggerSound("swoosh");
                          updateCurrentSessionMessages([
                            {
                              id: "welcome",
                              sender: "cosmo",
                              text: "Logs refreshed! Ask me some fresh questions, cadet! 🚀",
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            }
                          ]);
                        }}
                        className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50 cursor-pointer"
                        title="Clear current transmission log history"
                      >
                        <RefreshCw className="w-3 h-3" /> <span className="hidden sm:inline">Clear</span>
                      </button>

                      {/* MAXIMIZE / CINEMATIC EXPAND */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsChatExpanded(!isChatExpanded);
                          triggerSound("swoosh");
                        }}
                        className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50 cursor-pointer"
                        title={isChatExpanded ? "Restore standard split-screen layout" : "Cinematic reading layout"}
                      >
                        {isChatExpanded ? <Minimize2 className="w-3 h-3 text-cyan-400" /> : <Maximize2 className="w-3 h-3" />}
                        <span className="hidden sm:inline">{isChatExpanded ? "Minimize" : "Maximize"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom decker: Advanced COSMO agent customization controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/40">
                    
                    {/* RIGOR SELECTOR */}
                    <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-xl border border-slate-800/80">
                      <span className="text-[9px] text-slate-500 font-mono uppercase font-bold tracking-wider pr-1">COSMO AI:</span>
                      <button
                        type="button"
                        onClick={() => { handleSetRigorLevelAndSave("explorer"); triggerSound("beep"); }}
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-display transition-all cursor-pointer flex items-center gap-1 ${
                          rigorLevel === "explorer" ? "bg-amber-500 text-black shadow-md shadow-amber-500/10" : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Metaphorical learning mode"
                      >
                        🧭 Metaphor
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleSetRigorLevelAndSave("academic"); triggerSound("beep"); }}
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-display transition-all cursor-pointer flex items-center gap-1 ${
                          rigorLevel === "academic" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10" : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Academic astrophysics research mode"
                      >
                        🎓 Academic
                      </button>
                    </div>

                    {/* TYPOGRAPHY CONTROLLER */}
                    <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-xl border border-slate-800/80">
                      <span className="text-[9px] text-slate-500 font-mono uppercase font-bold tracking-wider pr-1">Text size:</span>
                      <button
                        type="button"
                        onClick={() => { setChatFontSize("normal"); triggerSound("beep"); }}
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-display transition-all cursor-pointer ${
                          chatFontSize === "normal" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => { setChatFontSize("large"); triggerSound("beep"); }}
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-display transition-all cursor-pointer ${
                          chatFontSize === "large" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={() => { setChatFontSize("cosmic"); triggerSound("beep"); }}
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-display transition-all cursor-pointer ${
                          chatFontSize === "cosmic" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        A++
                      </button>
                    </div>

                    {/* COPY LOGS / SHARE */}
                    <button
                      type="button"
                      onClick={handleCopyLogs}
                      className={`text-[9px] font-bold font-display uppercase tracking-widest px-3 py-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        copiedLogs
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      }`}
                    >
                      <span>{copiedLogs ? "Logs Copied! 📋" : "Copy Logs 📋"}</span>
                    </button>

                  </div>
                </div>

                {/* Chat message space */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex gap-3 items-start ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        
                        {/* Speaker visual tag */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          msg.sender === "user"
                            ? "bg-pink-600/30 border border-pink-500 text-white"
                            : msg.sender === "system"
                            ? "bg-amber-600/30 border border-amber-500 text-amber-300"
                            : "bg-indigo-600/30 border border-indigo-500 text-cyan-300"
                        }`}>
                          {msg.sender === "user" ? "👨‍🚀" : msg.sender === "system" ? "⚠️" : "🤖"}
                        </div>

                        {/* Message Bubble */}
                        <div className="max-w-[82%]">
                          <div className={`p-4 rounded-2xl relative ${
                            msg.sender === "user"
                              ? "bg-slate-800 border border-slate-700 text-slate-100 rounded-tr-none"
                              : msg.sender === "system"
                              ? "bg-amber-950/40 border border-amber-500/30 text-slate-200"
                              : "bg-gradient-to-br from-indigo-900/40 to-pink-900/10 border border-indigo-500/25 rounded-tl-none shadow-[0_4px_15px_rgba(99,102,241,0.1)]"
                          }`}>
                            
                            {/* Text output */}
                            {renderMessageText(msg.text)}

                            {/* Timestamp */}
                            <div className={`text-[9px] text-slate-500 font-mono mt-2 block text-right ${
                              msg.sender === "user" ? "text-slate-400" : ""
                            }`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loader indicator */}
                  {isLoading && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500 text-cyan-300 flex items-center justify-center shrink-0">
                        🤖
                      </div>
                      <div className="bg-gradient-to-br from-indigo-900/20 to-pink-900/5 border border-indigo-500/20 rounded-2xl p-4 rounded-tl-none shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        <span className="text-xs text-indigo-300 font-mono font-bold ml-1">Analyzing cosmic charts...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* QUICK PRESET QUESTION CHIPS */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
                    🚀 Need ideas? Click to ask Cosmo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_QUESTIONS.map((pq) => (
                      <button
                        key={pq.label}
                        onClick={() => handleSendMessage(pq.question)}
                        disabled={isLoading}
                        className="text-left text-[11px] px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 font-sans disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                        {pq.question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TEXT INPUT CONTROLS */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputVal);
                  }}
                  className="mt-3 flex gap-2 relative items-center border-t border-slate-800/80 pt-3"
                >
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask Cosmo a stellar space question..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-28 text-xs sm:text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isLoading}
                    className={`absolute right-2 top-4.5 py-1.5 px-4.5 rounded-full font-display font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                      inputVal.trim() && !isLoading
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                        : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                    }`}
                  >
                    <span>Launch</span>
                    <Rocket className="w-3 h-3" />
                  </button>
                </form>

              </div>

            </section>
          </div>
        )}

        {/* PAGE 2: EXPLORE SPACE (CATEGORIZED SECTORS, TOPICS & PLANET MONITOR) */}
        {activePage === "explore" && (
          <ExploreSpace 
            onAskCosmo={handleAskCosmoAndNavigate} 
            soundEnabled={soundEnabled} 
            planetMonitorComponent={planetMonitorJSX}
            initialSearchQuery={globalSearchQuery}
            onClearInitialSearch={() => setGlobalSearchQuery("")}
          />
        )}

        {/* PAGE 3: DAILY UPDATES (NASA FEEDS, HISTORY EVENT, DAILY BRAIN-TEASER) */}
        {activePage === "daily" && (
          <DailyUpdates 
            onAskCosmo={handleAskCosmoAndNavigate} 
            soundEnabled={soundEnabled} 
            nasaApodComponent={
              <NasaExplorer 
                onAskCosmo={handleAskCosmoAndNavigate} 
                soundEnabled={soundEnabled} 
              />
            } 
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#050510]/80 py-6 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Systems Nominal
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-[11px] text-slate-400 font-mono">
              Energy Core: 100%
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-[11px] text-indigo-300 font-display font-medium">
              Made with 🚀 for NASA Space Apps
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center md:text-right font-mono">
            Powered by <strong>Gemini 3.5 Flash</strong> • Strict Space Exploration Guardrails Active • © 2026 Cosmo
          </p>

        </div>
      </footer>
    </div>
  );
}

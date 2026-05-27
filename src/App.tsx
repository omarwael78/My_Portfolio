import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, type Variants, useMotionValue, useTransform, useSpring } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS — Cyberpunk x DedSec fusion
// ═══════════════════════════════════════════════════════════════
const DEDSEC_YELLOW = "#FDE047";      // Active / interactive
const DEDSEC_CYAN = "#22D3EE";        // Data streams
const DEDSEC_GREEN = "#A3E635";       // Success / timeline
const CYBER_PURPLE = "#C084FC";       // Structural borders
const CYBER_INDIGO = "#818CF8";       // Secondary accents
const CYBER_PINK = "#F472B6";         // Highlight pops

const SRGN_ALIAS = "SRGN_of_DTH";

// ═══════════════════════════════════════════════════════════════
// TECH STACK — Clean, focused
// ═══════════════════════════════════════════════════════════════
const TECH_STACK = {
  backend: [
    { name: "PYTHON", level: "PRIMARY" },
    { name: "DJANGO", level: "ADVANCED" },
    { name: "FASTAPI", level: "EXPERT" },
  ],
  frontend: [
    { name: "TYPESCRIPT", level: "ADVANCED" },
    { name: "REACT", level: "ADVANCED" },
    { name: "TAILWINDCSS", level: "EXPERT" },
    { name: "HTML/CSS", level: "EXPERT" },
  ],
  data: [
    { name: "POSTGRESQL", level: "ADVANCED" },
    { name: "REDIS", level: "INTERMEDIATE" },
  ],
  tools: [
    { name: "LINUX", level: "EXPERT" },
    { name: "BASH", level: "ADVANCED" },
    { name: "GIT", level: "EXPERT" },
    { name: "DOCKER", level: "ADVANCED" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// MOTION VARIANTS
// ═══════════════════════════════════════════════════════════════
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.08,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const pageVariants: Variants = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(3px)",
    transition: { duration: 0.3 },
  },
};

// ═══════════════════════════════════════════════════════════════
// ATMOSPHERIC COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Matrix data rain
function DataRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const chars = "01SRGN_PYTHON_DJANGO_FASTAPI_GENAI_RAG_01".split("");
    const fontSize = 11;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 7, 0.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        ctx.fillStyle = "rgba(34, 211, 238, 0.08)";
        ctx.fillText(text, x, y * fontSize);

        const headColor = i % 9 === 0 ? CYBER_PURPLE : i % 7 === 0 ? DEDSEC_YELLOW : DEDSEC_CYAN;
        ctx.fillStyle = headColor;
        ctx.globalAlpha = 0.2;
        ctx.fillText(text, x, y * fontSize);
        ctx.globalAlpha = 1;

        if (y * fontSize > canvas.height && Math.random() > 0.962) {
          drops[i] = 0;
        }
        drops[i] += 0.55 + Math.random() * 0.3;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resize();
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-[0.075]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// Film grain overlay — cinematic Cyberpunk feel
function FilmGrain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[997] opacity-[0.055] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        animation: "grain 0.6s steps(4) infinite",
      }}
    />
  );
}

// Scanline overlay
function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[999] mix-blend-screen opacity-[0.032]"
      style={{
        backgroundImage: `repeating-linear-gradient(0deg,
            transparent, transparent 2px,
            rgba(34, 211, 238, 0.45) 2px, transparent 3px)`,
      }}
    />
  );
}

// Floating Hacker Particles
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, char: string, size: number, color: string, duration: number, delay: number }>>([]);

  useEffect(() => {
    const chars = ["+", "×", "< />", "{ }", "01", "■", "▲", "[]", "SYS_ERR", "HEX", "404", "ROOT"];
    const colors = [DEDSEC_CYAN, CYBER_PURPLE, DEDSEC_YELLOW, CYBER_PINK];
    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      char: chars[Math.floor(Math.random() * chars.length)],
      size: Math.random() * 14 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute font-mono font-bold mix-blend-screen whitespace-nowrap"
          style={{ left: `${p.x}vw`, top: `${p.y}vh`, fontSize: p.size, color: p.color }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 20}vh`, `${p.y}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() > 0.5 ? 6 : -6)}vw`, `${p.x}vw`],
            rotate: [0, 180, 360],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}

// Sonar Ripples Effect
function SonarRipples() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center overflow-hidden mix-blend-screen opacity-20">
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#22D3EE]/60"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: '150vw', height: '150vw', opacity: 0 }}
          transition={{ duration: 8, delay: i * 2.5, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Interactive Hex Grid
function InteractiveHexGrid() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none opacity-20 overflow-hidden mix-blend-screen"
         style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='100' viewBox='0 0 60 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%23C084FC' stroke-width='1'/%3E%3C/svg%3E")`,
           backgroundSize: '60px 100px',
           maskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
           WebkitMaskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
         }}
    />
  );
}

// Custom cursor — hacking crosshair with trailing glow
function CustomCursor({ mousePos, show }: { mousePos: { x: number; y: number }; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Trail */}
          <motion.div
            className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-screen"
            style={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
            animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
            transition={{ type: "spring", damping: 18, stiffness: 200, mass: 0.4 }}
          >
            <div className="w-[32px] h-[32px] rounded-full bg-[#FDE047] opacity-[0.08] blur-[12px]" />
          </motion.div>
          {/* Crosshair */}
          <motion.div
            className="fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-screen"
            style={{ x: mousePos.x - 10, y: mousePos.y - 10 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div className="relative w-[20px] h-[20px]">
              <div className="absolute inset-0 blur-[10px] bg-[#FDE047] opacity-[0.5] animate-pulse" />
              <div className="relative w-[20px] h-[20px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[18px] h-[1.5px] bg-[#FDE047] shadow-[0_0_8px_#FDE047]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[1.5px] h-[18px] bg-[#FDE047] shadow-[0_0_8px_#FDE047]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[5px] h-[5px] border border-[#FDE047] rotate-45 shadow-[0_0_6px_#FDE047]" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
// GLITCH TEXT
// ═══════════════════════════════════════════════════════════════
function GlitchText({
  children,
  className = "",
  active = false,
  color = DEDSEC_YELLOW,
  as = "span",
}: {
  children: string;
  className?: string;
  active?: boolean;
  color?: string;
  as?: "span" | "div";
}) {
  const [glitchStep, setGlitchStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setGlitchStep(Math.floor(Math.random() * 5));
    }, 95);
    return () => clearInterval(interval);
  }, [active]);

  const Tag = as;

  return (
    <Tag className={`relative inline-block ${className}`} style={{ color }}>
      <span className="relative z-10">{children}</span>
      {active && (
        <>
          <span
            className="absolute inset-0 z-0"
            style={{
              color: CYBER_PURPLE,
              clipPath:
                glitchStep === 0
                  ? "inset(18% 0 50% 0)"
                  : glitchStep === 1
                    ? "inset(52% 0 12% 0)"
                    : "inset(0 0 0 0)",
              transform: `translate(${glitchStep % 2 === 0 ? "-1.3px" : "1.3px"}, 0) skew(${glitchStep * 0.35}deg)`,
              opacity: 0.9,
              mixBlendMode: "screen",
            }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 z-0"
            style={{
              color: CYBER_PINK,
              clipPath:
                glitchStep === 2
                  ? "inset(33% 0 28% 0)"
                  : glitchStep === 3
                    ? "inset(72% 0 6% 0)"
                    : "inset(0 0 0 0)",
              transform: `translate(${glitchStep % 2 === 0 ? "1.1px" : "-1.1px"}, 0)`,
              opacity: 0.55,
            }}
          >
            {children}
          </span>
        </>
      )}
    </Tag>
  );
}

// ═══════════════════════════════════════════════════════════════
// DECODER TEXT & PROGRESS BAR
// ═══════════════════════════════════════════════════════════════
function DecoderText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const [content, setContent] = useState(text.replace(/./g, '0'));
  
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let iterations = 0;
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setContent(prev => prev.split('').map((char, index) => {
          if (index < iterations) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));
        
        if (iterations >= text.length) clearInterval(interval);
        iterations += 1/3;
      }, 30);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className={className}>{content}</span>;
}

function ProgressBar({ level }: { level: string }) {
  const percentage = level === "EXPERT" || level === "PRIMARY" ? 95 : level === "ADVANCED" ? 80 : 60;
  const color = level === "EXPERT" || level === "PRIMARY" ? DEDSEC_YELLOW : level === "ADVANCED" ? DEDSEC_CYAN : CYBER_PURPLE;
  
  return (
    <div className="w-full h-[2px] bg-[#111] mt-[6px] relative overflow-hidden rounded-full">
      <motion.div 
        className="absolute top-0 left-0 h-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTERACTIVE EFFECTS — Digital scan + hacked ripple
// ═══════════════════════════════════════════════════════════════

// Digital scan — vertical line sweeps across on hover
function DigitalScan({ children, className = "", color = CYBER_PURPLE }: { children: React.ReactNode; className?: string; color?: string }) {
  const [scanning, setScanning] = useState(false);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setScanning(true)}
      onMouseLeave={() => setScanning(false)}
    >
      {children}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `linear-gradient(90deg, transparent 30%, ${color}35 50%, ${color}90 50%, transparent 51%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Hacked ripple — glitch burst on click
function useHackedClick() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextId = useRef(0);

  const trigger = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextId.current++;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 520);
  }, []);

  const RippleOverlay = (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="absolute"
          style={{ left: r.x, top: r.y }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              background: `radial-gradient(circle, ${DEDSEC_YELLOW}55 0%, ${CYBER_PURPLE}33 40%, transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[120px] h-[2px]"
            style={{ background: DEDSEC_YELLOW, boxShadow: `0 0 10px ${DEDSEC_YELLOW}` }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: [0, 3, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.35 }}
          />
        </motion.div>
      ))}
    </div>
  );

  return { trigger, RippleOverlay };
}

// ═══════════════════════════════════════════════════════════════
// TERMINAL CONSOLE — Advanced interactive bash
// ═══════════════════════════════════════════════════════════════

type TerminalCommand = {
  name: string;
  label: string;
  desc: string;
  color: string;
};

const COMMANDS: TerminalCommand[] = [
  { name: "about", label: "about", desc: "load identity", color: DEDSEC_YELLOW },
  { name: "stack", label: "stack", desc: "show skills", color: DEDSEC_CYAN },
  { name: "history", label: "history", desc: "view logs", color: DEDSEC_GREEN },
  { name: "contact", label: "contact", desc: "reach out", color: CYBER_PINK },
  { name: "help", label: "help", desc: "list cmds", color: CYBER_PURPLE },
  { name: "clear", label: "clear", desc: "wipe log", color: "#666" },
];

function TerminalConsole({
  onCommand,
}: {
  onCommand: (cmd: string) => void;
}) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "[DEDSEC_SHELL] session initialized",
    "type 'help' or click a command chip below",
  ]);
  const [glitching, setGlitching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const execute = (cmd: string) => {
    const cleaned = cmd.trim().toLowerCase();
    if (!cleaned) return;

    // Brief glitch effect on execution
    setGlitching(true);
    setTimeout(() => setGlitching(false), 120);

    const newHistory = [...history, `$ ${cmd}`];

    switch (cleaned) {
      case "help":
        newHistory.push(
          "── AVAILABLE COMMANDS ──",
          "  about    → load identity manifest",
          "  stack    → enumerate dependencies",
          "  history  → open contribution logs",
          "  contact  → open secure channel",
          "  clear    → wipe console history",
          "  whoami   → current user",
          "────────────────────────"
        );
        break;
      case "about":
        newHistory.push("→ routing to IDENTITY_MANIFEST...");
        onCommand("profile");
        break;
      case "stack":
      case "skills":
      case "tools":
        newHistory.push("→ loading TECHNICAL_STACK...");
        onCommand("stack");
        break;
      case "history":
      case "logs":
        newHistory.push("→ opening CONTRIBUTION_HISTORY...");
        onCommand("logs");
        break;
      case "contact":
        newHistory.push("→ opening ENCRYPTED_CHANNEL...");
        onCommand("contact");
        break;
      case "whoami":
        newHistory.push(
          "omar_wael @ SRGN_of_DTH",
          "role: python_backend_dev",
          "spec: generative_ai_agents",
          "location: cairo / remote"
        );
        break;
      case "clear":
      case "cls":
        setHistory(["[DEDSEC_SHELL] console cleared"]);
        setInput("");
        return;
      case "sudo":
        newHistory.push("[ACCESS_GRANTED] root privileges active");
        break;
      case "ls":
        newHistory.push("identity.manifest  dependencies.lock  history.log  projects/");
        break;
      case "pwd":
        newHistory.push("/home/omar/dedsec-workspace");
        break;
      case "date":
        newHistory.push(new Date().toUTCString());
        break;
      case "neofetch":
        newHistory.push(
          "   ▓▓▓▓   OS: DedSec WS v2.4.1",
          "   ▓  ▓   Host: Omar Wael [SRGN_of_DTH]",
          "   ▓▓▓▓   Shell: zsh 5.9 • Uptime: 99.97%",
          "          Kernel: Python 3.11.8 LTS"
        );
        break;
      case "exit":
        newHistory.push("[logout] session terminated");
        break;
      default:
        newHistory.push(
          `⚠ command not found: '${cleaned}'`,
          `  → try 'help' for available commands`
        );
    }

    setHistory(newHistory.slice(-12));
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className={`relative rounded-[12px] border border-[${CYBER_PURPLE}]/25 bg-[#070709]/95 backdrop-blur-[8px] overflow-hidden transition-all ${glitching ? "saturate-[1.3] contrast-[1.15] animate-[glitch_0.12s_steps(2)]" : ""}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-[10px] sm:px-[15px] h-[38px] border-b border-[#141417] bg-[#08080B] gap-2">
        <div className="flex items-center gap-[8px] sm:gap-[12px] text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.24em] font-bold min-w-0">
          <div className="flex gap-[5px]">
            <span className="h-[7px] w-[7px] rounded-[1px] bg-[#FDE047] shadow-[0_0_6px_#FDE047]" />
            <span className="h-[7px] w-[7px] rounded-[1px] bg-[#C084FC] shadow-[0_0_6px_#C084FC]" />
            <span className="h-[7px] w-[7px] rounded-[1px] bg-[#333]" />
          </div>
          <span className="text-[#C084FC]">DEDSEC_SHELL</span>
          <span className="text-[#444] hidden sm:inline">—</span>
          <span className="text-[#666] font-medium tracking-[0.2em] hidden sm:inline">bash 5.1 • tty/1</span>
        </div>
        <div className="flex items-center gap-[7px] sm:gap-[9px] text-[8px] sm:text-[9px] text-[#555] font-bold tracking-[0.18em] sm:tracking-[0.22em] shrink-0">
          <span className="h-[6px] w-[6px] rounded-full bg-[#A3E635] animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Command chips */}
      <div className="flex flex-wrap gap-[7px] px-[14px] py-[12px] border-b border-[#141417] bg-[#09090B]">
        {COMMANDS.map((cmd) => (
          <motion.button
            key={cmd.name}
            onClick={() => execute(cmd.name)}
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="group relative px-[12px] h-[29px] rounded-[6px] border border-[#1D1D22] bg-[#0B0B0D] hover:border-[#2A2A30] transition-all overflow-hidden"
            style={{ "--chip-color": cmd.color } as React.CSSProperties}
          >
            <div className="relative flex items-center gap-[8px]">
              <span className="text-[#555] font-mono">$</span>
              <span className="text-[11px] tracking-[0.14em] font-[650]" style={{ color: cmd.color }}>
                {cmd.label}
              </span>
              <span className="text-[9px] text-[#555] font-medium tracking-[0.16em] hidden sm:block">
                {cmd.desc}
              </span>
            </div>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              style={{
                background: `linear-gradient(90deg, transparent, ${cmd.color}22, transparent)`,
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Output history */}
      <div
        ref={scrollRef}
        className="px-[15px] py-[13px] font-mono text-[12px] leading-[1.58] min-h-[130px] max-h-[180px] overflow-y-auto space-y-[3px]"
      >
        {history.map((line, i) => {
          const isPrompt = line.startsWith("$");
          const isBox = line.startsWith("┌") || line.startsWith("│") || line.startsWith("└");
          const isError = line.startsWith("⚠");
          const isRoute = line.startsWith("→");
          const isInfo = line.includes("[DEDSEC_SHELL]") || line.includes("[ACCESS_GRANTED]") || line.includes("[logout]");

          return (
            <motion.div
              key={`${i}-${line}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={
                isPrompt
                  ? "text-[#FDE047] font-[600]"
                  : isBox
                    ? "text-[#C084FC]"
                    : isError
                      ? "text-[#F472B6]"
                      : isRoute
                        ? "text-[#A3E635]"
                        : isInfo
                          ? "text-[#818CF8]"
                          : "text-[#A1A1AA]"
              }
            >
              {line}
            </motion.div>
          );
        })}
      </div>

      {/* Input line */}
      <div className="flex items-center gap-[9px] px-[15px] h-[44px] border-t border-[#141417] bg-[#08080B]">
        <span className="text-[#FDE047] font-[700] text-[12.5px]">omar@dedsec</span>
        <span className="text-[#444]">:</span>
        <span className="text-[#999]">~</span>
        <span className="text-[#555]">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") execute(input);
          }}
          className="flex-1 bg-transparent outline-none text-[13px] text-[#E0E0E6] placeholder-[#444] font-[500] tracking-[0.01em]"
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
        />
        <motion.span
          className="w-[8px] h-[14px] bg-[#FDE047]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAME TAG WITH ALIAS
// ═══════════════════════════════════════════════════════════════
function NameTag() {
  return (
    <div className="inline-flex flex-col gap-[4px]">
      <div className="flex items-baseline gap-[12px] flex-wrap">
        <h1 className="text-[34px] xs:text-[40px] sm:text-[60px] leading-[0.9] sm:leading-[0.86] tracking-[-0.012em] font-[750]">
          <GlitchText color="#F0F0F3">OMAR</GlitchText>
          <GlitchText color={DEDSEC_YELLOW} active className="ml-[0.06em]"> WAEL</GlitchText>
        </h1>
      </div>
      <div className="flex items-center gap-[10px] pl-[2px]">
        <span className="text-[#444]">[</span>
        <GlitchText color={CYBER_PURPLE} active className="text-[12px] sm:text-[14px] tracking-[0.28em] font-[700]">
          {SRGN_ALIAS}
        </GlitchText>
        <span className="text-[#444]">]</span>
        <div className="h-[1px] w-[32px] bg-gradient-to-r from-[#C084FC] to-transparent" />
        <span className="text-[10px] tracking-[0.22em] text-[#666] font-bold">DEDSEC_ID</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOOT SEQUENCE (ctOS / DedSec style)
// ═══════════════════════════════════════════════════════════════
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const bootLogs = [
      "ENSURING YOU ARE WORTHY ENOUGH TO OPEN OMAR_WAEL PORTFOLIO OR NOT...",
      "MMM... YOU LOOK HANDSOME ENOUGH TO SEE OMAR_WAEL PORTFOLIO...",
      "WATCHING YOUR SEARCH HISTORY TO SEE IF YOU ARE WITH GOOD MANNERS OR NOT X_X...",
      "WELCOME TO THE PORTFOLIO OF OMAR WAEL , THE BEST DEVELOPER EVER (⌐■_■)...",
      "I HOPE YOU ENJOY MY PORTFOLIO <3 ",
    ];
    
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLines(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      }
    }, 300);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100000] bg-[#050507] text-[#FDE047] font-mono flex flex-col p-4 sm:p-8 justify-center items-center"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full max-w-2xl z-10 relative">
        <div className="text-[16px] sm:text-[24px] mb-6 sm:mb-8 animate-pulse text-center tracking-[0.2em] sm:tracking-[0.4em] font-bold">
          <GlitchText active color="#FDE047">DEDSEC_OS_INITIALIZING</GlitchText>
        </div>
        
        <div className="space-y-2 mb-6 sm:mb-8 h-[200px] text-[11px] sm:text-[14px]">
          {lines.map((line, i) => (
            <div key={i} className="opacity-80">
              <span className="text-[#A3E635] mr-2">[{new Date().toISOString().split('T')[1].substring(0, 8)}]</span>
              {line}
            </div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-3 h-5 bg-[#FDE047] mt-2 inline-block"
          />
        </div>

        <div className="w-full h-1 bg-[#1A1A1E] relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#22D3EE]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-[12px] text-[#22D3EE] tracking-[0.2em]">
          {Math.min(100, progress)}% LOADED
        </div>
      </div>
      <FilmGrain />
      <Scanlines />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE PICTURE W/ HACKER GLITCH
// ═══════════════════════════════════════════════════════════════
function HackedProfilePic() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const springConfig = { damping: 15, stiffness: 300, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-[14px] overflow-hidden group border-2 border-[#C084FC]/40 shadow-[0_0_20px_rgba(192,132,252,0.2)] shrink-0 cursor-crosshair"
      style={{ rotateX: springRotateX, rotateY: springRotateY, perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glitch effects layers */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-60 pointer-events-none" />
      <img 
        src="/profile.jpg" 
        alt="Omar Wael" 
        className="w-full h-full object-cover grayscale-[0.3] contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 mix-blend-overlay opacity-20 group-hover:opacity-50 transition-opacity bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] pointer-events-none" />
      
      {/* Scanning Line */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-[#22D3EE]/60 shadow-[0_0_15px_#22D3EE] z-20 pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Glitch Boxes */}
      <motion.div 
        className="absolute top-[20%] left-[-10%] w-[120%] h-[15%] bg-[#C084FC]/20 mix-blend-screen z-20 pointer-events-none"
        animate={{ 
          opacity: [0, 1, 0, 0, 1, 0],
          y: [0, -10, 10, -5, 0, 0],
          scaleX: [1, 1.05, 0.95, 1.1, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 0.4, 1] }}
      />

      <div className="absolute bottom-2 right-2 z-30 bg-[#050507]/90 px-[6px] py-[2px] border border-[#FDE047]/60 text-[9px] text-[#FDE047] font-mono tracking-widest backdrop-blur-sm pointer-events-none">
        REC <span className="inline-block w-1.5 h-1.5 bg-[#F472B6] rounded-full animate-pulse ml-[2px]" />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [booted, setBooted] = useState(false);
  const [activeView, setActiveView] = useState("profile");
  const [glitchingSkill, setGlitchingSkill] = useState<string | null>(null);
  const [borderGlitch, setBorderGlitch] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);
  const { scrollY } = useScroll();
  const { trigger: triggerHacked, RippleOverlay } = useHackedClick();

  // Scroll-based border glitch
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      if (v > 50 && v % 220 < 14) {
        setBorderGlitch(true);
        setTimeout(() => setBorderGlitch(false), 85 + Math.random() * 35);
      }
    });
    return () => unsub();
  }, [scrollY]);

  // Custom cursor — disabled on touch devices
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window;
    if (isTouchDevice) {
      setShowCursor(false);
      return;
    }
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setShowCursor(true);
    };
    window.addEventListener("pointermove", handleMove);
    document.documentElement.style.cursor = "none";
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.style.cursor = "auto";
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "1" && e.altKey) setActiveView("profile");
      if (e.key === "2" && e.altKey) setActiveView("stack");
      if (e.key === "3" && e.altKey) setActiveView("logs");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const views = [
    { id: "profile", label: "about.sh", desc: "IDENTITY" },
    { id: "stack", label: "stack.env", desc: "TOOLCHAIN" },
    { id: "logs", label: "history.log", desc: "TIMELINE" },
    { id: "contact", label: "contact", desc: "CONNECT" },
  ];

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <div
        className="min-h-screen bg-[#050507] text-[#E8E8E8] selection:bg-[#FDE047]/25 selection:text-[#FDE047] overflow-x-hidden"
        style={{ fontFamily: "'Fira Code', 'JetBrains Mono', monospace", opacity: booted ? 1 : 0, transition: "opacity 0.5s ease-in" }}
        onClick={triggerHacked}
      >
        {/* Atmosphere layers */}
        <DataRain />
        <InteractiveHexGrid />
        <SonarRipples />
        <FloatingParticles />
        <FilmGrain />
        <Scanlines />
        <CustomCursor mousePos={mousePos} show={showCursor} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[998]"
        style={{ background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.93) 100%)` }}
      />

      <div 
        className="relative z-10 min-h-screen flex flex-col transition-transform"
        style={borderGlitch ? {
          filter: "drop-shadow(4px 0px 0px rgba(255,0,255,0.7)) drop-shadow(-4px 0px 0px rgba(0,255,255,0.7))",
          transform: `translate(${Math.random() * 8 - 4}px, ${Math.random() * 8 - 4}px) skewX(${Math.random() * 4 - 2}deg)`
        } : {}}
      >
        {/* ═══ HEADER ═══ */}
        <header className="sticky top-0 z-50 border-b border-[#C084FC]/15 bg-[#08080A]/92 backdrop-blur-[14px]">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-7">
            <div className="h-[50px] flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.22em] font-bold gap-3">
              <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                <div className="flex items-center gap-[9px]">
                  <span className="h-[8px] w-[8px] bg-[#FDE047] shadow-[0_0_10px_#FDE047] animate-pulse rounded-[1px]" />
                  <span className="text-[#FDE047] tracking-[0.28em]">DEDSEC</span>
                </div>
                <div className="hidden sm:flex items-center gap-[13px] text-[#666] font-medium">
                  <span className="text-[#2A2A30]">—</span>
                  <span>OMAR_WAEL</span>
                  <span className="text-[#333]">•</span>
                  <span className="text-[#C084FC]">{SRGN_ALIAS}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                <span className="hidden md:block text-[#555] text-[10px] tracking-[0.24em]">[ UID_0x7B ]</span>
                <div className="hidden md:flex items-center gap-[7px]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#A3E635] animate-pulse" />
                  <span className="text-[#888] text-[10px] tracking-[0.22em]">ONLINE</span>
                </div>
                <motion.span
                  className="text-[#818CF8] tabular-nums font-[650]"
                  animate={{ opacity: [1, 0.55, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  21:47:33
                </motion.span>
              </div>
            </div>
          </div>
          {RippleOverlay}
        </header>

        <main className="flex-1">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-7 py-8 sm:py-[54px]">
            {/* ═══ HERO ═══ */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="mb-[58px]"
            >
              <div
                className={`relative rounded-[14px] border bg-[#0A0A0D] overflow-hidden transition-all duration-100 ${
                  borderGlitch
                    ? "border-[#FDE047]/70 shadow-[0_0_0_1px_#FDE047,0_0_30px_-8px_#FDE047] saturate-[1.3] contrast-[1.15]"
                    : "border-[#C084FC]/22 shadow-[inset_0_1px_0_rgba(192,132,252,0.04),0_0_0_1px_rgba(0,0,0,0.5),0_35px_90px_-30px_rgba(192,132,252,0.15)]"
                }`}
              >
                {/* Animated top accent */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-[1px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${CYBER_PURPLE}, ${DEDSEC_YELLOW}, ${CYBER_PURPLE}, transparent)`,
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Header bar */}
                <div className="flex items-center justify-between px-3 sm:px-5 h-[42px] border-b border-[#16161A] bg-[#08080B]">
                  <div className="flex items-center gap-[11px] text-[11px] tracking-[0.22em] font-bold">
                    <div className="flex gap-[5px]">
                      <span className="h-[8px] w-[8px] rounded-[1px] bg-[#FDE047] shadow-[0_0_7px_#FDE047]" />
                      <span className="h-[8px] w-[8px] rounded-[1px] bg-[#C084FC] shadow-[0_0_7px_#C084FC]" />
                      <span className="h-[8px] w-[8px] rounded-[1px] bg-[#818CF8] shadow-[0_0_7px_#818CF8]" />
                    </div>
                    <span className="text-[#C084FC] tracking-[0.15em] sm:tracking-[0.26em] text-[10px] sm:text-[11px] mobile-tight-tracking">whoami --verbose</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-[9px] text-[10px] text-[#555] font-bold tracking-[0.22em]">
                    <span>BASH</span>
                    <span className="text-[#333]">•</span>
                    <span>TTY</span>
                  </div>
                </div>

                {/* Hero content */}
                <div className="px-4 sm:px-10 py-[30px] sm:py-[46px]">
                  <motion.div variants={staggerItem} className="mb-[28px] flex flex-col sm:flex-row items-start sm:items-center gap-[24px]">
                    <HackedProfilePic />
                    <NameTag />
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-[16px] mb-[30px]">
                    {/* Primary core */}
                    <div className="flex flex-wrap items-baseline gap-x-[18px] gap-y-[10px] text-[15px] sm:text-[16px]">
                      <div className="flex items-center gap-[12px]">
                        <span className="relative flex h-[9px] w-[9px]">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-70"></span>
                          <span className="relative inline-flex rounded-full h-[9px] w-[9px] bg-[#22D3EE] shadow-[0_0_11px_#22D3EE]"></span>
                        </span>
                        <span className="text-[#FDE047] tracking-[0.15em] font-[750]">PYTHON_DEVELOPER</span>
                      </div>
                      <span className="text-[#2A2A30] hidden sm:block">⟶</span>
                      <span className="text-[#D8D8DE] tracking-[0.012em] font-[550]">GENERATIVE_AI_AGENTS</span>
                    </div>

                    <div className="max-w-[760px] text-[14.5px] leading-[1.72] text-[#C7C7CF] font-[450] tracking-[0.005em]">
                      Primary focus on <span className="text-[#FDE047] font-[650]">Python backend development</span> with Django and FastAPI.
                      Advanced specialization in <span className="text-[#22D3EE] font-[600]">Generative AI agents</span> — RAG pipelines,
                      fine-tuning workflows, and orchestration systems for production.
                    </div>
                  </motion.div>

                  {/* Status pills */}
                  <motion.div variants={staggerItem} className="grid sm:grid-cols-3 gap-[10px]">
                    {[
                      { k: "ROLE", v: "PYTHON_BACKEND", c: DEDSEC_YELLOW },
                      { k: "FOCUS", v: "GEN_AI_AGENTS", c: DEDSEC_CYAN },
                      { k: "ALIAS", v: SRGN_ALIAS, c: CYBER_PURPLE },
                    ].map((pill) => (
                      <DigitalScan key={pill.k} color={pill.c}>
                        <motion.div
                          whileHover={{ y: -1, scale: 1.01 }}
                          className="group h-auto min-h-[40px] py-[8px] px-[12px] sm:px-[14px] rounded-[9px] border border-[#1E1E24] bg-[#09090C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[5px] sm:gap-0 hover:border-[#2A2A32] transition-colors"
                        >
                          <span className="text-[10px] tracking-[0.24em] text-[#666] font-bold group-hover:text-[#888] transition-colors">
                            {pill.k}
                          </span>
                          <span className="text-[12px] tracking-[0.05em] font-[700]" style={{ color: pill.c }}>
                            {pill.v}
                          </span>
                        </motion.div>
                      </DigitalScan>
                    ))}
                  </motion.div>
                </div>

                {/* Terminal prompt */}
                <div className="h-[43px] px-4 sm:px-10 border-t border-[#141417] bg-[#070709] flex items-center gap-[8px] sm:gap-[10px] text-[11px] sm:text-[12px] font-[550] overflow-x-auto whitespace-nowrap scrollbar-hide">
                  <span className="text-[#FDE047] font-[650]">omar@blm41th</span>
                  <span className="text-[#444]">:</span>
                  <span className="text-[#999]">~</span>
                  <span className="text-[#444]">$</span>
                  <span className="text-[#C084FC] tracking-[0.01em]">cat identity.manifest</span>
                </div>
              </div>
            </motion.section>

            {/* ═══ TERMINAL CONSOLE ═══ */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-[52px]"
            >
              <div className="mb-[14px] flex items-center gap-[8px] sm:gap-[11px] text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.26em] font-bold text-[#777]">
                <span className="text-[#FDE047]">➜</span>
                INTERACTIVE_SHELL
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#C084FC]/40 via-[#222] to-transparent" />
                <span className="text-[10px] text-[#555] font-medium tracking-[0.22em]">v2.4</span>
              </div>
              <TerminalConsole onCommand={setActiveView} />
            </motion.section>

            {/* ═══ VIEW SWITCHER ═══ */}
            <div className="flex items-center gap-[6px] sm:gap-[10px] mb-[26px] overflow-x-auto scrollbar-hide pb-[2px]">
              {views.map((view, i) => (
                <motion.button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className={`relative px-[10px] sm:px-[17px] h-[38px] sm:h-[45px] rounded-[8px] sm:rounded-[10px] border font-[600] tracking-[-0.01em] transition-all whitespace-nowrap shrink-0 ${
                    activeView === view.id
                      ? "bg-[#121217] border-[#FDE047]/65 text-[#FDE047] shadow-[inset_0_0_0_1px_rgba(253,224,71,0.08),0_0_25px_-8px_rgba(253,224,71,0.3)]"
                      : "bg-[#0B0B0E] border-[#C084FC]/20 text-[#B8B8C0] hover:border-[#C084FC]/45 hover:text-[#E8E8EE]"
                  }`}
                >
                  <span className="text-[11.5px] sm:text-[13.5px]">$ {view.label}</span>
                  <span className="ml-[5px] sm:ml-[9px] text-[8px] sm:text-[10px] tracking-[0.18em] opacity-60 font-bold hidden xs:inline">{view.desc}</span>
                  {activeView === view.id && (
                    <motion.div
                      layoutId="viewIndicator"
                      className="absolute -bottom-[1px] left-[10px] sm:left-[17px] right-[10px] sm:right-[17px] h-[2px] bg-[#FDE047] shadow-[0_0_10px_#FDE047]"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-[26px] items-start">
              <div>
                <AnimatePresence mode="wait">
                  {/* ─── PROFILE ─── */}
                  {activeView === "profile" && (
                    <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                      <Window title="IDENTITY_MANIFEST" subtitle={`[ ${SRGN_ALIAS} ]`} accent={DEDSEC_YELLOW}>
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-[22px]">
                          <motion.div variants={staggerItem}>
                            <h3 className="text-[12px] sm:text-[13px] tracking-[0.18em] sm:tracking-[0.25em] text-[#FDE047] font-[750] mb-[14px] flex items-center gap-[11px]">
                              <span className="h-[2.5px] w-[21px] bg-[#FDE047] shadow-[0_0_13px_#FDE047]/65" />
                              <DecoderText text="PROFESSIONAL_CORE" delay={200} />
                            </h3>
                            <div className="space-y-[13px] text-[14.5px] leading-[1.75] text-[#D0D0D8] font-[450] tracking-[0.006em]">
                              <p>
                                <GlitchText color="#FDE047" active className="font-[700]">Python Developer</GlitchText>{" "}
                                building production backend systems with
                                <span className="text-[#EDEDF3] font-[600]"> Django and FastAPI</span>. I architect data models,
                                design RESTful APIs, and optimize for performance in team environments.
                              </p>
                              <p>
                                Advanced specialization in <span className="text-[#22D3EE] font-[650]">Generative AI Agents</span> — designing RAG systems,
                                fine-tuning pipelines, and agent orchestration frameworks that connect LLM reasoning to reliable tool execution.
                              </p>
                            </div>
                          </motion.div>

                          <motion.div variants={staggerItem} className="grid sm:grid-cols-2 gap-[12px] pt-[4px]">
                            {[
                              { k: "PRIMARY_CORE", v: "Python • Django • FastAPI • PostgreSQL", c: DEDSEC_YELLOW },
                              { k: "AI_SPECIALIZATION", v: "RAG • Fine-tuning • Agent orchestration", c: DEDSEC_CYAN },
                              { k: "DEPLOYMENT", v: "Docker • Linux • Git • CI/CD", c: CYBER_PURPLE },
                              { k: "FRONTEND", v: "React • JavaScript • HTML/CSS", c: CYBER_INDIGO },
                            ].map((item) => (
                              <DigitalScan key={item.k} color={item.c}>
                                <motion.div
                                  whileHover={{ scale: 1.01, y: -1 }}
                                  onHoverStart={() => setGlitchingSkill(item.k)}
                                  onHoverEnd={() => setGlitchingSkill(null)}
                                  className="group relative rounded-[9px] border border-[#18181C] bg-[#0B0B0D] px-[14px] py-[13px] hover:border-[#222] transition-colors"
                                >
                                  <GlitchText
                                    active={glitchingSkill === item.k}
                                    color={glitchingSkill === item.k ? item.c : "#E8E8EE"}
                                    className="text-[10px] tracking-[0.23em] font-bold block mb-[7px]"
                                  >
                                    {item.k}
                                  </GlitchText>
                                  <div className="text-[12.5px] leading-[1.53] text-[#C5C5CC] font-[480] tracking-[0.004em]">
                                    {item.v}
                                  </div>
                                </motion.div>
                              </DigitalScan>
                            ))}
                          </motion.div>
                        </motion.div>
                      </Window>
                    </motion.div>
                  )}

                  {/* ─── STACK ─── */}
                  {activeView === "stack" && (
                    <motion.div key="stack" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                      <Window title="TECHNICAL_STACK" subtitle="dependencies.lock" accent={DEDSEC_CYAN}>
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-[24px]">
                          {Object.entries(TECH_STACK).map(([category, items]) => (
                            <motion.div key={category} variants={staggerItem}>
                              <h4 className="text-[11px] tracking-[0.28em] text-[#C084FC] font-[750] mb-[12px] uppercase flex items-center gap-[10px]">
                                <DecoderText text={category} delay={300} />
                                <span className="h-px flex-1 bg-gradient-to-r from-[#C084FC]/40 to-transparent" />
                                <span className="text-[10px] text-[#666] font-bold tracking-[0.22em]">{items.length}</span>
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[9px]">
                                {items.map((tech) => (
                                  <DigitalScan key={tech.name} color={tech.level === "PRIMARY" || tech.level === "EXPERT" ? DEDSEC_YELLOW : CYBER_PURPLE}>
                                    <motion.div
                                      whileHover={{ scale: 1.03, y: -2 }}
                                      onHoverStart={() => setGlitchingSkill(tech.name)}
                                      onHoverEnd={() => setGlitchingSkill(null)}
                                      className="group relative h-[70px] rounded-[9px] border border-[#17171B] bg-[#0A0A0D] px-[12px] flex flex-col justify-center hover:border-[#C084FC]/50 hover:bg-[#0E0E13] transition-all overflow-hidden"
                                    >
                                      <AnimatePresence>
                                        {glitchingSkill === tech.name && (
                                          <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0, 1, 0] }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.32 }}
                                            className="absolute inset-0 bg-[#C084FC]/[0.05] mix-blend-screen pointer-events-none"
                                            style={{ clipPath: "polygon(0 20%, 100% 15%, 100% 40%, 0 45%)" }}
                                          />
                                        )}
                                      </AnimatePresence>

                                      <div className="relative">
                                        <GlitchText
                                          active={glitchingSkill === tech.name}
                                          color={
                                            tech.level === "PRIMARY" || tech.level === "EXPERT"
                                              ? DEDSEC_YELLOW
                                              : tech.level === "ADVANCED"
                                                ? "#E8E8EE"
                                                : "#B0B0B8"
                                          }
                                          className="text-[13px] font-[700] tracking-[0.01em] leading-none block mb-[5px]"
                                        >
                                          {tech.name}
                                        </GlitchText>
                                        <div className="text-[9px] tracking-[0.22em] font-bold flex items-center gap-[6px]">
                                          <span
                                            className={
                                              tech.level === "EXPERT" || tech.level === "PRIMARY"
                                                ? "text-[#FDE047]"
                                                : tech.level === "ADVANCED"
                                                  ? "text-[#22D3EE]"
                                                  : "text-[#999]"
                                            }
                                          >
                                            <DecoderText text={tech.level} delay={500} />
                                          </span>
                                          <span className="text-[#333]">•</span>
                                          <span className="text-[#555]">READY</span>
                                        </div>
                                        <ProgressBar level={tech.level} />
                                      </div>

                                      {(tech.level === "PRIMARY" || tech.name === "PYTHON") && (
                                        <motion.div
                                          className="absolute inset-0 rounded-[9px] border border-[#FDE047]/35 pointer-events-none"
                                          animate={{ opacity: [0.4, 0, 0.4] }}
                                          transition={{ duration: 2.8, repeat: Infinity }}
                                        />
                                      )}
                                    </motion.div>
                                  </DigitalScan>
                                ))}
                              </div>
                            </motion.div>
                          ))}

                          <motion.div
                            variants={staggerItem}
                            className="pt-[6px] text-[11px] text-[#888] tracking-[0.012em] font-[500] border-t border-[#141416] pt-[14px] flex flex-wrap gap-x-[18px] gap-y-[6px]"
                          >
                            <span>Total: <span className="text-[#E8E8EE] font-[600]">17 technologies</span></span>
                            <span>•</span>
                            <span>Core: <span className="text-[#FDE047] font-[600]">Python backend</span></span>
                            <span>+</span>
                            <span><span className="text-[#22D3EE] font-[600]">Generative AI</span></span>
                          </motion.div>
                        </motion.div>
                      </Window>
                    </motion.div>
                  )}

                  {/* ─── TIMELINE ─── */}
                  {activeView === "logs" && (
                    <motion.div key="logs" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                      <Window title="CONTRIBUTION_HISTORY" subtitle="git log --stat" accent={DEDSEC_GREEN}>
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-[22px]">
                          {/* ITI - MANDATORY ACCURACY */}
                          <motion.div variants={staggerItem} className="relative pl-[16px] sm:pl-[24px] border-l-[3px] border-[#FDE047]/80">
                            <div className="hidden sm:block absolute -left-[39px] top-0 text-[10px] font-mono text-[#555] tabular-nums w-[32px] text-right font-bold">
                              HEAD
                            </div>

                            <div className="mb-[9px]">
                              <div className="flex flex-wrap items-baseline gap-x-[11px] gap-y-[2px] mb-[5px]">
                                <span className="text-[11px] tracking-[0.22em] text-[#FDE047] font-[750]">2026</span>
                                <span className="text-[#333]">•</span>
                                <span className="text-[14px] tracking-[0.006em] text-[#F0F0F5] font-[650]">
                                  ITI 6 MONTHS INTENSIVE CODE CAMP (ICC)
                                </span>
                              </div>
                              <div className="text-[12.5px] text-[#22D3EE] font-[600] tracking-[0.006em]">
                                Full Stack Development using Python & Generative AI track
                              </div>
                            </div>

                            <div className="text-[13.5px] leading-[1.68] text-[#CFCFD7] font-[450] tracking-[0.005em] mb-[11px]">
                              Intensive 6-month program focused on <span className="text-[#EDEDF3] font-[600]">Python backend development</span> with Django and FastAPI,
                              plus advanced modules in <span className="text-[#FDE047] font-[600]">Generative AI agents</span>, RAG systems, and production deployment with Docker.
                              Completed full-stack capstone projects with emphasis on clean architecture.
                            </div>

                            <div className="flex flex-wrap gap-[7px]">
                              {["PYTHON", "DJANGO", "FASTAPI", "REACT", "POSTGRESQL", "DOCKER", "GENERATIVE_AI"].map((t) => (
                                <span
                                  key={t}
                                  className="px-[9px] h-[23px] inline-flex items-center rounded-[6px] border border-[#1E1E22] bg-[#08080A] text-[10px] tracking-[0.18em] font-bold text-[#B8B8C0]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>

                          {[
                            {
                              date: "2024 — PRESENT",
                              title: "PYTHON BACKEND DEVELOPER",
                              org: "Independent Projects",
                              desc: "Building API-first systems with FastAPI, PostgreSQL, and Docker. Specializing in AI agent backends with proper evaluation frameworks.",
                              tags: ["PYTHON", "FASTAPI", "DOCKER", "GEN_AI"],
                            },
                            {
                              date: "2023 — 2024",
                              title: "FINTECH INTERNSHIPS",
                              org: "NBE • Banking systems",
                              desc: "Python automation, SQL optimization, and secure backend tooling for financial data pipelines.",
                              tags: ["PYTHON", "SQL", "BASH", "SECURITY"],
                            },
                          ].map((exp) => (
                            <motion.div
                              key={exp.title}
                              variants={staggerItem}
                              className="relative pl-[16px] sm:pl-[24px] border-l-[2px] border-[#1A1A1E] hover:border-[#C084FC]/50 transition-colors py-[2px]"
                            >
                              <div className="hidden sm:block absolute -left-[39px] top-[1px] text-[10px] font-mono text-[#444] tabular-nums w-[32px] text-right">
                                {String(exp.date.split("—")[0]).trim().slice(-2)}
                              </div>

                              <div className="mb-[9px]">
                                <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[1px] mb-[4px]">
                                  <span className="text-[10px] tracking-[0.22em] text-[#999] font-bold">{exp.date}</span>
                                  <span className="text-[#333]">•</span>
                                  <span className="text-[13px] tracking-[0.006em] text-[#E8E8EE] font-[620]">{exp.title}</span>
                                </div>
                                <div className="text-[12px] text-[#888] font-[500] tracking-[0.004em]">{exp.org}</div>
                              </div>

                              <div className="text-[13px] leading-[1.64] text-[#BDBDC7] font-[450] tracking-[0.003em] mb-[10px]">
                                {exp.desc}
                              </div>

                              <div className="flex flex-wrap gap-[6px]">
                                {exp.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="px-[8px] h-[21px] inline-flex items-center rounded-[5px] bg-[#09090B] border border-[#1B1B1F] text-[9.5px] tracking-[0.18em] font-bold text-[#999] hover:border-[#222] hover:text-[#BBB] transition-colors"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </Window>
                    </motion.div>
                  )}

                  {/* ─── CONTACT ─── */}
                  {activeView === "contact" && (
                    <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                      <Window title="ENCRYPTED_CHANNEL" subtitle="PGP • TLS 1.3" accent={CYBER_PINK}>
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-[22px]">
                          <motion.div variants={staggerItem} className="rounded-[10px] border border-[#1E1E22] bg-[#08080B] p-[14px] sm:p-[18px]">
                            <div className="flex items-center gap-[12px] mb-[15px]">
                              <motion.span
                                className="h-[9px] w-[9px] rounded-full bg-[#F472B6]"
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                style={{ boxShadow: "0 0 12px #F472B6" }}
                              />
                              <span className="text-[12px] tracking-[0.22em] text-[#F472B6] font-bold">
                                SECURE_HANDSHAKE • {SRGN_ALIAS}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-[11px]">
                              {[
                                { k: "MAIL", v: "owael2003@gmail.com", url: "mailto:owael2003@gmail.com", p: "PGP", c: DEDSEC_YELLOW },
                                { k: "GIT", v: "github.com/omarwael78", url: "https://github.com/omarwael78", p: "SSH", c: DEDSEC_CYAN },
                                { k: "LINKEDIN", v: "in/omarwaelkishk", url: "https://www.linkedin.com/in/omarwaelkishk/", p: "HTTPS", c: CYBER_PURPLE },
                                { k: "FACEBOOK", v: "facebook.com/omar.wael", url: "https://web.facebook.com/omar.wael.931356/", p: "HTTPS", c: CYBER_PINK },
                                { k: "PHONE", v: "+20 128 578 6006", url: "https://wa.me/201285786006", p: "ENC", c: DEDSEC_GREEN },
                              ].map((link) => (
                                <DigitalScan key={link.k} color={link.c}>
                                  <motion.a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 2 }}
                                    className="group flex items-center justify-between border border-[#1A1A1E] rounded-[9px] px-[10px] sm:px-[14px] h-[46px] hover:border-[#F472B6]/40 hover:bg-[#0D0D12] transition-all gap-2"
                                  >
                                    <div className="flex items-center gap-[10px]">
                                      <span className="text-[10px] tracking-[0.22em] text-[#666] font-bold">{link.k}</span>
                                      <span className="h-[12px] w-px bg-[#222]" />
                                    </div>
                                    <div className="flex items-center gap-[7px] sm:gap-[9px] max-w-[58%] sm:max-w-none overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                                      <span className="text-[12px] sm:text-[13px] text-[#E0E0E6] tracking-[0.008em] font-[500] group-hover:text-white transition-colors truncate">
                                        {link.v}
                                      </span>
                                      <span
                                        className="px-[6px] h-[19px] grid place-items-center rounded-[5px] border border-[#25252B] bg-[#0A0A0C] text-[9px] font-bold text-[#555] group-hover:border-[#F472B6]/60 group-hover:text-[#F472B6] transition-colors shrink-0"
                                      >
                                        {link.p}
                                      </span>
                                    </div>
                                  </motion.a>
                                </DigitalScan>
                              ))}
                            </div>
                          </motion.div>

                          <motion.div
                            variants={staggerItem}
                            className="flex items-start gap-[13px] p-[15px] rounded-[10px] border-l-[3px] border-[#C084FC]/70 bg-[#C084FC]/[0.03]"
                          >
                            <span className="text-[#C084FC] mt-[1px]">ℹ</span>
                            <div className="text-[12.5px] leading-[1.65] text-[#C7C7CF] tracking-[0.006em] font-[450]">
                              <span className="text-[#E0E0E6] font-[600]">Python backend projects only.</span> Please include:
                              API spec, data model, throughput requirements, and latency SLOs. For AI agents: evaluation criteria and safety constraints.
                            </div>
                          </motion.div>
                        </motion.div>
                      </Window>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ═══ FEATURED BUILDS ═══ */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-[26px] rounded-[13px] border border-[#C084FC]/20 bg-[#09090D]/80 backdrop-blur-[2px] p-[18px]"
                >
                  <div className="flex items-center gap-[10px] mb-[15px]">
                    <span className="text-[11px] tracking-[0.25em] text-[#777] font-bold">ACTIVE_PROJECTS</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#C084FC]/40 via-[#FDE047]/40 to-transparent" />
                    <span className="text-[10px] text-[#555] font-bold tracking-[0.22em]">v1.3</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-[13px]">
                    {[
                      {
                        name: "AGENT_ORCHESTRATOR",
                        stack: "PYTHON • FASTAPI • POSTGRES",
                        desc: "Backend for generative agents with tool registry, RAG, and evaluation loops.",
                        glow: DEDSEC_YELLOW,
                      },
                      {
                        name: "RAG_CORE_ENGINE",
                        stack: "DJANGO • PGVECTOR • DOCKER",
                        desc: "Production RAG system with hybrid search and recall tracking.",
                        glow: DEDSEC_CYAN,
                      },
                    ].map((proj) => (
                      <DigitalScan key={proj.name} color={proj.glow}>
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="group relative rounded-[10px] border border-[#18181C] bg-[#08080B] p-[15px] hover:border-[#C084FC]/40 transition-all overflow-hidden"
                        >
                          <div className="relative">
                            <div className="flex items-start justify-between mb-[8px]">
                              <h4 className="text-[13.5px] font-[680] tracking-[0.006em] text-[#EDEDF3]">{proj.name}</h4>
                              <motion.span
                                className="h-[7px] w-[7px] rounded-[2px]"
                                style={{ background: proj.glow, boxShadow: `0 0 10px ${proj.glow}` }}
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2.2, repeat: Infinity }}
                              />
                            </div>
                            <div className="text-[10px] tracking-[0.2em] text-[#666] font-bold mb-[9px]">{proj.stack}</div>
                            <div className="text-[12.5px] leading-[1.58] text-[#A8A8B3] font-[480] tracking-[0.002em]">{proj.desc}</div>
                          </div>
                        </motion.div>
                      </DigitalScan>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ═══ SIDEBAR ═══ */}
              <div className="space-y-[22px] lg:sticky lg:top-[92px]">
                {/* Primary stack */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  className="rounded-[13px] border border-[#FDE047]/22 bg-[#0A0A0D] p-[14px] sm:p-[18px] relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 rounded-[13px] pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg at 50% 50%, transparent, ${CYBER_PURPLE}44, ${DEDSEC_YELLOW}44, transparent 30%)`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-[1px] rounded-[12px] bg-[#0A0A0D]" />

                  <div className="relative">
                    <div className="flex items-center gap-[11px] mb-[14px]">
                      <div className="h-[9px] w-[9px] rounded-[1px] bg-[#FDE047] shadow-[0_0_12px_#FDE047] animate-pulse" />
                      <h3 className="text-[12px] tracking-[0.25em] text-[#FDE047] font-[750]">PRIMARY_STACK</h3>
                    </div>

                    <div className="space-y-[13px]">
                      {[
                        { l: "LANGUAGE", v: "Python 3.11+" },
                        { l: "FRAMEWORKS", v: "Django • FastAPI • Flask" },
                        { l: "DATABASES", v: "PostgreSQL • MySQL" },
                        { l: "RUNTIME", v: "Linux • Docker • Bash" },
                      ].map((item) => (
                        <div key={item.l} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-[4px]">
                          <span className="text-[10px] tracking-[0.22em] text-[#666] font-bold">{item.l}</span>
                          <span className="text-[12.5px] text-[#E0E0E6] font-[550] tracking-[0.004em] break-words">{item.v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-[16px] pt-[14px] border-t border-[#1A1A1E]">
                      <div className="text-[11px] leading-[1.6] text-[#BBB] font-[500] tracking-[0.004em]">
                        Building <span className="text-[#FDE047] font-[650]">backend-first</span> systems. Specialized in APIs,
                        data layers, and AI agent infrastructure.
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Gen AI */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  className="rounded-[13px] border border-[#C084FC]/22 bg-[#09090D] p-[14px] sm:p-[18px]"
                >
                  <div className="flex items-center gap-[11px] mb-[14px]">
                    <span
                      className="h-[9px] w-[9px] rounded-[1px] bg-[#C084FC] shadow-[0_0_11px_#C084FC] animate-pulse [animation-delay:300ms]"
                    />
                    <h3 className="text-[12px] tracking-[0.24em] text-[#C084FC] font-[750]">GEN_AI_AGENTS</h3>
                  </div>

                  <div className="space-y-[11px] text-[13px] leading-[1.64] text-[#C8C8D0] font-[480] tracking-[0.003em]">
                    <p>
                      <span className="text-[#E8E8EE] font-[620]">RAG Pipelines:</span> Chunking, hybrid search, pgvector indexing.
                    </p>
                    <p>
                      <span className="text-[#E8E8EE] font-[620]">Orchestration:</span> Tool calling, memory management, eval harnesses.
                    </p>
                    <p>
                      <span className="text-[#E8E8EE] font-[620]">Fine-tuning:</span> Dataset curation, LoRA, validation sets.
                    </p>
                  </div>
                </motion.div>

                {/* Keyboard hints */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46 }}
                  className="rounded-[11px] border border-[#16161A] bg-[#08080A] p-[12px] sm:p-[14px]"
                >
                  <div className="text-[10px] tracking-[0.24em] text-[#666] font-bold mb-[9px]">SHORTCUTS</div>
                  <div className="space-y-[7px] text-[11.5px]">
                    {[
                      { k: "Alt+1", v: "Identity" },
                      { k: "Alt+2", v: "Stack" },
                      { k: "Alt+3", v: "Timeline" },
                    ].map((s) => (
                      <div key={s.k} className="flex justify-between items-center">
                        <span className="text-[#AAA] font-[500]">{s.v}</span>
                        <span className="px-[7px] h-[22px] grid place-items-center rounded-[5px] border border-[#222] bg-[#0A0A0C] text-[10px] font-bold text-[#C084FC] tracking-[0.06em]">
                          {s.k}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="text-[10px] leading-[1.55] text-[#3A3A42] tracking-[0.12em] font-bold border-t border-[#141416] pt-[14px]">
                  SIGN: ED25519 • COMPILE: 2025-05-27 • {SRGN_ALIAS}
                </div>
              </div>
            </div>

            {/* ═══ FOOTER ═══ */}
            <footer className="mt-[40px] sm:mt-[62px] pt-[19px] border-t border-[#141416] flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 sm:gap-5 text-[10px] sm:text-[11px] tracking-[0.18em] font-bold">
              <div className="flex items-center gap-[8px] sm:gap-[16px] text-[#666] flex-wrap justify-center">
                <span>OMAR_WAEL</span>
                <span className="text-[#333]">•</span>
                <span className="text-[#C084FC]">{SRGN_ALIAS}</span>
                <span className="text-[#333] hidden sm:inline">•</span>
                <span className="text-[#FDE047] hidden sm:inline">PYTHON_BACKEND</span>
                <span className="text-[#333] hidden sm:inline">•</span>
                <span className="hidden sm:inline">GEN_AI</span>
              </div>
              <div className="flex items-center gap-[12px] sm:gap-[15px]">
                {["MANIFEST", "PGP_KEY", "SOURCE"].map((link, i) => (
                  <a
                    key={link}
                    href="#"
                    className="font-[650] tracking-[0.22em] transition-colors"
                    style={{
                      color: [DEDSEC_YELLOW, CYBER_PURPLE, DEDSEC_CYAN][i],
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Global styles */}
      <style>{`
        * { font-variant-ligatures: none; }
        ::selection { background: rgba(253,224,71,0.25); color: #FDE047; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #070709; }
        ::-webkit-scrollbar-thumb { background: #1A1A1E; border: 2px solid #070709; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: #2A2A30; }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2%, 1%); }
          50% { transform: translate(1%, -2%); }
          75% { transform: translate(-1%, -1%); }
        }
        @keyframes glitch {
          0% { clip-path: inset(0 0 0 0); transform: skew(0deg); }
          25% { clip-path: inset(20% 0 30% 0); transform: skew(0.3deg); }
          50% { clip-path: inset(50% 0 10% 0); transform: skew(-0.3deg); }
          75% { clip-path: inset(10% 0 60% 0); transform: skew(0.2deg); }
          100% { clip-path: inset(0 0 0 0); transform: skew(0deg); }
        }
        @media (max-width: 640px) {
          h1 { letter-spacing: -0.008em !important; }
        }
        @media (max-width: 480px) {
          .mobile-tight-tracking { letter-spacing: 0.08em !important; }
        }
        @media (pointer: coarse) {
          * { cursor: auto !important; }
        }
        @media (max-width: 480px) {
          .grid.lg\:grid-cols-\[1\.12fr_0\.88fr\] { gap: 18px !important; }
        }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// WINDOW COMPONENT — Cyberpunk structural frame
// ═══════════════════════════════════════════════════════════════
function Window({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle?: string;
  accent: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [2.5, -2.5]);
  const rotateY = useTransform(x, [-150, 150], [-2.5, 2.5]);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      className="relative rounded-[13px] border border-[#C084FC]/22 bg-[#0A0A0D] shadow-[inset_0_1px_0_rgba(192,132,252,0.04),0_28px_85px_-28px_rgba(192,132,252,0.18)] overflow-hidden"
      style={{ rotateX: springRotateX, rotateY: springRotateY, perspective: 1500, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between px-[12px] sm:px-[18px] h-[44px] border-b border-[#16161A] bg-[#08080B] gap-2">
        <div className="flex items-center gap-[9px] sm:gap-[13px] min-w-0">
          <div className="flex gap-[6px]">
            <span className="h-[8px] w-[8px] rounded-[1px]" style={{ background: accent, boxShadow: `0 0 9px ${accent}` }} />
            <span className="h-[8px] w-[8px] rounded-[1px] bg-[#C084FC]/70 shadow-[0_0_7px_#C084FC]" />
            <span className="h-[8px] w-[8px] rounded-[1px] bg-[#818CF8]/60 shadow-[0_0_7px_#818CF8]" />
          </div>
          <div className="flex items-baseline gap-[6px] sm:gap-[10px] min-w-0">
            <span className="text-[10px] sm:text-[12px] tracking-[0.14em] sm:tracking-[0.22em] font-[750] truncate" style={{ color: accent }}>
              {title}
            </span>
            {subtitle && (
              <>
                <span className="text-[#333]">•</span>
                <span className="hidden sm:inline text-[10px] tracking-[0.18em] text-[#C084FC] font-[600] truncate">{subtitle}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.22em] text-[#555] font-bold shrink-0">zsh</div>
      </div>

      <div className="px-[19px] sm:px-[23px] py-[22px]">{children}</div>

      {/* Corner marks — cyberpunk purple */}
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((pos) => (
        <div
          key={pos}
          className={`absolute w-[10px] h-[10px] border-[1.5px] opacity-[0.5] pointer-events-none ${
            pos === "top-left"
              ? "left-[11px] top-[11px] border-l border-t rounded-tl-[3px]"
              : pos === "top-right"
                ? "right-[11px] top-[11px] border-r border-t rounded-tr-[3px]"
                : pos === "bottom-left"
                  ? "left-[11px] bottom-[11px] border-l border-b rounded-bl-[3px]"
                  : "right-[11px] bottom-[11px] border-r border-b rounded-br-[3px]"
          }`}
          style={{ borderColor: CYBER_PURPLE }}
        />
      ))}

      {/* Accent top edge */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, ${CYBER_PURPLE}, transparent)`,
          opacity: 0.6,
        }}
      />
    </motion.div>
  );
}

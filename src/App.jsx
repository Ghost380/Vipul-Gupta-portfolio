import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Shield, Code, ExternalLink, Github, Linkedin, 
  Mail, Lock, Cpu, Activity, ChevronRight, Monitor, 
  Send, Loader2, Bug, AlertTriangle 
} from 'lucide-react';

/**
 * VIPUL GUPTA PORTFOLIO - PRODUCTION READY
 * Note: The application reads the API key from the VITE_GEMINI_API_KEY 
 * environment variable defined in your .env file.
 */
const callGemini = async (prompt, systemInstruction = "") => {
  let activeKey = "";
  
  try {
    // Vite-specific environment variable access
    if (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      activeKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    // Fallback if environment variables are inaccessible
  }

  if (!activeKey) return "Ghost: API Key not found. Please ensure VITE_GEMINI_API_KEY is set in your .env file.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const fetchWithRetry = async (retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
      throw err;
    }
  };

  try {
    const result = await fetchWithRetry();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to process request.";
  } catch (error) {
    return "Error: System connection failed. Verify your API key and network status.";
  }
};

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/20">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold text-xl">
        <Shield size={24} />
        <span>GHOST380_</span>
      </div>
      <div className="hidden md:flex gap-8 text-slate-400 font-mono text-sm">
        <a href="#about" className="hover:text-emerald-400 transition-colors">./about</a>
        <a href="#projects" className="hover:text-emerald-400 transition-colors">./projects</a>
        <a href="#security-tool" className="hover:text-emerald-400 transition-colors">./audit_tool</a>
        <a href="#contact" className="hover:text-emerald-400 transition-colors">./contact</a>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = "Building secure automated systems.";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
      <div className="inline-block px-3 py-1 mb-6 border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-mono rounded-full">
        STATUS: SYSTEM_ACTIVE [BCA CYBERSECURITY]
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-mono tracking-tight">
        Vipul <span className="text-emerald-400 underline decoration-emerald-500/50">Gupta</span>
      </h1>
      <p className="text-xl text-slate-400 font-mono h-8 mb-10">
        {text}<span className="animate-pulse">_</span>
      </p>
      <div className="flex gap-4">
        <a href="#projects" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono transition-all flex items-center gap-2">
          View Projects <ChevronRight size={18} />
        </a>
        <a href="https://github.com/Ghost380" target="_blank" className="px-8 py-3 border border-slate-700 hover:border-emerald-500 text-slate-300 rounded font-mono transition-all flex items-center gap-2">
          <Github size={18} /> GitHub
        </a>
      </div>
    </section>
  );
};

const TerminalAssistant = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { role: 'system', content: 'Ghost-AI Terminal initialized. Ask me about Vipul\'s skills, CEH certification, or his Price Tracker project.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const systemPrompt = `You are Vipul Gupta's AI Agent. 
    Bio: Vipul is a BCA Cybersecurity student at Jain University (2023-2026). 
    Expertise: Python Automation, Ethical Hacking (CEH), Secure Web Scraping.
    Featured Project: AI Price Tracker Bot (Python, Playwright, Discord, SQLite).
    Tone: Professional, high-tech, slightly witty (hacker aesthetic). Keep it short.`;

    const aiResponse = await callGemini(userMsg, systemPrompt);
    setHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 mb-20">
      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-xs font-mono text-slate-400">bash — assistant@ghost-v3.0</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-500/50 animate-pulse">✨ AI_ACTIVE</span>
        </div>
        <div className="p-6 font-mono text-sm h-64 overflow-y-auto space-y-4" ref={scrollRef}>
          {history.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'text-blue-400' : msg.role === 'system' ? 'text-emerald-500 opacity-70' : 'text-slate-300'}>
              {msg.role === 'user' && <span className="text-emerald-400 mr-2">➜</span>}
              {msg.role === 'assistant' && <span className="text-blue-500 mr-2">Ghost:</span>}
              {msg.content}
            </div>
          ))}
          {isTyping && <div className="text-slate-500 italic animate-pulse">Ghost is querying database...</div>}
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-4">
          <span className="text-emerald-400 font-mono">➜</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask ghost-ai something..."
            className="flex-grow bg-transparent border-none outline-none text-white font-mono placeholder:text-slate-700"
          />
          <button type="submit" disabled={isTyping}>
            <Send size={18} className={isTyping ? "text-slate-700" : "text-emerald-500 hover:text-emerald-400"} />
          </button>
        </form>
      </div>
    </div>
  );
};

const SecurityAuditTool = () => {
  const [code, setCode] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const performAudit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setAuditResult(null);

    const systemPrompt = `You are an AI Security Auditor. Analyze code for vulnerabilities (OWASP Top 10, SQLi, XSS, etc.).
    Response Format:
    1. ⚠️ Risk Level (Low/Medium/High/Critical)
    2. 🔍 Found Vulnerabilities
    3. 🛠️ Mitigation Steps
    If code is clean, explain why it follows best practices.`;

    const result = await callGemini(`Audit this code snippet for security risks:\n\n${code}`, systemPrompt);
    setAuditResult(result);
    setLoading(false);
  };

  return (
    <section id="security-tool" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="bg-slate-900/40 border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
              <Lock className="text-emerald-400" /> ✨ SecureCode Auditor
            </h2>
            <p className="text-slate-400 text-sm font-mono mt-2">Test my expertise: Paste code for an automated security analysis.</p>
          </div>
          <button 
            onClick={performAudit}
            disabled={loading || !code}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded font-mono transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Bug size={18} />}
            Audit Code
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste code snippet here (e.g. Python, SQL, JS)..."
            className="w-full h-80 bg-slate-950 border border-slate-800 p-4 rounded-xl text-emerald-100 font-mono text-sm focus:border-emerald-500 outline-none"
          />
          <div className="h-80 bg-slate-950/50 border border-slate-800 p-6 rounded-xl overflow-y-auto">
            {!auditResult && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 font-mono text-sm italic text-center">
                <Activity size={32} className="mb-2 opacity-20" />
                Analyzer idle. Input code stream to begin scan.
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-emerald-500/50 font-mono text-sm">
                <Loader2 className="animate-spin mb-4" size={32} />
                Scanning for threats...
              </div>
            )}
            {auditResult && (
              <div className="font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/20 pb-2">
                  <Shield size={16} /> REPORT_GENERATED
                </div>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {auditResult}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ title, desc, tags, github }) => (
  <div className="group bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/50 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
        <Code size={24} />
      </div>
      <a href={github} target="_blank" className="text-slate-500 hover:text-emerald-400 transition-colors">
        <Github size={20} />
      </a>
    </div>
    <h3 className="text-xl font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const App = () => (
  <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 relative">
    {/* Visual Grid Background */}
    <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    
    <Navbar />
    <main className="relative">
      <Hero />
      <TerminalAssistant />
      
      <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-10 font-mono flex items-center gap-4">
          <span className="text-emerald-400">01.</span> Projects
          <div className="h-px bg-slate-800 flex-grow" />
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard 
            title="AI Price Tracker" 
            desc="Python/Playwright bot that tracks dynamic prices, bypasses anti-scraping, and alerts via Discord." 
            tags={["Python", "Automation", "SQLite"]} 
            github="https://github.com/Ghost380/price-tracker-bot"
          />
          <ProjectCard 
            title="Ghost AI Portfolio" 
            desc="This site! Integrated with Gemini AI for real-time security auditing and interactive persona responses." 
            tags={["React", "Gemini AI", "Tailwind"]} 
            github="https://github.com/Ghost380"
          />
          <ProjectCard 
            title="Secure Login Vault" 
            desc="A proof-of-concept authentication system implementing salts, hashing, and protection against common OWASP attacks." 
            tags={["Cybersecurity", "Auth", "Node.js"]} 
            github="https://github.com/Ghost380"
          />
        </div>
      </section>

      <SecurityAuditTool />

      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-6 font-mono">system.contact()</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="mailto:vipulgupta9009@gmail.com" className="px-8 py-4 bg-emerald-600/10 border border-emerald-600/50 text-emerald-400 rounded font-mono hover:bg-emerald-600/20 transition-all flex items-center justify-center gap-2">
            <Mail size={18} /> Email Me
          </a>
          <a href="https://www.linkedin.com/in/vipulgupta9009/" target="_blank" className="px-8 py-4 bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
            <Linkedin size={18} /> LinkedIn
          </a>
        </div>
      </section>
    </main>

    <footer className="py-10 border-t border-slate-900 text-center text-slate-500 font-mono text-xs">
      <p>© 2026 Designed & Built by Vipul Gupta (Ghost380)</p>
    </footer>
  </div>
);

export default App;
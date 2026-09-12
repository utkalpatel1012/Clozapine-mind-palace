import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  BrainCircuit,
  Search,
  Volume2,
  VolumeX,
  X,
  Bot,
  User,
  ExternalLink,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { ChatMessage } from "../types";

interface CuratorChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  "Explain why clozapine causes nocturnal sialorrhea despite being anticholinergic.",
  "A patient on 400mg clozapine abruptly stopped taking it 72 hours ago. Walk me through the re-titration protocol.",
  "Explain the Feb 2025 FDA decision regarding the Clozapine REMS program.",
  "How does cigarette smoking vs vaping impact clozapine serum concentrations via CYP1A2?",
];

export const CuratorChat: React.FC<CuratorChatProps> = ({ isOpen, onClose, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Greetings, Scholar. I am the Curator of the Clozapine Mind Palace. As a Master Neuropsychopharmacologist, I stand ready to assist you in walking through any wing, dissecting receptor affinities, calculating ANC thresholds, or analyzing recent 2024–2026 clinical trials. How may I guide your inquiry?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [useHighThinking, setUseHighThinking] = useState(true);
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      // Strip markdown asterisks and hash marks for natural speech
      const cleanText = text.replace(/[*#_`]/g, "").slice(0, 1000);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const query = promptOverride || input;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (useSearchGrounding) {
        // Call search grounding endpoint
        const res = await fetch("/api/gemini/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const assistantMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.text || "No response received from search engine.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          groundingSources: data.groundingSources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Multi-turn chat endpoint with optional high thinking
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

        const res = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversationHistory,
            message: query,
            useHighThinking,
          }),
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const assistantMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.text || "No response received.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Error connecting to the Palace Curator: ${err.message || "Failed to fetch response."} Please ensure your connection is active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-950 border border-amber-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950/70 text-amber-300 rounded-lg border border-amber-700/50">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-slate-100 text-base font-['Cinzel']">
                  Curator AI • Master Neuropsychopharmacologist
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Grounded in clozapine literature, receptor dynamics, and modern 2025 REMS updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Switches Bar (High Thinking & Search Grounding) */}
        <div className="px-5 py-2.5 bg-slate-900/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* High Thinking Toggle */}
            <button
              type="button"
              onClick={() => {
                setUseHighThinking(!useHighThinking);
                if (!useHighThinking) setUseSearchGrounding(false);
              }}
              className={`px-3 py-1.5 rounded-md border flex items-center gap-1.5 transition-all ${
                useHighThinking
                  ? "bg-purple-950/70 border-purple-500 text-purple-200 ring-1 ring-purple-500/50"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              <span>Deep Thinking (gemini-3.1-pro)</span>
            </button>

            {/* Google Search Grounding Toggle */}
            <button
              type="button"
              onClick={() => {
                setUseSearchGrounding(!useSearchGrounding);
                if (!useSearchGrounding) setUseHighThinking(false);
              }}
              className={`px-3 py-1.5 rounded-md border flex items-center gap-1.5 transition-all ${
                useSearchGrounding
                  ? "bg-cyan-950/70 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Search Grounding</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {useSearchGrounding ? "Live Web Medical Grounding Active" : useHighThinking ? "Clinical Reasoning Mode" : "Standard Speed Mode"}
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? "bg-amber-600 text-slate-950"
                      : "bg-slate-800 text-amber-300 border border-slate-700"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? "bg-amber-600 text-slate-950 font-medium"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Grounding web sources if any */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold block uppercase">
                        Grounded Web Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.groundingSources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            <span>{src.title || "Web Citation"}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-between text-[10px] pt-1 opacity-70 ${
                      isUser ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(m.content)}
                        className="hover:text-amber-300 flex items-center gap-1 ml-3"
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{isSpeaking ? "Stop" : "Listen"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-2xl mr-auto">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-300 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>
                  {useHighThinking
                    ? "Formulating deep neuropsychopharmacological reasoning..."
                    : useSearchGrounding
                    ? "Grounding query in latest biomedical search indices..."
                    : "The Curator is drafting response..."}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0">Explore:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSubmit(undefined, prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 whitespace-nowrap transition-colors"
            >
              {prompt.slice(0, 45)}...
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask the Curator about any clozapine mechanism, trial, warning, or protocol..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

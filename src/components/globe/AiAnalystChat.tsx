import { useState, useRef, useEffect, useCallback } from "react";
import { Brain, Send, User, Bot, Trash2, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface AiAnalystChatProps {
  onSendMessage?: (text: string) => void;
  className?: string;
}

const SUGGESTIONS = [
  "¿Qué está pasando cerca de mi ubicación?",
  "Resume la actividad de las últimas 2h",
  "¿Hay correlación entre eventos actuales?",
];

export function AiAnalystChat({ onSendMessage, className }: AiAnalystChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: `msg-${msgIdRef.current++}`,
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      onSendMessage?.(trimmed);
    },
    [isTyping, onSendMessage]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full",
          "backdrop-blur-2xl border transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          isOpen
            ? "bg-slate-800/80 border-slate-600/50 text-slate-300"
            : "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 shadow-[0_0_24px_rgba(34,211,238,0.3)]"
        )}
        aria-label={isOpen ? "Close AI analyst" : "Open AI analyst"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Brain className="w-5 h-5" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-20 right-6 z-50 w-[340px] h-[460px] max-h-[calc(100vh-7rem)]",
            "flex flex-col rounded-2xl backdrop-blur-2xl border border-slate-700/40",
            "bg-slate-900/85 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
            "animate-in fade-in slide-in-from-bottom-4 duration-300",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/30 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyan-500/15 border border-cyan-400/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white/90">
                  AI Analyst
                </div>
                <div className="text-[8px] text-slate-500 uppercase tracking-wider">
                  Intelligence Assistant
                </div>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg hover:bg-slate-700/40 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-3"
          >
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center gap-4 pt-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-400/20">
                  <Brain className="w-6 h-6 text-cyan-400/70" />
                </div>
                <p className="text-[10px] text-slate-500 text-center px-4">
                  Ask me about events, markets, or threats on the globe.
                </p>
                <div className="flex flex-col gap-1.5 w-full px-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-left px-3 py-2 rounded-xl text-[10px] text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60 hover:text-slate-300 hover:border-slate-600/40 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === "user"
                      ? "bg-slate-700/40"
                      : "bg-cyan-500/15 border border-cyan-400/20"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="w-3 h-3 text-slate-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-cyan-300" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] px-3 py-2 rounded-xl text-[10px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-slate-700/40 text-slate-200 rounded-tr-sm"
                      : "bg-slate-800/50 text-slate-300 rounded-tl-sm border border-slate-700/20"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-cyan-500/15 border border-cyan-400/20">
                  <Bot className="w-3 h-3 text-cyan-300" />
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/20 rounded-tl-sm">
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                    <span className="text-[9px] text-slate-500">thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-700/30 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Ask about events, threats, markets..."
                className="flex-1 h-9 px-3 text-[10px] bg-slate-800/50 border border-slate-700/30 text-slate-200 placeholder:text-slate-600 rounded-xl focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-xl transition-all shrink-0",
                  input.trim() && !isTyping
                    ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30"
                    : "bg-slate-800/30 border border-slate-700/20 text-slate-600"
                )}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Helper for parent components to push assistant responses into the chat. */
export function useAiAnalystResponse() {
  // Placeholder hook — parent can wire this to push messages externally.
  // The actual AI call happens in the parent component, not here.
  return {
    respond: (_text: string) => {
      // Parent connects this to the real backend.
    },
  };
}

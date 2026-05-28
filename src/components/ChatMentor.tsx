import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Orbit, Landmark, Compass, Award } from "lucide-react";
import { Message } from "../types";

export default function ChatMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello Vera! 🚀 I'm Ranger Stella, your virtual NASA Space Mentor! I'm orbiting high above Earth right now, and I'm so excited to talk with you. I hear you dream of going to space and working at NASA — that is a stellar goal! You can ask me absolutely anything about planets, rockets, how astronauts train, or search for secret water on Mars. What space adventure is on your mind today? 🪐✨",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    { label: "How can I work at NASA?", icon: Landmark, text: "How can I work at NASA when I grow up? What can I study?" },
    { label: "What is Mars like?", icon: Compass, text: "What is Mars like? Why is NASA exploring it so much?" },
    { label: "Tell me about Artemis!", icon: Orbit, text: "What is the Artemis mission and when are we going back to the Moon?" },
    { label: "Webb Telescope findings", icon: Sparkles, text: "What cool things has the James Webb Space Telescope shown us?" }
  ];

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat message error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oh no, Vera! 🛰️ My radio frequency got a bit of space-dust static! Let's try sending that transmission again in a few seconds. Remember, a true astronaut never gives up! 🚀💖",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="chat-mentor-panel" className="flex flex-col h-full bg-slate-900/80 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Mentor Header styled from Vibrant Palette */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-xl border-2 border-white/20">
              <span className="font-bold text-2xl select-none">👩‍🚀</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-blue-600 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide text-white uppercase font-sans">COMMANDER STELLA</h2>
            <p className="text-[10px] text-white/80 uppercase tracking-widest font-mono">NASA Orbiting Knowledge Base Hub</p>
          </div>
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">HOUSTON LINKED</span>
        </div>
      </div>

      {/* Suggestion Prompts rendered as gorgeous capsules from Vibrant Palette */}
      <div className="p-4 bg-black/20 border-b border-slate-800/80 flex flex-wrap gap-2 justify-center">
        {suggestionPrompts.map((s, idx) => {
          const IconComponent = s.icon;
          return (
            <button
              id={`chat-sugg-${idx}`}
              key={idx}
              onClick={() => handleSendMessage(s.text)}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800/60 hover:bg-slate-800 disabled:opacity-50 text-xs text-slate-300 hover:text-white rounded-full border border-slate-700/60 hover:border-slate-505 transition-all cursor-pointer shadow-md transform hover:scale-103 active:scale-95"
            >
              <IconComponent className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="font-medium">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area with custom Vibrant Palette bubbles */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[460px]">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              id={`msg-${m.id}`}
              key={m.id}
              className={`flex items-start ${isUser ? "justify-end" : "justify-start"} gap-3 max-w-full`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-full bg-slate-850 flex items-center justify-center border-2 border-slate-800 text-lg shrink-0 select-none shadow">
                  🛰️
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 leading-relaxed text-xs sm:text-sm shadow-xl transition-all ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-none border border-blue-500/20 shadow-blue-600/10"
                    : "bg-slate-800/90 border-2 border-slate-800/60 text-slate-100 rounded-tl-none font-sans font-normal"
                }`}
              >
                <div className="whitespace-pre-line select-text">
                  {m.content}
                </div>
                <div className="mt-2 text-[9px] text-slate-500 font-mono text-right opacity-80 uppercase tracking-widest leading-none">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {isUser && (
                <div className="w-9 h-9 rounded-full bg-blue-900/40 flex items-center justify-center border-2 border-blue-700 text-lg shrink-0 select-none shadow">
                  👧
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div id="chat-loading-indicator" className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-850 flex items-center justify-center border-2 border-slate-800 text-lg shrink-0 animate-spin">
              💫
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-800/60 rounded-2xl rounded-tl-none p-4 text-xs sm:text-sm text-blue-300 flex items-center gap-3 shadow-xl">
              <span className="flex space-x-1">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400">Telemetry Linked...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form with full-round look from Vibrant Palette */}
      <form
        id="chat-send-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-4 border-t border-slate-800 bg-[#030712]/50 flex gap-3 items-center"
      >
        <input
          id="chat-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Commander Stella anything..."
          disabled={isLoading}
          className="flex-1 bg-black/40 border-2 border-slate-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 font-sans transition-all"
        />
        <button
          id="chat-submit-btn"
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all cursor-pointer border border-white/10 shrink-0"
        >
          <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}

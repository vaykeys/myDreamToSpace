import React, { useState, useEffect } from "react";
import { User, Orbit, Compass, Trophy, Bot, Sparkles, Star, Award, LogOut } from "lucide-react";
import Dashboard from "./components/Dashboard";
import ChatMentor from "./components/ChatMentor";
import ArtemisLab from "./components/ArtemisLab";
import MarsRover from "./components/MarsRover";
import FlightAcademy from "./components/FlightAcademy";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    rocketsLaunched: 0,
    mineralsFound: 0,
    badgesEarned: 0,
    highestAccuracy: 0
  });

  // Load stats from localStorage for graceful persistence
  useEffect(() => {
    const saved = localStorage.getItem("vera_space_quest_stats");
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved stats:", err);
      }
    }
  }, []);

  const saveStats = (newStats: typeof stats) => {
    setStats(newStats);
    localStorage.setItem("vera_space_quest_stats", JSON.stringify(newStats));
  };

  // Callback triggers from interactive simulations
  const handleLaunchSuccess = () => {
    const updated = { ...stats, rocketsLaunched: stats.rocketsLaunched + 1 };
    saveStats(updated);
  };

  const handleMineralDiscovered = () => {
    const updated = { ...stats, mineralsFound: stats.mineralsFound + 1 };
    saveStats(updated);
  };

  const handleAddBadge = () => {
    const updated = { ...stats, badgesEarned: Math.min(3, stats.badgesEarned + 1) };
    saveStats(updated);
  };

  const handleAccuracyReport = (score: number) => {
    if (score > stats.highestAccuracy) {
      const updated = { ...stats, highestAccuracy: score };
      saveStats(updated);
    }
  };

  const [currentTime, setCurrentTime] = useState("");
  const [showLogToast, setShowLogToast] = useState(false);

  // Dynamic Ticking clock for live Houston Time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="vera-applet-root" className="bg-[#030712] text-white min-h-screen flex flex-col justify-between font-sans selection:bg-purple-650 selection:text-white pb-6 relative overflow-x-hidden">
      {/* Background Decoration (Stars) from Vibrant Palette */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-20 left-40 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-60 left-10 w-2.5 h-2.5 bg-blue-400 rounded-full blur-[1px]"></div>
        <div className="absolute bottom-20 right-80 w-1.5 h-1.5 bg-yellow-200 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/4 right-10 w-1.5 h-1.5 bg-purple-400 rounded-full blur-[0.5px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-amber-200 rounded-full animate-pulse"></div>
      </div>

      {/* Primary Header from Vibrant Palette */}
      <header className="relative z-10 p-6 border-b border-slate-800/80 backdrop-blur-md bg-[#030712]/75 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.35)] select-none shrink-0 transform hover:scale-105 transition-all">
              NASA
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                VERA'S SPACE ACADEMY
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
                Future Astronaut Training Program • ID: #2026-ARTEMIS
              </p>
            </div>
          </div>

          {/* Connection telemetry and Interactive Action Button from Vibrant Palette */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700 flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold font-mono text-slate-200 tracking-wider">HOUSTON CONNECTED</span>
            </div>

            <button 
              id="mission-log-btn"
              onClick={() => setShowLogToast(!showLogToast)}
              className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-black px-6 py-2 rounded-full transform transition shadow-lg shadow-yellow-400/25 text-xs tracking-wider uppercase"
            >
              MISSION LOG
            </button>
          </div>
        </div>

        {/* Dynamic Mission Log Overlap popup when active */}
        {showLogToast && (
          <div id="mission-log-toast" className="max-w-7xl mx-auto mt-4 p-4 bg-slate-900/90 border-2 border-slate-700 rounded-2xl animate-fadeIn relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold tracking-wider text-amber-300 uppercase font-mono">🚀 Active Cadet Logs • {new Date().toLocaleDateString()}</h4>
              <p className="text-xs text-slate-300 font-sans mt-0.5">Vera's current mission parameters match expectations. All telemetry linkages are operational.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-indigo-300 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Rockets: {stats.rocketsLaunched}</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-indigo-300 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-orange-400" />
                <span>Rover Spec: {stats.mineralsFound}</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-indigo-300 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Badges: {stats.badgesEarned}/3</span>
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main tab switching hub dashboard */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 items-stretch">
        
        {/* Navigation Selector Tabs bar */}
        <div id="navigation-tabs" className="flex flex-wrap gap-2 border-b border-slate-800/60 pb-4 shrink-0 justify-center sm:justify-start">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`py-2.5 px-6 rounded-full text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center gap-2 transform active:scale-95 ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 font-bold text-white shadow-xl shadow-indigo-600/35 border border-white/10"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <span>🌎</span>
            <span>Dashboard</span>
          </button>
          
          <button
            id="tab-chat"
            onClick={() => setActiveTab("chat")}
            className={`py-2.5 px-6 rounded-full text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center gap-2 transform active:scale-95 ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 font-bold text-white shadow-xl shadow-indigo-600/35 border border-white/10"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <span>👩‍🚀</span>
            <span>Stella Mentor AI</span>
          </button>

          <button
            id="tab-rockets"
            onClick={() => setActiveTab("rockets")}
            className={`py-2.5 px-6 rounded-full text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center gap-2 transform active:scale-95 ${
              activeTab === "rockets"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 font-bold text-white shadow-xl shadow-indigo-600/35 border border-white/10"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <span>🚀</span>
            <span>Artemis Rocket Lab</span>
          </button>

          <button
            id="tab-rover"
            onClick={() => setActiveTab("rover")}
            className={`py-2.5 px-6 rounded-full text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center gap-2 transform active:scale-95 ${
              activeTab === "rover"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 font-bold text-white shadow-xl shadow-indigo-600/35 border border-white/10"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <span>🤖</span>
            <span>Opportunity Mars Rover</span>
          </button>

          <button
            id="tab-academy"
            onClick={() => setActiveTab("academy")}
            className={`py-2.5 px-6 rounded-full text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center gap-2 transform active:scale-95 ${
              activeTab === "academy"
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 font-bold text-white shadow-xl shadow-indigo-600/35 border border-white/10"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <span>🎓</span>
            <span>Cadet Flight Academy</span>
          </button>
        </div>

        {/* Selected Area Interactive panels */}
        <div id="main-content-window" className="flex-1 mt-2">
          {activeTab === "dashboard" && (
            <Dashboard onSwitchTab={setActiveTab} stats={stats} />
          )}
          {activeTab === "chat" && (
            <ChatMentor />
          )}
          {activeTab === "rockets" && (
            <ArtemisLab onLaunchSuccess={handleLaunchSuccess} />
          )}
          {activeTab === "rover" && (
            <MarsRover onMineralDiscovered={handleMineralDiscovered} />
          )}
          {activeTab === "academy" && (
            <FlightAcademy onAddBadge={handleAddBadge} onAccuracyReport={handleAccuracyReport} />
          )}
        </div>
      </main>

      {/* Footer Ticker from Vibrant Palette */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-6 mt-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 py-3 px-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-red-500 px-2.5 py-1 rounded text-[10px] font-black text-white select-none">LIVE DATA</span>
            <div className="overflow-hidden whitespace-nowrap text-xs font-medium text-slate-400">
              <span className="mx-4 italic">• International Space Station Position: 45.4°N, 10.3°E</span>
              <span className="mx-4 italic text-orange-400">• Current Temperature on Mars: -81°F</span>
              <span className="mx-4 italic text-blue-400">• Artemis I Mission: Successful Splashdown</span>
              <span className="mx-4 italic text-purple-400">• Next Class: Intro to Orbital Mechanics at 2:00 PM</span>
            </div>
          </div>
          <div className="text-xs font-bold flex items-center gap-2 font-mono select-none">
            <span className="text-slate-500">HOUSTON TIME</span>
            <span className="text-white tracking-widest">{currentTime || "14:24:08"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

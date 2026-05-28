import React, { useState } from "react";
import { Sparkles, Trophy, BookOpen, User, Eye, Map, Star, Compass } from "lucide-react";

interface FactCardProps {
  title: string;
  desc: string;
  funFact: string;
  emoji: string;
}

export default function Dashboard({
  onSwitchTab,
  stats
}: {
  onSwitchTab: (tabName: string) => void;
  stats: {
    rocketsLaunched: number;
    mineralsFound: number;
    badgesEarned: number;
    highestAccuracy: number;
  };
}) {
  const [selectedDeskItem, setSelectedDeskItem] = useState<FactCardProps | null>(null);

  const deskItems = [
    {
      id: "helmet",
      emoji: "👩‍🚀",
      name: "Gold Astronaut Helmet",
      title: "Astronaut Visor Shield",
      desc: "An extravehicular activity (EVA) helmet used by astronauts during space walks.",
      funFact: "Did you know, Vera? The visor is coated in a micro-layer of REAL 24-karat gold! It acts like super-powered sunglasses, shielding the astronaut's eyes from intense, unfiltered solar light and dangerous radiation in open space!"
    },
    {
      id: "telescope",
      emoji: "🔭",
      name: "Miniature Space Telescope",
      title: "James Webb Discovery Glass",
      desc: "Our high-tech window to the absolute beginning of time.",
      funFact: "Webb works by collecting infrared light, which lets it peek through thick blankets of space dust to watch brand new baby stars being born! Webb is so sensitive, it could detect the heat of a single bumblebee on the Moon!"
    },
    {
      id: "plant",
      emoji: "🌱",
      name: "Space Veggie Plant Block",
      title: "Veggie-05 Orbital Greenhouse",
      desc: "Crops grown at zero-gravity inside the International Space Station.",
      funFact: "Astronauts grow delicious red romaine lettuce and pak choi on the ISS using special clay pillows! Learning to grow food in space is critical so that when you go to Mars, Vera, you can cultivate your own fresh space salads!"
    },
    {
      id: "map",
      emoji: "🗺️",
      name: "Mars Map Blueprint",
      title: "Jezero Crater Grid Map",
      desc: "Cartography mapping for our search of ancient microbial traces.",
      funFact: "Jezero Crater was once filled with a ancient liquid lake, roughly 3.7 billion years ago! NASA sent the Perseverance rover there because the dried river delta holds muddy clay minerals that can preserve fossil biosignatures of tiny ancient Mars life!"
    }
  ];

  return (
    <div id="vera-dashboard-panel" className="space-y-6">
      {/* Hero Welcome Unit - Premium cosmic header layout */}
      <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-[#030712] border-2 border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-mono font-black bg-purple-600/15 text-purple-300 border border-purple-500/30">
              <Star className="w-4 h-4 mr-1.5 text-yellow-400 animate-spin" style={{ animationDuration: "10s" }} />
              MISSION PROFILE: VERA
            </span>
            <h1 className="font-sans font-black text-2xl md:text-3.5xl text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              WELCOME TO MISSION CONTROL, VERA! 🛰️
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-sans max-w-xl font-light leading-relaxed">
              This is your NASA dashboard portal. Here, you can train to become an astronaut, design and launch giant Artemis rockets, drive automated rovers across Mars, and chat with your AI space companion!
            </p>
          </div>
          
          {/* Action Trigger keys with rounded-full design */}
          <div className="flex gap-3 shrink-0">
            <button
              id="dash-quick-chat"
              onClick={() => onSwitchTab("chat")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-650 text-white font-sans text-xs font-black rounded-full transition-all shadow-xl shadow-indigo-600/25 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              Ask Stella Facts
            </button>
            <button
              id="dash-quick-launch"
              onClick={() => onSwitchTab("rockets")}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-705 border-2 border-slate-700 text-slate-300 font-sans text-xs font-black rounded-full transition-all shadow-md transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              Build a Rocket
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Achievements Stats & interactive items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Column with Vibrant Palette rounded edge card */}
        <div className="md:col-span-1 p-6 rounded-[2.5rem] bg-slate-900/80 border-2 border-slate-800 backdrop-blur-md flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-purple-400 font-black tracking-widest flex items-center gap-2 uppercase">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Your Achievements
            </h3>
            
            <div className="space-y-3">
              <div id="stat-rockets" className="flex items-center justify-between p-3.5 bg-black/40 rounded-2xl border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl filter drop-shadow">🚀</span>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-slate-200">Rockets Launched</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Artemis Core Labs</p>
                  </div>
                </div>
                <span className="text-xl font-black text-blue-400 font-mono">{stats.rocketsLaunched}</span>
              </div>

              <div id="stat-minerals" className="flex items-center justify-between p-3.5 bg-black/40 rounded-2xl border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5 font-sans">
                  <span className="text-2xl filter drop-shadow">💎</span>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-slate-200">Mars Minerals Found</h4>
                    <p className="text-[10px] text-slate-400 font-mono font-mono">Opportunity map</p>
                  </div>
                </div>
                <span className="text-xl font-black text-rose-400 font-mono">{stats.mineralsFound}</span>
              </div>

              <div id="stat-badges" className="flex items-center justify-between p-3.5 bg-black/40 rounded-2xl border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl filter drop-shadow">🌟</span>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-slate-200">Badges Earned</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Astronaut flight rating</p>
                  </div>
                </div>
                <span className="text-xl font-black text-yellow-400 font-mono">{stats.badgesEarned}/3</span>
              </div>

              <div id="stat-accuracy" className="flex items-center justify-between p-3.5 bg-black/40 rounded-2xl border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl filter drop-shadow">🛸</span>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-slate-200">Flight Accuracy</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Docking alignment ratio</p>
                  </div>
                </div>
                <span className="text-xl font-black text-purple-400 font-mono">
                  {stats.highestAccuracy > 0 ? `${stats.highestAccuracy}%` : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">NASA JUNIOR CADET LEVEL</span>
            <div className="w-full bg-slate-800 h-3.5 mt-2 rounded-full overflow-hidden border border-slate-700/60 flex items-center p-[2px]">
              <div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(12, Math.min(100, (stats.rocketsLaunched * 20 + stats.mineralsFound * 15 + stats.badgesEarned * 25)))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* NASA Interactive Desk Blocks with matching custom style */}
        <div className="md:col-span-2 p-6 rounded-[2.5rem] bg-slate-900/80 border-2 border-slate-800 backdrop-blur-md space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-mono text-purple-400 font-black tracking-widest flex items-center gap-2 uppercase">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              INTERACTIVE SPACE LOCKER
            </h3>
            <p className="text-xs text-slate-400 font-sans font-light">
              Take a look inside your cadet space locker! Click on NASA items to examine them and uncover fascinating astronomical secrets!
            </p>
          </div>

          {/* Desk Grid Items */}
          <div className="grid grid-cols-2 gap-4 my-4">
            {deskItems.map((item) => {
              const selected = selectedDeskItem?.title === item.title;
              return (
                <button
                  id={`desk-item-${item.id}`}
                  key={item.id}
                  onClick={() => setSelectedDeskItem(item)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.03] text-center ${
                    selected 
                      ? "border-purple-500 bg-purple-600/10 shadow-lg shadow-purple-500/10 text-white" 
                      : "border-slate-800/60 bg-black/40 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-4xl mb-2.5 filter drop-shadow select-none">{item.emoji}</span>
                  <span className="text-xs font-sans font-bold">{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">SCAN DETAILS</span>
                </button>
              );
            })}
          </div>

          {/* Fact Display Board with modern space terminal look */}
          <div className="min-h-[110px] p-5 rounded-2xl bg-[#030712] border-2 border-slate-850 flex items-start gap-3 shadow-inner">
            {selectedDeskItem ? (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-3xl select-none filter drop-shadow">{selectedDeskItem.emoji}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
                      {selectedDeskItem.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedDeskItem.desc}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-light select-text">
                  {selectedDeskItem.funFact}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full py-4 text-center">
                <p className="text-xs text-slate-500 italic">
                  Select any item above to scan for scientific mission telemetry...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inspirational Bottom Banner with President JFK speech quote */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-r from-[#030712] to-slate-900/40 border-2 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl text-center md:text-left">
        <div className="flex gap-4 items-center flex-col md:flex-row">
          <span className="text-4xl select-none animate-bounce" style={{ animationDuration: "5s" }}>🪐</span>
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest leading-normal">
              NASA INSPIRATIONAL DECREE
            </h4>
            <p className="text-xs text-slate-300 font-sans italic font-light select-text leading-relaxed">
              "We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard; because that challenge is one that we are willing to accept..."
            </p>
            <span className="block text-[10px] text-purple-400 font-mono uppercase tracking-widest mt-1">— President John F. Kennedy, September 1962</span>
          </div>
        </div>
      </div>
    </div>
  );
}

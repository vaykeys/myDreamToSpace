import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Shield, ShieldAlert, Cpu, Sparkles, AlertCircle, ArrowUp } from "lucide-react";
import { RocketConfig, LaunchStatus } from "../types";

export default function ArtemisLab({
  onLaunchSuccess
}: {
  onLaunchSuccess: () => void;
}) {
  const [config, setConfig] = useState<RocketConfig>({
    booster: "liquid",
    payload: "orion",
    sensors: ["camera"],
    fuelRatio: 55
  });

  const [launchStatus, setLaunchStatus] = useState<LaunchStatus>("idle");
  const [countdown, setCountdown] = useState<number>(5);
  const [flightData, setFlightData] = useState({
    altitude: 0,
    velocity: 0,
    fuel: 100,
    stage: ""
  });
  const [launchLog, setLaunchLog] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const addLog = (msg: string) => {
    setLaunchLog(prev => [msg, ...prev]);
  };

  // Booster definitions
  const boosters = {
    srb: { name: "Solid Fuel Stage (SRB)", thrust: "Super High", control: "Low Steering", desc: "Provides ultimate brute force but cannot be shut down once ignited! High launch power." },
    liquid: { name: "Cryogenic Liquid Core (LOX/LH2)", thrust: "High & Steady", control: "Precise Gimbal", desc: "The gold-standard for deep space rockets. Uses super-cooled liquid oxygen and hydrogen for maximum efficiency." },
    hybrid: { name: "Eco Hybrid Core (N2O/HTPB)", thrust: "Medium Power", control: "Infinite Throttle", desc: "A modern safe combination. High control, extremely reliable, slightly lower peak thrust ratios." }
  };

  // Payload definitions
  const payloads = {
    orion: { name: "Orion Crew Module", weight: "Heavy Weight", target: "Moon South Pole Orbit", desc: "Vera and her brave robotic dog Sparky are on board! Embarking on deep space colonization." },
    webb: { name: "Next-Gen Deep Infrared Telescope", weight: "Medium Weight", target: "Sun-Earth Lagrange L2 Point", desc: "Stunning gold honeycomb mirror to peek back 13.5 billion years into star formations." },
    rover: { name: "Vanguard Mars Science Rover", weight: "Heavy Weight", target: "Jezero Mars Basin Landing", desc: "Six-wheeled autonomous rover with high drill torque and solar panel sails." }
  };

  // Available sensors
  const availableSensors = [
    { id: "camera", name: "Ultra-HD Panoramic Space Cam", desc: "Shoots glorious starry photos with millions of pixels" },
    { id: "mag", name: "Helium Vector Magnetometer", desc: "Scans for solar winds and planetary magnetic shields" },
    { id: "spect", name: "Deep Infrared Ice Spectrometer", desc: "Peeks through soil to discover hidden ice-water crystal layers" }
  ];

  // Config triggers
  const toggleSensor = (sensorId: string) => {
    if (config.sensors.includes(sensorId)) {
      setConfig(prev => ({ ...prev, sensors: prev.sensors.filter(s => s !== sensorId) }));
    } else {
      setConfig(prev => ({ ...prev, sensors: [...prev.sensors, sensorId] }));
    }
  };

  // Countdown timer trigger
  useEffect(() => {
    let timer: any;
    if (launchStatus === "countdown") {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
          if (countdown === 5) addLog("T-4: Cryogenic pre-cooling lines activated...");
          if (countdown === 4) addLog("T-3: Ground telemetry transferred to booster guidance computer...");
          if (countdown === 3) addLog("T-2: Dynamic water deluge spray starting (Suppressing acoustic waves)...");
          if (countdown === 2) addLog("T-1: Solid core igniters armed... Standby for ignition!");
        }, 1000);
      } else {
        triggerAscent();
      }
    }
    return () => clearTimeout(timer);
  }, [launchStatus, countdown]);

  // Ascent process sequence loop
  useEffect(() => {
    let interval: any;
    if (launchStatus === "ascending") {
      interval = setInterval(() => {
        setFlightData(prev => {
          const nextFuel = Math.max(0, prev.fuel - 4);
          const nextAlt = prev.altitude + Math.floor(prev.velocity / 3600 * 5);
          const nextVel = prev.velocity + (config.booster === "srb" ? 650 : config.booster === "liquid" ? 480 : 385);

          if (nextAlt < 15000) {
            return { altitude: nextAlt, velocity: nextVel, fuel: nextFuel, stage: "Atmosphere Escape" };
          } else if (nextAlt >= 15000 && nextAlt < 65000) {
            return { altitude: nextAlt, velocity: nextVel, fuel: nextFuel, stage: "Inertial Flight Stage" };
          } else if (nextAlt >= 65000 && nextAlt < 100000) {
            return { altitude: nextAlt, velocity: nextVel, fuel: nextFuel, stage: "Booster Separation Window" };
          } else {
            // Altitude reaches 100,000m (Space threshold)
            clearInterval(interval);
            triggerSeparation();
            return { altitude: 100000, velocity: 28000, fuel: nextFuel, stage: "Orbit Transition" };
          }
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [launchStatus]);

  const initiateLaunch = () => {
    setCountdown(5);
    setFlightData({ altitude: 0, velocity: 0, fuel: 100, stage: "Pad Telemetry" });
    setLaunchLog(["T-5: Pre-Flight checklist validated. Systems green.", "SYSTEM ENGAGEMENT INITIATED!"]);
    setErrorMessage("");
    setLaunchStatus("countdown");
  };

  const triggerAscent = () => {
    addLog("T-0: IGNITION! Solid core fire spreading! We have LIFTOFF! 🚀");
    setLaunchStatus("ascending");
  };

  const triggerSeparation = () => {
    setLaunchStatus("separation");
    addLog("Altitude: 100 kms reached. Outer atmosphere cleared.");
    addLog("Separating spend booster core shell. Success. 💥");
    setTimeout(() => {
      triggerEvaluation();
    }, 2000);
  };

  const triggerEvaluation = () => {
    const minFuel = 45;
    const maxFuel = 70;
    
    // Evaluation checking
    if (config.fuelRatio < minFuel) {
      setErrorMessage("LAUNCH FAILURE: Insufficient fuel pressure! The booster core did not sustain enough combusting energy to reach orbital velocity. Your module returned back down to safety on backup descent paraglides.");
      addLog("Orbit check: STALL REACHED. Gravitational capture failed. 🛑");
      setLaunchStatus("failed");
    } else if (config.fuelRatio > maxFuel) {
      setErrorMessage("LAUNCH FAILURE: Excessive fuel-enrichment mixture ratio! Extreme high thermodynamic core thermal heat triggered automatic rocket booster pressure vent override safety engine shutdown to prevent a massive pad explosion.");
      addLog("Orbit check: THERMAL ENGINE ESCAPE TRIP SIGNIFIED. Safety release triggered. 🛑");
      setLaunchStatus("failed");
    } else {
      addLog(`Orbit check: STABLE GRAVITATIONAL INSERTION. Success! ${payloads[config.payload].name} is now orbiting! 🎇`);
      setLaunchStatus("success");
      onLaunchSuccess();
    }
  };

  const resetSimulator = () => {
    setLaunchStatus("idle");
    setFlightData({ altitude: 0, velocity: 0, fuel: 100, stage: "" });
    setLaunchLog([]);
    setErrorMessage("");
  };

  return (
    <div id="artemis-lab-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Sidebar (Left) with Vibrant Palette premium cards */}
      <div className="lg:col-span-4 p-6 rounded-[2.5rem] bg-slate-900/80 border-2 border-slate-800 backdrop-blur-md flex flex-col justify-between shadow-2xl space-y-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
            <h3 className="text-xs font-mono text-purple-400 font-black tracking-widest uppercase">
              ARTEMIS DESIGN CONSOLE
            </h3>
          </div>

          {/* Core Booster selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5 uppercase tracking-wide">
              <span>🚀</span> Core Booster Engine System
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {Object.entries(boosters).map(([key, item]) => {
                const selected = config.booster === key;
                return (
                  <button
                    id={`select-booster-${key}`}
                    key={key}
                    disabled={launchStatus !== "idle"}
                    onClick={() => setConfig(prev => ({ ...prev, booster: key as any }))}
                    className={`px-4 py-3 text-left rounded-2xl border-2 text-xs cursor-pointer transition-all ${
                      selected 
                        ? "border-purple-500 bg-purple-600/15 text-white shadow-lg font-black" 
                        : "border-slate-850 bg-black/45 hover:bg-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <p className="font-bold font-sans">{item.name}</p>
                    <div className="flex gap-2 text-[10px] font-mono mt-1 text-slate-400">
                      <span>Thrust: {item.thrust}</span>
                      <span>•</span>
                      <span>Control: {item.control}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payload selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5 uppercase tracking-wide">
              <span>🛰️</span> Space Payload Objective
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {Object.entries(payloads).map(([key, item]) => {
                const selected = config.payload === key;
                return (
                  <button
                    id={`select-payload-${key}`}
                    key={key}
                    disabled={launchStatus !== "idle"}
                    onClick={() => setConfig(prev => ({ ...prev, payload: key as any }))}
                    className={`px-4 py-3 text-left rounded-2xl border-2 text-xs cursor-pointer transition-all ${
                      selected 
                        ? "border-purple-500 bg-purple-600/15 text-white shadow-lg font-black" 
                        : "border-slate-850 bg-black/45 hover:bg-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <p className="font-bold font-sans">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans font-light">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scientific Sensors */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5 uppercase tracking-wide">
              <span>🛠️</span> Mission Sensors Payload Max
            </label>
            <div className="space-y-1.5">
              {availableSensors.map((sensor) => {
                const checked = config.sensors.includes(sensor.id);
                return (
                  <button
                    id={`toggle-sensor-${sensor.id}`}
                    key={sensor.id}
                    disabled={launchStatus !== "idle"}
                    onClick={() => toggleSensor(sensor.id)}
                    className={`w-full px-4 py-2 text-left rounded-xl border-2 text-[11px] cursor-pointer transition-all flex items-center justify-between ${
                      checked 
                        ? "border-purple-500 bg-purple-600/10 text-white font-bold" 
                        : "border-slate-850 bg-black/40 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span>{sensor.name}</span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded ${checked ? "bg-purple-650/40 text-purple-300 font-black" : "bg-slate-900 text-slate-550"}`}>
                      {checked ? "LOADED" : "OFFREEL"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOX/Hydrogen Fuel adjustment dial */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5 uppercase tracking-wide">
                <span>🔥</span> LOX/LH2 Mixture Ratio
              </label>
              <span className="font-mono text-xs font-black text-amber-300">{config.fuelRatio}%</span>
            </div>
            <input
              id="mixture-slider"
              type="range"
              min="10"
              max="90"
              value={config.fuelRatio}
              disabled={launchStatus !== "idle"}
              onChange={(e) => setConfig(prev => ({ ...prev, fuelRatio: parseInt(e.target.value) }))}
              className="w-full accent-blue-500 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span className="text-teal-400">Too Lean (Low alt)</span>
              <span className="text-amber-400">Perfect (45%-70%)</span>
              <span className="text-rose-400">Too Rich (Overload)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Launch Controls */}
        <div className="pt-4 border-t border-slate-800">
          {launchStatus === "idle" ? (
            <button
              id="initiate-launch-btn"
              onClick={initiateLaunch}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-650 text-white font-black rounded-full transition-all shadow-xl shadow-indigo-600/25 transform hover:scale-[1.03] active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
            >
              <Play className="w-4 h-4 text-white fill-white shrink-0 animate-ping" />
              <span>LAUNCH VEHICLE</span>
            </button>
          ) : (
            <button
              id="reset-lab-btn"
              disabled={launchStatus === "countdown" || launchStatus === "ascending"}
              onClick={resetSimulator}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 disabled:opacity-40 hover:bg-slate-705 text-slate-300 border-2 border-slate-705 font-black rounded-full transition-all shadow-md cursor-pointer text-xs uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>RESET LAUNCHPAD</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Canvas Launch Flight (Right Center) */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
        {/* Animated Sky Visualization Canvas with premium dark elements */}
        <div className="md:col-span-8 p-6 rounded-[2.5rem] bg-gradient-to-b from-[#030712] to-slate-950 border-2 border-slate-800 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          {/* Star particles absolute bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950/80 to-slate-950 pointer-events-none"></div>

          {/* Phase Overlay banner */}
          <div className="relative z-10 flex justify-between items-center p-3 bg-black/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <span className="text-[10px] font-mono font-black text-slate-400 tracking-wider">STAGE COMMAND:</span>
            <span className={`text-[10px] font-mono uppercase px-3 py-1 rounded-full font-black ${launchStatus === "success" ? "bg-emerald-500/10 text-emerald-400" : launchStatus === "failed" ? "bg-red-500/10 text-red-400 animate-pulse" : "bg-blue-500/10 text-amber-300"}`}>
              {launchStatus === "idle" ? "READY ON PAD" : launchStatus === "countdown" ? `COUNTDOWN T-${countdown}` : flightData.stage}
            </span>
          </div>

          {/* Rocket Ascent Animation Stage */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-6 h-64 border-y border-slate-800 bg-black/10 rounded-2xl">
            {launchStatus === "idle" && (
              <div id="status-pad-graphics" className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">Space Launch Complex 39B</span>
                {/* SVG Artemis launch tower & Rocket layout */}
                <div className="w-24 h-48 flex items-end justify-center relative select-none">
                  {/* Rocket body */}
                  <span className="text-6.5xl mb-4 relative z-10 animate-pulse">🚀</span>
                  {/* Pad Support tower */}
                  <div className="absolute left-6 bottom-0 w-3 h-40 bg-slate-800/80 border border-slate-750 rounded-sm"></div>
                  <div className="absolute left-9 bottom-16 w-6 h-0.5 bg-slate-700"></div>
                  <div className="absolute left-9 bottom-28 w-6 h-0.5 bg-slate-700"></div>
                  {/* Ground grass line */}
                  <div className="absolute bottom-0 w-32 h-1 bg-emerald-500/40 rounded-full"></div>
                </div>
              </div>
            )}

            {launchStatus === "countdown" && (
              <div id="status-countdown-graphics" className="flex flex-col items-center select-none">
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-amber-400/60 flex items-center justify-center animate-spin"></div>
                <div className="absolute text-5xl font-black font-mono text-white tracking-tighter leading-none">{countdown}</div>
                <span className="text-xs text-slate-350 mt-4 uppercase tracking-widest font-mono font-bold animate-bounce">IGNITOR POWERED</span>
              </div>
            )}

            {launchStatus === "ascending" && (
              <div id="status-ascending-graphics" className="flex flex-col items-center relative h-full w-full justify-center overflow-hidden animate-shake">
                <div className="absolute inset-x-0 bottom-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-amber-500/10 to-transparent h-24 blur-md"></div>
                {/* Simulated clouds scrolling */}
                <div className="absolute w-20 h-8 bg-white/5 rounded-full blur-sm top-10 left-10 animate-pulse" style={{ animationDuration: "6s" }}></div>
                <div className="absolute w-24 h-10 bg-white/5 rounded-full blur-sm bottom-20 right-10 animate-pulse" style={{ animationDuration: "8s" }}></div>

                {/* Shaking Rocket Container */}
                <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: "0.2s" }}>
                  <span className="text-6.5xl relative select-none" style={{ transform: "rotate(-45deg)" }}>🚀</span>
                  <div className="flex flex-col items-center mt-2.5">
                    {/* Fire exhaust animation */}
                    <div className="w-1.5 h-10 bg-gradient-to-t from-red-650 via-amber-500 to-amber-200 rounded-full animate-pulse"></div>
                    <div className="w-3.5 h-6 bg-gradient-to-t from-red-500 to-yellow-300 rounded-full blur-xs"></div>
                  </div>
                </div>
              </div>
            )}

            {launchStatus === "separation" && (
              <div id="status-separation-graphics" className="flex flex-col items-center relative justify-center select-none animate-fadeIn">
                <div className="absolute text-[8px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 top-0 uppercase tracking-widest rounded-full">Orbit insert checklist</div>
                <div className="text-5.5xl my-2 flex gap-4 rotate-[45deg] animate-pulse">
                  <span>🚀</span>
                  <span className="text-xs absolute -mt-4 ml-6 animate-ping">💥</span>
                </div>
                <span className="text-xs text-sky-400 font-mono tracking-wider animate-bounce uppercase font-bold">Jettisoning First Stage boosters</span>
              </div>
            )}

            {launchStatus === "success" && (
              <div id="status-success-graphics" className="flex flex-col items-center text-center select-none px-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-3xl mb-4 border border-emerald-500/30 animate-bounce">
                  🏆
                </div>
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1.5">GRAVITY CONQUERED!</h4>
                <p className="text-slate-300 font-sans text-xs leading-relaxed max-w-sm font-light mt-1 select-text">
                  Vera, your launch parameters were flawless! The space mission capsule {payloads[config.payload].name} entered coordinate L2 correctly. Ground radar reports telemetry is locked!
                </p>
                
                {/* Payload visual popped */}
                <span className="text-5xl mt-5 select-none animate-bounce">
                  {config.payload === "orion" ? "👩‍🚀" : config.payload === "webb" ? "🔭" : "🛰️"}
                </span>
                <span className="text-[9px] text-indigo-300 font-mono mt-2 uppercase font-bold">{payloads[config.payload].name} ONLINE</span>
              </div>
            )}

            {launchStatus === "failed" && (
              <div id="status-failed-graphics" className="p-4 flex flex-col items-center text-center select-none animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-3xl mb-4 border border-rose-500/30">
                  ⚠️
                </div>
                <h4 className="text-xs font-mono font-bold text-rose-450 uppercase tracking-wider mb-2">Pad Warning Triggered</h4>
                <p className="text-rose-200/95 font-sans text-xs max-w-sm italic font-light select-text leading-relaxed">
                  {errorMessage}
                </p>
                <span className="text-[9px] px-3 py-1 mt-4 rounded-full bg-rose-950/40 select-none border border-rose-500/30 font-mono text-rose-300 uppercase tracking-widest font-bold">
                  SYSTEM STATUS: RESET TO PAD READY
                </span>
              </div>
            )}
          </div>

          {/* Core HUD gauges (Bottom) */}
          <div className="relative z-10 grid grid-cols-3 gap-2 p-4 bg-[#030712] border-2 border-slate-850 rounded-2xl text-center shadow-inner">
            <div>
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">Altitude</span>
              <span className="text-xs font-mono font-black text-slate-200">
                {flightData.altitude.toLocaleString()} m
              </span>
            </div>
            <div>
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">Velocity</span>
              <span className="text-xs font-mono font-black text-slate-200">
                {flightData.velocity.toLocaleString()} km/h
              </span>
            </div>
            <div>
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">Fuel Level</span>
              <span className="text-xs font-mono font-black text-amber-300">
                {flightData.fuel}%
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Launch logs (Right Sidebar) */}
        <div className="md:col-span-4 p-5 rounded-[2.5rem] bg-slate-900/80 border-2 border-slate-800 backdrop-blur-md flex flex-col shadow-2xl min-h-[460px]">
          <h4 className="text-xs font-mono font-bold text-purple-400 mb-3.5 uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" /> SYSTEM LOGS
          </h4>
          <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 p-4 bg-black/40 border border-slate-800 rounded-2xl max-h-[400px]">
            {launchLog.length > 0 ? (
              launchLog.map((log, idx) => (
                <div id={`log-item-${idx}`} key={idx} className="border-l-2 border-purple-500/40 pl-2 text-slate-300 py-0.5 break-words select-text">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic flex items-center justify-center h-full text-center leading-normal">
                Launch controllers idle. Set parameters on left and launch booster.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

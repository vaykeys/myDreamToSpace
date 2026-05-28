import React, { useState, useEffect } from "react";
import { Compass, Play, RotateCcw, AlertTriangle, Cpu, Terminal, Sparkles, BookOpen } from "lucide-react";
import { POI, RoverCommand } from "../types";

export default function MarsRover({
  onMineralDiscovered
}: {
  onMineralDiscovered: () => void;
}) {
  const [roverPos, setRoverPos] = useState<[number, number]>([2, 2]); // X, Y starting coordinates (0-7 grid)
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandQueue, setCommandQueue] = useState<RoverCommand[]>([]);
  const [activeCommandIdx, setActiveCommandIdx] = useState<number>(-1);
  const [gridPOIs, setGridPOIs] = useState<POI[]>([
    {
      id: "dunes",
      name: "Ironstone Red Dunes",
      x: 1,
      y: 1,
      discovered: false,
      description: "Fine, magnetized rust dust dunes blown by thin Martian winds.",
      fact: "Mars' beautiful red rust color comes from iron oxide dust particles coating its surface! Mars has a very light carbon dioxide atmosphere, with only about 1% of Earth's atmospheric pressure! Taking a panorama photo here reveals gorgeous pink-orange alien sunsets.",
      item: "Chemical Rust Spectrum",
    },
    {
      id: "delta",
      name: "Jezero Dried River Delta",
      x: 4,
      y: 2,
      discovered: false,
      description: "Layered clay silt sheets deposited by water streams billions of years ago.",
      fact: "About 3.7 billion years ago, a massive lake filled this basin, carrying and sorting muddy sediments. Learning to drill & scoop core samples here is vital because clay minerals work like clay cocoons, preserving the microscopic remains or footprints of ancient alien microbes!",
      item: "Mudstone Clay Core Shell",
    },
    {
      id: "meteorite",
      name: "Sienna Nickel Meteorite",
      x: 6,
      y: 5,
      discovered: false,
      description: "A charred, dense metallic asteroid stone that crashed on Mars ages ago.",
      fact: "Meteorites hit Mars frequently because its light atmosphere cannot burn them up! This meteorite contains heavy crystalline alloys of nickel and iron. Scanning it with active laser reveals molecular patterns showing it originated from a shattered core of an ancient proto-planet!",
      item: "Iron-Nickel Heavy Chrystal",
    },
    {
      id: "crater",
      name: "Olympus Polar Dust Crater",
      x: 2,
      y: 6,
      discovered: false,
      description: "A shaded wall crater housing cold carbon-dioxide & water-ice sheets.",
      fact: "NASA satellites have proven Mars has huge reservoirs of frozen water-ice underground! Future human base-crews like Vera will melt this underlying ice to create refreshing drinking water and extract hydrogen-oxygen propellant molecules to fuel rockets returning back to Earth!",
      item: "High-Pure H2O Water Crystal",
    }
  ]);

  const [discoveryLog, setDiscoveryLog] = useState<string[]>(["Opportunity Rover initialized on Mars. Battery state: 100%"]);
  const [laserPulse, setLaserPulse] = useState(false);
  const [scoopPulse, setScoopPulse] = useState(false);
  const [cameraFlash, setCameraFlash] = useState(false);

  const addLog = (msg: string) => {
    setDiscoveryLog(prev => [msg, ...prev]);
  };

  const queueCommand = (type: "move" | "laser" | "scoop" | "camera" | "drill", param?: string) => {
    if (isExecuting) return;
    setCommandQueue(prev => [...prev, { type, param, status: "pending" }]);
  };

  const clearQueue = () => {
    setCommandQueue([]);
    setActiveCommandIdx(-1);
    setIsExecuting(false);
  };

  const selectPOI = (poi: POI) => {
    if (isExecuting) return;
    // Calculate simple delta jumps to POI coordinate as commands
    const newCommands: RoverCommand[] = [];
    let currentX = roverPos[0];
    let currentY = roverPos[1];

    // Build X path commands
    while (currentX !== poi.x) {
      if (currentX < poi.x) {
        newCommands.push({ type: "move", param: "right", status: "pending" });
        currentX++;
      } else {
        newCommands.push({ type: "move", param: "left", status: "pending" });
        currentX--;
      }
    }

    // Build Y path commands
    while (currentY !== poi.y) {
      if (currentY < poi.y) {
        newCommands.push({ type: "move", param: "down", status: "pending" });
        currentY++;
      } else {
        newCommands.push({ type: "move", param: "up", status: "pending" });
        currentY--;
      }
    }

    // Intelligent auto action selection based on POI nature
    if (poi.id === "dunes") {
      newCommands.push({ type: "camera", status: "pending" });
    } else if (poi.id === "delta" || poi.id === "crater") {
      newCommands.push({ type: "drill", status: "pending" });
    } else if (poi.id === "meteorite") {
      newCommands.push({ type: "laser", status: "pending text" as any });
    }

    setCommandQueue(prev => [...prev, ...newCommands]);
    addLog(`Auto-calculated path navigation command chain to ${poi.name}`);
  };

  const runSequence = async () => {
    if (commandQueue.length === 0 || isExecuting) return;
    setIsExecuting(true);
    addLog("Rover navigation engines engaged. Executing sequence stack...");

    let currentX = roverPos[0];
    let currentY = roverPos[1];

    for (let i = 0; i < commandQueue.length; i++) {
      setActiveCommandIdx(i);
      const cmd = commandQueue[i];
      cmd.status = "running";

      // Re-trigger states
      setCommandQueue([...commandQueue]);

      // Delay between actions
      await new Promise(resolve => setTimeout(resolve, 800));

      switch (cmd.type) {
        case "move":
          if (cmd.param === "up" && currentY > 0) currentY--;
          if (cmd.param === "down" && currentY < 7) currentY++;
          if (cmd.param === "left" && currentX > 0) currentX--;
          if (cmd.param === "right" && currentX < 7) currentX++;
          setRoverPos([currentX, currentY]);
          addLog(`Sequence index ${i + 1}: Rover moved ${cmd.param} to (${currentX}, ${currentY})`);
          break;

        case "laser":
          setLaserPulse(true);
          await new Promise(resolve => setTimeout(resolve, 600));
          setLaserPulse(false);
          addLog(`Sequence index ${i + 1}: Fired ChemCam science spectroscopic laser at current soil.`);
          evaluateAction("laser", currentX, currentY);
          break;

        case "scoop":
        case "drill":
          setScoopPulse(true);
          await new Promise(resolve => setTimeout(resolve, 600));
          setScoopPulse(false);
          addLog(`Sequence index ${i + 1}: Extended drill core actuator on the rock layer.`);
          evaluateAction("drill", currentX, currentY);
          break;

        case "camera":
          setCameraFlash(true);
          await new Promise(resolve => setTimeout(resolve, 400));
          setCameraFlash(false);
          addLog(`Sequence index ${i + 1}: Captured high-resolution orbital panoramic photography.`);
          evaluateAction("camera", currentX, currentY);
          break;
      }

      cmd.status = "done";
      setCommandQueue([...commandQueue]);
    }

    setIsExecuting(false);
    setActiveCommandIdx(-1);
    addLog("Command sequence complete! Power status: 92%. Resting solar batteries.");
  };

  const evaluateAction = (actType: string, rx: number, ry: number) => {
    gridPOIs.forEach((poi, index) => {
      if (poi.x === rx && poi.y === ry && !poi.discovered) {
        // Match specific action triggers for points of interest
        let triggerSuccess = false;
        if (poi.id === "dunes" && actType === "camera") triggerSuccess = true;
        if ((poi.id === "delta" || poi.id === "crater") && actType === "drill") triggerSuccess = true;
        if (poi.id === "meteorite" && actType === "laser") triggerSuccess = true;

        if (triggerSuccess) {
          const updated = [...gridPOIs];
          updated[index].discovered = true;
          setGridPOIs(updated);
          addLog(`🎉 REWARD UNLOCKED: Analyzed ${poi.name}! Recovered ${poi.item}!`);
          onMineralDiscovered();
        } else {
          addLog(`Instrument warning: Used ${actType} on ${poi.name}. No scientific reading captured. Use alternative instruments (e.g. Try camera on dunes, drill on Clay delta/crater, laser on Meteorite!)`);
        }
      }
    });
  };

  return (
    <div id="mars-rover-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 8x8 Grid Map (Left side) */}
      <div className="lg:col-span-6 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/25 border border-orange-500/25 shadow-xl relative flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-orange-500/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-orange-400 shrink-0" />
            <h3 className="text-sm font-mono text-orange-350 font-bold tracking-wider uppercase">
              Opportunity Rover Map
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-orange-500/10 border border-orange-400/20 px-2 py-0.5 rounded text-orange-300">
            Grid scale: 10m x 10m
          </span>
        </div>

        {/* The 8x8 Grid Board layout */}
        <div className="relative z-10 mx-auto grid grid-cols-8 grid-rows-8 gap-1.5 w-full aspect-square bg-slate-950/80 p-3 rounded-xl border border-orange-500/10 shadow-inner">
          {Array.from({ length: 8 }).map((_, rIdx) =>
            Array.from({ length: 8 }).map((_, cIdx) => {
              const hasRover = roverPos[0] === cIdx && roverPos[1] === rIdx;
              const matchingPOI = gridPOIs.find(p => p.x === cIdx && p.y === rIdx);
              
              return (
                <div
                  id={`cell-${cIdx}-${rIdx}`}
                  key={`${cIdx}-${rIdx}`}
                  onClick={() => matchingPOI && selectPOI(matchingPOI)}
                  className={`relative rounded flex items-center justify-center transition-all ${
                    hasRover 
                      ? "bg-orange-500/20 shadow-lg scale-95 border-2 border-orange-400 animate-pulse cursor-default" 
                      : matchingPOI 
                        ? matchingPOI.discovered 
                          ? "bg-teal-500/15 border border-teal-400/30 font-bold cursor-pointer" 
                          : "bg-amber-400/10 border border-dashed border-amber-300/30 font-bold cursor-pointer hover:bg-amber-400/20 hover:scale-102"
                        : "bg-slate-900/30 border border-slate-950 hover:bg-slate-900/60 transition-all duration-300"
                  }`}
                >
                  {/* Coordinates indicator (Top Left absolute) */}
                  <span className="absolute top-[2px] left-[2px] text-[6px] text-slate-500 font-mono scale-[0.8] tracking-tighter">
                    {cIdx},{rIdx}
                  </span>

                  {/* Rover representation inside box */}
                  {hasRover && (
                    <div className="relative flex flex-col items-center">
                      <span className="text-xl md:text-2xl select-none z-15">🤖</span>
                      {laserPulse && <div className="absolute w-20 h-20 border border-red-500 rounded-full animate-ping z-10 pointer-events-none"></div>}
                      {scoopPulse && <div className="absolute w-12 h-12 border border-sky-400 rounded-full animate-ping z-10 pointer-events-none"></div>}
                      {cameraFlash && <div className="absolute w-full h-full bg-white rounded animate-fadeOut pointer-events-none z-20"></div>}
                    </div>
                  )}

                  {/* Point of Interest visuals inside box (Not overlapping rover) */}
                  {!hasRover && matchingPOI && (
                    <div className="flex flex-col items-center select-none">
                      <span className="text-xl relative filter drop-shadow">
                        {matchingPOI.id === "dunes" ? "🏜️" : matchingPOI.id === "delta" ? "🪨" : matchingPOI.id === "meteorite" ? "💫" : "❄️"}
                      </span>
                      {matchingPOI.discovered ? (
                        <span className="absolute bottom-0 text-[6px] font-mono text-teal-400 uppercase tracking-widest font-black">DISCOVERED</span>
                      ) : (
                        <span className="absolute bottom-0 text-[6px] font-mono text-amber-300 uppercase tracking-widest animate-pulse">FACT INSID</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Legend block indicators (Bottom) */}
        <div className="relative z-10 grid grid-cols-4 gap-2 mt-4 text-[9px] font-mono text-indigo-200/50 bg-slate-950/50 border border-orange-500/10 p-2.5 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1.5"><span className="text-xs">🏜️</span> Dunes (Camera API)</div>
          <div className="flex items-center justify-center gap-1.5"><span className="text-xs">🪨</span> Delta (Drill API)</div>
          <div className="flex items-center justify-center gap-1.5"><span className="text-xs">💫</span> Stone (Laser API)</div>
          <div className="flex items-center justify-center gap-1.5"><span className="text-xs">❄️</span> Crater (Drill API)</div>
        </div>
      </div>

      {/* Program Sequencer Console Workspace & Discovery Logbook (Right side) */}
      <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sequence Compiler Block */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-indigo-500/10 backdrop-blur-md flex flex-col justify-between shadow-xl min-h-[460px]">
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-indigo-350 uppercase tracking-wide flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Command Sequencer
            </h4>
            <p className="text-[10px] text-slate-400 leading-tight font-sans">
              Program the Mars Rover! Double click on POIs inside the map left to automatically write navigation commands, or click manual steps below to load actions into the run queue:
            </p>

            {/* Manual command stacking buttons */}
            <div className="grid grid-cols-5 gap-1.5 my-2">
              <button
                id="cmd-manual-move-up"
                disabled={isExecuting}
                onClick={() => queueCommand("move", "up")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center"
              >
                ▲ UP
              </button>
              <button
                id="cmd-manual-move-down"
                disabled={isExecuting}
                onClick={() => queueCommand("move", "down")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center"
              >
                ▼ DOWN
              </button>
              <button
                id="cmd-manual-move-left"
                disabled={isExecuting}
                onClick={() => queueCommand("move", "left")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center"
              >
                ◀ LEFT
              </button>
              <button
                id="cmd-manual-move-right"
                disabled={isExecuting}
                onClick={() => queueCommand("move", "right")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center"
              >
                ▶ RIGHT
              </button>
              <button
                id="cmd-manual-cam"
                disabled={isExecuting}
                onClick={() => queueCommand("camera")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center"
              >
                📸 CAM
              </button>
              <button
                id="cmd-manual-laser"
                disabled={isExecuting}
                onClick={() => queueCommand("laser")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center col-span-2"
              >
                💥 LASER
              </button>
              <button
                id="cmd-manual-drill"
                disabled={isExecuting}
                onClick={() => queueCommand("drill")}
                className="py-1 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-indigo-200 cursor-pointer text-center col-span-3"
              >
                🛠️ DRILL & SCOOP
              </button>
            </div>

            {/* Queued list stack visually */}
            <div className="space-y-1.5 my-2">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Program Stack ({commandQueue.length} instructions)</span>
              <div className="h-44 bg-slate-950/80 border border-indigo-500/10 rounded-xl p-2.5 overflow-y-auto space-y-1 flex flex-col">
                {commandQueue.length > 0 ? (
                  commandQueue.map((cmd, idx) => (
                    <div
                      id={`queue-item-${idx}`}
                      key={idx}
                      className={`flex items-center justify-between text-[10px] font-mono rounded-lg px-2.5 py-1 ${
                        activeCommandIdx === idx 
                          ? "bg-amber-400/10 text-amber-300 border border-amber-400/20" 
                          : cmd.status === "done" 
                            ? "bg-teal-500/5 text-teal-400/60 line-through border border-teal-500/5"
                            : "bg-slate-900/40 text-slate-300 border border-slate-800"
                      }`}
                    >
                      <div className="flex gap-1.5">
                        <span className="text-slate-500">#{idx + 1}</span>
                        <span className="uppercase font-semibold">
                          {cmd.type} {cmd.param ? `(${cmd.param})` : ""}
                        </span>
                      </div>
                      <span className="text-[8px] font-sans px-1 bg-slate-950 rounded uppercase font-bold">
                        {cmd.status === "pending" ? "READY" : cmd.status === "running" ? "ACTIVE" : "DONE"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600 font-mono text-[10px] italic m-auto text-center">
                    Queue is empty. Select POIs on grid map to compile autopilot sequences.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-indigo-500/10">
            <button
              id="rover-run-btn"
              disabled={commandQueue.length === 0 || isExecuting}
              onClick={runSequence}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-600 disabled:opacity-40 hover:bg-orange-500 text-white font-semibold font-sans text-xs rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white shrink-0" /> Launch Code
            </button>
            <button
              id="rover-clear-btn"
              disabled={isExecuting}
              onClick={clearQueue}
              className="px-3 bg-slate-800 disabled:opacity-45 hover:bg-slate-700 hover:border-indigo-500 border border-slate-700 text-indigo-300 text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Rover Command Logs & Discovery Cards */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-indigo-500/10 backdrop-blur-md flex flex-col justify-between shadow-xl min-h-[460px]">
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <h4 className="text-xs font-mono font-bold text-indigo-350 uppercase tracking-wide flex items-center gap-1 border-b border-indigo-500/10 pb-2 shrink-0">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Active Mission Telemetry
            </h4>

            {/* Active Logs lists */}
            <div className="flex-1 bg-slate-950/80 border border-indigo-550/15 p-2.5 rounded-xl overflow-y-auto space-y-2 font-mono text-[9px] text-slate-350 max-h-[160px] my-2 select-text">
              {discoveryLog.map((log, idx) => (
                <div id={`rover-log-${idx}`} key={idx} className="border-l border-orange-500/30 pl-1.5 py-0.5 break-words">
                  {log}
                </div>
              ))}
            </div>

            {/* Last Point of Interest Discovered Card file container mapping */}
            <div className="p-3 bg-slate-950/50 border border-orange-500/15 rounded-xl min-h-[170px] flex flex-col justify-between select-text">
              {gridPOIs.some(p => p.discovered) ? (
                (() => {
                  const latestPOI = [...gridPOIs].reverse().find(p => p.discovered);
                  if (!latestPOI) return null;
                  return (
                    <div className="animate-fadeIn flex flex-col justify-between h-full">
                      <div className="space-y-1">
                        <span className="inline-block text-[8px] px-1 bg-teal-505/20 border border-teal-500/30 text-teal-400 font-bold rounded tracking-widest font-mono uppercase">
                          Latest Scientific Artifact Scan
                        </span>
                        <h5 className="text-xs font-bold text-orange-350 uppercase tracking-wide font-sans">{latestPOI.name}</h5>
                        <p className="text-[10px] text-slate-350 leading-relaxed font-sans font-light bg-slate-900/40 p-1.5 rounded-lg">
                          {latestPOI.fact}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono p-1 border-t border-indigo-500/10 mt-2 text-indigo-300">
                        <span>Analyzed Payload:</span>
                        <span className="font-bold text-teal-400">{latestPOI.item}</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-6 italic font-sans text-xs">
                  Opportunity Robot holds no scientific discoveries yet. Direct your rover to Orange star cells coordinates to scan for chemical specimens.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

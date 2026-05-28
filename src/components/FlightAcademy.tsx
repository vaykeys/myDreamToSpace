import React, { useState, useEffect, useRef } from "react";
import { Award, ShieldAlert, CheckCircle, Flame, RotateCcw, HelpCircle, Compass, Printer } from "lucide-react";
import { TrainingLevel } from "../types";

export default function FlightAcademy({
  onAddBadge,
  onAccuracyReport
}: {
  onAddBadge: () => void;
  onAccuracyReport: (score: number) => void;
}) {
  const [trainingLevels, setTrainingLevels] = useState<TrainingLevel[]>([
    { id: "docking", name: "Autonomous ISS Docking Alignment", completed: false, score: 0 },
    { id: "stars", name: "Celestial Astrogation Grid Lock", completed: false, score: 0 },
    { id: "lifesupport", name: "Scrubber life-support balance", completed: false, score: 0 }
  ]);

  const [activeTab, setActiveTab] = useState<"docking" | "stars" | "lifesupport" | "certificate">("docking");

  // Game/Stage States: DOCKING
  const [dockingOffset, setDockingOffset] = useState(15);
  const [isAlignmentMoving, setIsAlignmentMoving] = useState(true);
  const [dockingAttempted, setDockingAttempted] = useState(false);
  const [dockingResultMsg, setDockingResultMsg] = useState("");

  // Game/Stage States: STARS
  const [currentStarQ, setCurrentStarQ] = useState(0);
  const [starCorrectCount, setStarCorrectCount] = useState(0);
  const [starResultMsg, setStarResultMsg] = useState("");
  const starQuestions = [
    {
      starName: "Polaris",
      factFlag: "The North Star",
      imgSymbol: "✨ Guide Star",
      desc: "This constant, unchanging beacon sits almost exactly above Earth's North Pole. It has served sea explorers and pilots for centuries to locate geographical North.",
      options: ["Sirius", "Polaris", "Betelgeuse"],
      correct: "Polaris"
    },
    {
      starName: "Orion's Belt",
      factFlag: "The Hunter Constellation",
      imgSymbol: "🌌 Three Star align",
      desc: "Three supergiant blue stars aligned perfectly in a row. They are named Alnilam, Alnitak, and Mintaka.",
      options: ["Big Dipper", "Cassiopeia", "Orion's Belt"],
      correct: "Orion's Belt"
    },
    {
      starName: "Sol",
      factFlag: "Our Parent Star",
      imgSymbol: "☀️ Warm Yellow Dwarf",
      desc: "Our cozy nearest star that provides Earth with vital heat and energy. It comprises 99.8% of our solar system's entire gravity weight mass!",
      options: ["Alpha Centauri", "Sol", "Proxima Centauri"],
      correct: "Sol"
    }
  ];

  // Game/Stage States: LIFE SUPPORT
  const [oxygenFlow, setOxygenFlow] = useState(70);
  const [co2Scrub, setCo2Scrub] = useState(25);
  const [nitrogenRatio, setNitrogenRatio] = useState(75);
  const [isSupportActive, setIsSupportActive] = useState(false);
  const [supportResult, setSupportResult] = useState("");

  // Alignment shuttle loop timer
  useEffect(() => {
    let interval: any;
    if (activeTab === "docking" && isAlignmentMoving) {
      interval = setInterval(() => {
        setDockingOffset(prev => {
          // Bounce back and forth between 0 and 100
          const direction = (Math.floor(Date.now() / 800) % 2 === 0) ? -4 : 4;
          const next = prev + direction;
          if (next >= 90) return 90;
          if (next <= 10) return 10;
          return next;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [activeTab, isAlignmentMoving]);

  // Dock clamp alignment click
  const engageDocking = () => {
    setIsAlignmentMoving(false);
    setDockingAttempted(true);

    const targetCenter = 50;
    const difference = Math.abs(dockingOffset - targetCenter);
    const scoreRating = Math.max(0, 100 - Math.floor(difference * 2.2));

    const updatedLevels = [...trainingLevels];
    if (scoreRating >= 75) {
      updatedLevels[0].completed = true;
      updatedLevels[0].score = scoreRating;
      setTrainingLevels(updatedLevels);
      setDockingResultMsg(`PERFECT DOCKING, VERA! 🛰️ Alignment rating at ${scoreRating}%. Latch clamps closed. You successfully delivered cargo to ISS crews! Docking Badge Earned!`);
      onAddBadge();
      onAccuracyReport(scoreRating);
    } else {
      setDockingResultMsg(`Dock Clamp Missed! 🛑 Telemetry alignment ratio was ${scoreRating}%. Safe clamps require at least 75% alignment center balance. Try scanning docking path nodes again!`);
    }
  };

  const resetDocking = () => {
    setIsAlignmentMoving(true);
    setDockingAttempted(false);
    setDockingResultMsg("");
  };

  // Celestial navigation click option choice
  const selectStarAnswer = (opt: string) => {
    const isCorrect = opt === starQuestions[currentStarQ].correct;
    if (isCorrect) setStarCorrectCount(prev => prev + 1);

    if (currentStarQ < starQuestions.length - 1) {
      setCurrentStarQ(prev => prev + 1);
    } else {
      // Evaluate Astrogation graduation
      const finalCount = isCorrect ? starCorrectCount + 1 : starCorrectCount;
      const scoreRating = Math.round((finalCount / starQuestions.length) * 100);

      const updatedLevels = [...trainingLevels];
      setCurrentStarQ(99); // trigger finish view

      if (scoreRating >= 100) {
        updatedLevels[1].completed = true;
        updatedLevels[1].score = scoreRating;
        setTrainingLevels(updatedLevels);
        setStarResultMsg(`CONGRATULATIONS ASTRONAVIGATOR VERA! 🌌 Scorred ${scoreRating}%! You mapped Polaris and Orion Belt correctly. Astrogation Badge Earned!`);
        onAddBadge();
        onAccuracyReport(scoreRating);
      } else {
        setStarResultMsg(`Review Star Maps Cadet! Scorred ${scoreRating}%. Zero errors acceptable for stellar course computing paths. Re-calibrate and retry!`);
      }
    }
  };

  const resetStarsChallenge = () => {
    setCurrentStarQ(0);
    setStarCorrectCount(0);
    setStarResultMsg("");
  };

  // Life support slide adjust stabilizer balance clicks
  const checkLifeSupportBalance = () => {
    setIsSupportActive(true);
    // Oxygen optimal range 19.5% to 23.5%
    // Carbon scrub level optimal <= 10%
    // Nitrogen balance optimal surrounding 70% to 80%

    setTimeout(() => {
      const isO2Healthy = oxygenFlow >= 19 && oxygenFlow <= 24;
      const isCo2Healthy = co2Scrub <= 10;
      const isNitrogenHealthy = nitrogenRatio >= 73 && nitrogenRatio <= 81;

      if (isO2Healthy && isCo2Healthy && isNitrogenHealthy) {
        const scoreRating = 100;
        const updatedLevels = [...trainingLevels];
        updatedLevels[2].completed = true;
        updatedLevels[2].score = scoreRating;
        setTrainingLevels(updatedLevels);
        setSupportResult("EXCELLENT ENGINEER, VERA! 🧑‍🔬 Systems stable! Air scrubbers oxygen composition reads exactly healthy pressure ratios. Life Support systems green line locked in! Badge Earned!");
        onAddBadge();
        onAccuracyReport(scoreRating);
      } else {
        let failures = [];
        if (!isO2Healthy) failures.push("Oxygen gas mix out of bound (Target: 19% - 24%)");
        if (!isCo2Healthy) failures.push("Accumulated CO2 too dense (Target: <= 10%)");
        if (!isNitrogenHealthy) failures.push("Nitrogen pressure gas unstable (Target: 73% - 81%)");
        setSupportResult(`SYSTEM CRITICAL WARNING ⚠️: ${failures.join(", ")}. Cabin health falling! Readjust scrub controls.`);
      }
      setIsSupportActive(false);
    }, 800);
  };

  const resetSupportGame = () => {
    setOxygenFlow(70);
    setCo2Scrub(25);
    setNitrogenRatio(75);
    setSupportResult("");
  };

  // Certificate triggers
  const earnedAllBadges = trainingLevels.every(l => l.completed);

  return (
    <div id="flight-academy-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-text">
      {/* Academy Tabs Navigation Bar (Left) */}
      <div className="lg:col-span-3 p-4 bg-slate-900/50 border border-indigo-500/10 rounded-2xl flex flex-col justify-between shadow-xl space-y-4">
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest pb-2 border-b border-indigo-500/10">
            Academy Academy Modules
          </h4>

          <div className="flex flex-col gap-1.5">
            {trainingLevels.map((lvl) => (
              <button
                id={`tab-btn-${lvl.id}`}
                key={lvl.id}
                onClick={() => setActiveTab(lvl.id as any)}
                className={`py-2 px-3 text-left text-xs rounded-xl border font-sans cursor-pointer transition-all flex items-center justify-between ${
                  activeTab === lvl.id 
                    ? "border-indigo-400 bg-indigo-950/30 text-slate-200 font-semibold" 
                    : "border-slate-800 bg-slate-950/20 text-slate-450 hover:text-slate-300 uppercase"
                }`}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm">{lvl.id === "docking" ? "📡" : lvl.id === "stars" ? "🌌" : "🌱"}</span>
                  <span className="truncate max-w-[130px] font-sans text-left">{lvl.name}</span>
                </div>
                {lvl.completed ? (
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                ) : (
                  <span className="text-[8px] font-mono px-1 bg-slate-950 rounded text-slate-500 uppercase"> cadet </span>
                )}
              </button>
            ))}

            {/* Achievement Badge certificate lock tab */}
            <button
              id="tab-btn-cert"
              onClick={() => setActiveTab("certificate")}
              className={`py-2 mt-4 px-3 text-left text-xs rounded-xl border font-sans font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "certificate" 
                  ? "border-amber-400 bg-amber-950/20 text-slate-200" 
                  : earnedAllBadges 
                    ? "border-emerald-500 bg-emerald-950/15 text-emerald-300 animate-pulse" 
                    : "border-slate-800 bg-slate-950/20 text-slate-500"
              }`}
            >
              <span>🎓</span>
              <span>Cadet Certificate</span>
              {earnedAllBadges && <span className="text-[7px] bg-emerald-500 text-slate-950 px-1 rounded uppercase tracking-wider scale-[0.8] font-black">Ready</span>}
            </button>
          </div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-indigo-500/5 text-center shrink-0">
          <span className="text-[9px] text-slate-500 font-mono">CADET STATUS PROFILE:</span>
          <div className="flex justify-center gap-1 mt-1.5 text-lg select-none">
            {trainingLevels[0].completed ? "🎖️" : "📁"}
            {trainingLevels[1].completed ? "🎖️" : "📁"}
            {trainingLevels[2].completed ? "🎖️" : "📁"}
          </div>
          <p className="text-[9px] text-indigo-300 font-mono mt-1">
            {trainingLevels.filter(l => l.completed).length}/3 Badges Obtained
          </p>
        </div>
      </div>

      {/* Module Interface Interactive view containers (Right Center) */}
      <div className="lg:col-span-9 p-5 rounded-2xl bg-slate-900/50 border border-indigo-500/10 backdrop-blur-md flex flex-col justify-between shadow-xl min-h-[460px]">
        {/* VIEW: DOCKING ALIGNMENT */}
        {activeTab === "docking" && (
          <div id="docking-stage-view" className="space-y-5 animate-fadeIn flex flex-col justify-between h-full">
            <div className="space-y-1">
              <span className="text-[8px] px-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded tracking-widest font-mono">STATION MODULE SEQC-X</span>
              <h3 className="text-sm font-sans font-bold text-slate-200 uppercase tracking-wide">ISS Cargo Dock-Port Alignment</h3>
              <p className="text-xs text-slate-400 leading-tight">
                Vera, your docking shuttle is approaching the ISS cargo ringport! Wait for the moving green scanner indicator to center exactly onto the yellow capture target center (50%) and hit Docking Lock!
              </p>
            </div>

            {/* Animation match grid area */}
            <div className="py-6 flex flex-col items-center">
              <div className="w-full max-w-md bg-slate-950 p-4 rounded-xl border border-indigo-500/15 relative">
                {/* Station target grid center visual */}
                <div className="absolute left-[50%] inset-y-0 w-1 bg-amber-400/80 z-10"></div>
                {/* Safe zone lines overlay */}
                <div className="absolute left-[38%] inset-y-0 w-24 bg-emerald-500/10 border-x border-dashed border-emerald-500/20"></div>

                {/* Shifting Shuttle ring indicator */}
                <div className="h-10 relative flex items-center">
                  <div 
                    className="absolute w-8 h-8 rounded-full bg-indigo-500/10 border-4 border-indigo-400 flex items-center justify-center transition-all duration-75 text-xs font-bold leading-none shrink-0"
                    style={{ left: `${dockingOffset}%`, transform: "translateX(-50%)" }}
                  >
                    🛰️
                  </div>
                </div>

                {/* Legend target indicators */}
                <div className="flex justify-between text-[9px] font-mono mt-4 text-slate-500 select-none">
                  <span>LEFT BOUNDS</span>
                  <span className="text-amber-300">CAPTURE CORE (50)</span>
                  <span>RIGHT BOUNDS</span>
                </div>
              </div>

              {/* Offset indicator bar */}
              <div className="w-full max-w-sm mt-4 bg-slate-950 p-2.5 rounded-lg border border-indigo-500/10 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Telemetry Sensor:</span>
                <span className="font-bold text-slate-200">{dockingOffset}% Capture Range</span>
              </div>
            </div>

            {/* Stage actions controls */}
            <div className="border-t border-indigo-500/10 pt-4 flex gap-4">
              {!dockingAttempted ? (
                <button
                  id="docking-engage-btn"
                  onClick={engageDocking}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-md"
                >
                  LOCK CARGO DOCK CLAMP
                </button>
              ) : (
                <div className="w-full space-y-3">
                  <p className={`text-xs p-3.5 rounded-xl border text-center leading-normal select-text ${
                    trainingLevels[0].completed 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  }`}>
                    {dockingResultMsg}
                  </p>
                  <button
                    id="docking-retry-btn"
                    onClick={resetDocking}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 hover:border-indigo-400 border border-slate-700 text-indigo-300 text-xs font-sans rounded-xl cursor-pointer transition-all"
                  >
                    RE-ENGAGE NAVIGATION ENGINES
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: STARS CONSTELLATION ASTROGATION */}
        {activeTab === "stars" && (
          <div id="stars-stage-view" className="space-y-4 animate-fadeIn flex flex-col justify-between h-full">
            <div className="space-y-1">
              <span className="text-[8px] px-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded tracking-widest font-mono">STATION CELESTIAL NAV MODULE</span>
              <h3 className="text-sm font-sans font-bold text-slate-200 uppercase tracking-wide">Course Alignment Astrogation</h3>
              <p className="text-xs text-slate-400 leading-tight">
                Vera, orbital satellites navigate using surrounding constant stars! Answer these quick courses questions to orient your astronaut ship course vector perfectly.
              </p>
            </div>

            {/* Question Quiz Layout file mapping */}
            {currentStarQ !== 99 ? (
              <div className="my-3 p-4 bg-slate-950 p-4 rounded-xl border border-indigo-500/15 relative space-y-4 select-text">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-indigo-300">SPECTRAL CARD #{currentStarQ + 1} OF 3:</span>
                  <span className="text-[9px] font-mono px-2 bg-indigo-505/10 rounded text-amber-300">{starQuestions[currentStarQ].factFlag}</span>
                </div>

                <div className="flex gap-4 items-center flex-col md:flex-row py-2 text-center md:text-left">
                  <span className="text-5xl select-none animate-pulse shrink-0">{starQuestions[currentStarQ].imgSymbol === "✨ Guide Star" ? "⭐" : starQuestions[currentStarQ].imgSymbol === "🌌 Three Star align" ? "🌟🌟🌟" : "☀️"}</span>
                  <div>
                    <h4 className="text-sm font-sans font-bold text-slate-200 mb-1">
                      Identify this Celestial Objective:
                    </h4>
                    <p className="text-xs text-indigo-100 font-light leading-relaxed">
                      {starQuestions[currentStarQ].desc}
                    </p>
                  </div>
                </div>

                {/* Multiple choices options list mapped columns */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {starQuestions[currentStarQ].options.map((opt, oIdx) => (
                    <button
                      id={`star-opt-${oIdx}`}
                      key={oIdx}
                      onClick={() => selectStarAnswer(opt)}
                      className="py-2.5 px-2 bg-slate-900 select-none hover:bg-indigo-950 hover:border-indigo-400 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-sans cursor-pointer transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="my-3 p-4 bg-slate-950 rounded-xl border border-indigo-500/15 text-center space-y-4">
                <p className={`text-xs p-3.5 rounded-xl border leading-relaxed select-text ${
                  trainingLevels[1].completed 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                }`}>
                  {starResultMsg}
                </p>
                <button
                  id="star-retry-btn"
                  onClick={resetStarsChallenge}
                  className="w-full py-2 bg-slate-850 hover:bg-slate-700 hover:border-indigo-400 border border-slate-700 text-indigo-300 text-xs font-sans rounded-xl cursor-pointer transition-all"
                >
                  RESTORE STELLAR COMPUTER CHECKPOINT
                </button>
              </div>
            )}

            <div className="text-[10px] font-mono text-slate-500 text-center">
              Constellation star recognition accuracy builds strong navigation pilots. Correct: {starCorrectCount}
            </div>
          </div>
        )}

        {/* VIEW: LIFE SUPPORT MIX BUFFER */}
        {activeTab === "lifesupport" && (
          <div id="lifesupport-stage-view" className="space-y-4 animate-fadeIn flex flex-col justify-between h-full">
            <div className="space-y-1">
              <span className="text-[8px] px-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded tracking-widest font-mono">STATION ENGINEERING DECK</span>
              <h3 className="text-sm font-sans font-bold text-slate-200 uppercase tracking-wide">Cabin Air Scrubber Balance</h3>
              <p className="text-xs text-slate-400 leading-tight">
                Vera, balancing our spacesuit & spacecraft gas levels is essential to keep pilots breathing safely. Ensure Oxygen flow is healthy (Target: 19% - 24%), Carbon Dioxide is low (Target: &lt;= 10%), and Nitrogen ratio sits around (73% - 81%).
              </p>
            </div>

            {/* Slider stabilizers indicators panel */}
            <div className="my-2 p-4 bg-slate-950 rounded-xl border border-indigo-500/15 relative space-y-4">
              {/* OXYGEN flow mix */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">💨 Oxygen Mixture</span>
                  <span className={`font-mono text-xs font-bold ${oxygenFlow >= 19 && oxygenFlow <= 24 ? "text-teal-400" : "text-rose-450"}`}>
                    {oxygenFlow}% {oxygenFlow >= 19 && oxygenFlow <= 24 ? "(STABLE)" : "(WARNING)"}
                  </span>
                </div>
                <input
                  id="suport-slide-oxygen"
                  type="range"
                  min="5"
                  max="95"
                  value={oxygenFlow}
                  onChange={(e) => setOxygenFlow(parseInt(e.target.value))}
                  className="w-full accent-teal-400 h-1 bg-slate-900 rounded appearance-none"
                />
              </div>

              {/* CO2 density */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">☣️ Carbon Dioxide density</span>
                  <span className={`font-mono text-xs font-bold ${co2Scrub <= 10 ? "text-teal-400" : "text-rose-450"}`}>
                    {co2Scrub}% {co2Scrub <= 10 ? "(CLEAR AIR)" : "(TOXIC OVERLAY)"}
                  </span>
                </div>
                <input
                  id="suport-slide-co2"
                  type="range"
                  min="0"
                  max="50"
                  value={co2Scrub}
                  onChange={(e) => setCo2Scrub(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-900 rounded appearance-none"
                />
              </div>

              {/* NITROGEN buffering mix */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">🛰️ Nitrogen buffering Pressure</span>
                  <span className={`font-mono text-xs font-bold ${nitrogenRatio >= 73 && nitrogenRatio <= 81 ? "text-teal-400" : "text-rose-450"}`}>
                    {nitrogenRatio}% {nitrogenRatio >= 73 && nitrogenRatio <= 81 ? "(LOCKED)" : "(FLUID PRESSURE WARNING)"}
                  </span>
                </div>
                <input
                  id="suport-slide-nitrogen"
                  type="range"
                  min="50"
                  max="95"
                  value={nitrogenRatio}
                  onChange={(e) => setNitrogenRatio(parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-1 bg-slate-900 rounded appearance-none"
                />
              </div>
            </div>

            {/* Stage actions controls */}
            <div className="border-t border-indigo-500/10 pt-4 flex flex-col gap-3">
              {supportResult === "" ? (
                <button
                  id="support-stabilize-btn"
                  disabled={isSupportActive}
                  onClick={checkLifeSupportBalance}
                  className="w-full py-2.5 bg-indigo-600 border border-indigo-500/10 hover:bg-slate-800 hover:border-indigo-400 text-white font-sans text-xs font-semibold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {isSupportActive ? "Analyzing cabin gases..." : "STABILIZE SCRUBBER COMPOSITION"}
                </button>
              ) : (
                <div className="w-full space-y-3">
                  <p className={`text-xs p-3.5 rounded-xl border leading-relaxed select-text ${
                    trainingLevels[2].completed 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  }`}>
                    {supportResult}
                  </p>
                  <button
                    id="support-clear-btn"
                    onClick={resetSupportGame}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 hover:border-indigo-500 border border-slate-700 text-indigo-300 text-xs font-sans rounded-xl cursor-pointer transition-all"
                  >
                    RESET VALVES TO RE-BALANCE
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: CADET GRADUATION CERTIFICATE PANEL */}
        {activeTab === "certificate" && (
          <div id="certificate-stage-view" className="space-y-4 animate-fadeIn flex flex-col justify-between h-full select-text">
            <div className="space-y-1">
              <span className="text-[8px] px-1.5 bg-amber-450/10 text-amber-300 border border-amber-400/25 rounded tracking-widest font-mono">SECRETARY GENERAL DECREE</span>
              <h3 className="text-sm font-sans font-bold text-slate-200 uppercase tracking-wide">NASA Cadet Flight Certification</h3>
              <p className="text-xs text-slate-400 leading-tight">
                Vera, once you complete all 3 training stages (ISS Docking, Constellation Course Mapping, and Scrubber Life Support Balance), your beautiful NASA Youth Space badge will generate right here!
              </p>
            </div>

            {earnedAllBadges ? (
              <div className="my-2 p-1.5 bg-gradient-to-r from-teal-500/5 via-amber-400/5 to-purple-500/5 rounded-2xl border border-amber-400/50 relative space-y-4">
                {/* Embedded SVG framed custom printable Certificate container */}
                <div id="graduation-printable-cert" className="p-6 bg-slate-950 rounded-xl relative border-4 border-amber-400/65 shadow-2xl space-y-5 select-text overflow-hidden text-center max-w-lg mx-auto">
                  {/* Decorative background vectors */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-505/5 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex justify-center flex-col items-center">
                    <span className="text-5xl select-none filter drop-shadow animate-pulse">🎖️</span>
                    <span className="text-[9px] font-mono tracking-widest text-amber-300 font-bold uppercase mt-1">NATIONAL AERONAUTICS AND SPACE ADMINISTRATION</span>
                  </div>

                  <div className="space-y-1.5 my-2">
                    <h4 className="text-xs font-mono font-extrabold uppercase tracking-wide text-slate-350">
                      OFFICIAL SPACE FLIGHT GRADUATE
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-none">This honors badge declares that</p>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-sans tracking-wide leading-none p-2 border-b-2 border-dashed border-amber-400/40 inline-block uppercase select-text px-4">
                      Vera, Astronaut Cadet
                    </h3>
                    <p className="text-[10.5px] text-slate-300 font-serif leading-relaxed max-w-sm mx-auto pt-1 font-light italic">
                      has successfully calibrated gravity trajectory courses, assembled advanced rocketry engine parameters, and executed safe automation rovers on Mars surface.
                    </p>
                  </div>

                  {/* Signatures column grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3 text-[10px] font-mono">
                    <div className="text-center">
                      <span className="block italic text-amber-300 select-text">~ Ranger Stella ~</span>
                      <span className="block text-[8px] text-slate-500 uppercase leading-normal">NASA Space Mentor</span>
                    </div>
                    <div className="text-center border-l border-slate-800">
                      <span className="block text-slate-300 select-text">2026-05-28</span>
                      <span className="block text-[8px] text-slate-500 uppercase leading-normal">Date Certified</span>
                    </div>
                  </div>
                </div>

                {/* Print action trigger button instructions */}
                <div className="flex justify-center">
                  <button
                    id="print-cert-btn"
                    onClick={() => {
                      const printContents = document.getElementById("graduation-printable-cert")?.innerHTML;
                      if (printContents) {
                        const originalContents = document.body.innerHTML;
                        // Build simple temporary print frame window directly
                        const win = window.open("", "_blank");
                        if (win) {
                          win.document.write(`
                            <html>
                              <head>
                                <title>Vera Space Certification</title>
                                <style>
                                  body { background-color: #020617; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                                  .print-box { border: 4px solid #fbbf24; padding: 30px; border-radius: 12px; background-color: #090d16; text-align: center; max-width: 500px; width: 100%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
                                  h3 { border-bottom: 2px dashed #fbbf24; display: inline-block; padding-bottom: 5px; margin: 15px 0; color: #ffffff; }
                                  p { font-size: 14px; color: #cbd5e1; }
                                  .flex-sig { display: flex; justify-content: space-around; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; font-size: 12px; }
                                </style>
                              </head>
                              <body>
                                <div class="print-box">
                                  ${printContents}
                                </div>
                                <script>
                                  window.onload = function() { window.print(); }
                                </script>
                              </body>
                            </html>
                          `);
                          win.document.close();
                        }
                      }
                    }}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print My NASA Space badge</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-2 p-14 bg-slate-950 border border-slate-900 text-slate-500 italic rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                <ShieldAlert className="w-10 h-10 text-slate-650" />
                <p className="text-xs">
                  Your graduation scroll is currently locked. Complete ISS Docking Alignment, Celestial Astrogation Course lock, and life-support gas balance above to fulfill standard launch protocols and earn all 3 badges!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

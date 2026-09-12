import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Flame,
  Coffee,
  Pill,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";
import { ANCTriageResult } from "../types";

export const ANCTriageCalculator: React.FC = () => {
  const [population, setPopulation] = useState<"general" | "ben">("general");
  const [directAnc, setDirectAnc] = useState<number>(1850);
  const [useWbcCalc, setUseWbcCalc] = useState<boolean>(false);
  const [wbc, setWbc] = useState<number>(5500);
  const [segs, setSegs] = useState<number>(50);
  const [bands, setBands] = useState<number>(4);

  const effectiveAnc = useWbcCalc ? Math.round((wbc * (segs + bands)) / 100) : directAnc;

  const calculateTriage = (anc: number, pop: "general" | "ben"): ANCTriageResult => {
    if (pop === "general") {
      if (anc >= 1500) {
        return {
          category: "Normal / Safe",
          badgeColor: "bg-emerald-900/40 text-emerald-300 border-emerald-700/60",
          actionRequired: "Continue current monitoring cadence (Weekly x 6mo -> Bi-weekly x 6mo -> Every 4wks).",
          testingFrequency: "Per standard cadence",
          canContinueClozapine: true,
          canRechallengeInFuture: true,
          gcsfRecommended: false,
          clinicalNotes: "Normal granulocyte count. Maintain routine surveillance.",
        };
      } else if (anc >= 1000 && anc < 1500) {
        return {
          category: "Mild Neutropenia",
          badgeColor: "bg-amber-900/40 text-amber-300 border-amber-700/60",
          actionRequired: "DO NOT STOP CLOZAPINE. Increase ANC monitoring frequency to 3 times per week until ANC >= 1500.",
          testingFrequency: "3 times per week until ANC >= 1500",
          canContinueClozapine: true,
          canRechallengeInFuture: true,
          gcsfRecommended: false,
          clinicalNotes: "Do not stop clozapine prematurely. Unnecessary discontinuation risks psychiatric relapse.",
        };
      } else if (anc >= 500 && anc < 1000) {
        return {
          category: "Moderate Neutropenia",
          badgeColor: "bg-orange-900/40 text-orange-300 border-orange-700/60",
          actionRequired: "INTERRUPT CLOZAPINE IMMEDIATELY. Daily ANC testing. Obtain infectious disease & hematology consultation.",
          testingFrequency: "Daily until ANC >= 1000",
          canContinueClozapine: false,
          canRechallengeInFuture: true,
          gcsfRecommended: false,
          clinicalNotes: "Hold medication. May resume therapy under close monitoring once ANC recovers to >= 1000/uL.",
        };
      } else {
        return {
          category: "Severe Agranulocytosis",
          badgeColor: "bg-red-900/50 text-red-300 border-red-700/70",
          actionRequired: "EMERGENCY: PERMANENTLY DISCONTINUE CLOZAPINE. Reverse protective isolation. Stat Hematology consult. Administer G-CSF (Filgrastim).",
          testingFrequency: "Daily until complete hematologic recovery",
          canContinueClozapine: false,
          canRechallengeInFuture: false,
          gcsfRecommended: true,
          clinicalNotes: "DO NOT RECHALLENGE. Severe idiosyncratic granulocyte destruction. High risk of fatal sepsis.",
        };
      }
    } else {
      // Benign Ethnic Neutropenia (BEN) Protocol
      if (anc >= 1000) {
        return {
          category: "Normal / Safe",
          badgeColor: "bg-emerald-900/40 text-emerald-300 border-emerald-700/60",
          actionRequired: "Continue clozapine. Baseline for BEN is >= 1000 /uL. Maintain standard monitoring cadence.",
          testingFrequency: "Per standard cadence",
          canContinueClozapine: true,
          canRechallengeInFuture: true,
          gcsfRecommended: false,
          clinicalNotes: "Normal physiologic baseline for patient with DARC/ACKR1 null variant. Do not stop.",
        };
      } else if (anc >= 500 && anc < 1000) {
        return {
          category: "Moderate Neutropenia",
          badgeColor: "bg-amber-900/40 text-amber-300 border-amber-700/60",
          actionRequired: "Continue clozapine if stable OR obtain urgent repeat. Monitor ANC 3 times per week until ANC >= 1000.",
          testingFrequency: "3 times per week until ANC >= 1000",
          canContinueClozapine: true,
          canRechallengeInFuture: true,
          gcsfRecommended: false,
          clinicalNotes: "BEN patients tolerate lower circulating neutrophil counts without increased bacterial infection.",
        };
      } else {
        return {
          category: "Severe Agranulocytosis",
          badgeColor: "bg-red-900/50 text-red-300 border-red-700/70",
          actionRequired: "INTERRUPT / DISCONTINUE CLOZAPINE. Daily CBC. Stat hematology review. Administer G-CSF if febrile.",
          testingFrequency: "Daily until recovery",
          canContinueClozapine: false,
          canRechallengeInFuture: false,
          gcsfRecommended: true,
          clinicalNotes: "ANC < 500 in BEN patient represents genuine marrow toxicity requiring emergency protocol.",
        };
      }
    }
  };

  const triage = calculateTriage(effectiveAnc, population);

  return (
    <div id="anc-triage-tool" className="bg-slate-900/90 border border-teal-800/40 rounded-xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-950/70 text-teal-300 rounded-lg border border-teal-700/50">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-base">Absolute Neutrophil Count (ANC) Triage Engine</h4>
            <p className="text-xs text-slate-400">Post-2025 FDA Clinical Practice Protocol</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-teal-900/30 text-teal-300 border border-teal-700/40 rounded-full font-mono">
          REMS 2025 Refined
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Population Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Target Patient Population
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="pop-general-btn"
              type="button"
              onClick={() => setPopulation("general")}
              className={`p-3 rounded-lg border text-left transition-all ${
                population === "general"
                  ? "bg-teal-950/60 border-teal-500/80 text-teal-200 ring-1 ring-teal-500/50"
                  : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="font-medium text-xs">General Population</div>
              <div className="text-[11px] text-slate-400 mt-1">Baseline ANC ≥ 1,500 /uL</div>
            </button>
            <button
              id="pop-ben-btn"
              type="button"
              onClick={() => setPopulation("ben")}
              className={`p-3 rounded-lg border text-left transition-all ${
                population === "ben"
                  ? "bg-teal-950/60 border-teal-500/80 text-teal-200 ring-1 ring-teal-500/50"
                  : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="font-medium text-xs">Benign Ethnic Neutropenia</div>
              <div className="text-[11px] text-slate-400 mt-1">Baseline ANC ≥ 1,000 /uL (DARC null)</div>
            </button>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Input Mode</span>
              <button
                type="button"
                onClick={() => setUseWbcCalc(!useWbcCalc)}
                className="text-teal-400 hover:underline text-[11px]"
              >
                {useWbcCalc ? "Switch to Direct ANC" : "Calculate from WBC & Differentials"}
              </button>
            </div>

            {!useWbcCalc ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Absolute Neutrophil Count</span>
                  <span className="font-mono text-teal-300 font-bold">{directAnc.toLocaleString()} /uL</span>
                </div>
                <input
                  id="anc-slider"
                  type="range"
                  min={100}
                  max={4500}
                  step={50}
                  value={directAnc}
                  onChange={(e) => setDirectAnc(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span className="text-red-400">&lt;500 (Agranulocytosis)</span>
                  <span className="text-amber-400">1000 (BEN base)</span>
                  <span className="text-teal-400">1500 (General base)</span>
                  <span>4000+</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total WBC (/uL)</span>
                  <input
                    type="number"
                    value={wbc}
                    onChange={(e) => setWbc(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Segs (%)</span>
                  <input
                    type="number"
                    value={segs}
                    onChange={(e) => setSegs(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Bands (%)</span>
                  <input
                    type="number"
                    value={bands}
                    onChange={(e) => setBands(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Triage Output Card */}
        <div className={`rounded-xl border p-4 flex flex-col justify-between ${triage.badgeColor}`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Clinical Triage Classification</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/30">
                ANC: {effectiveAnc.toLocaleString()} /uL
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              {triage.canContinueClozapine ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              {triage.category}
            </h3>
            <p className="text-xs leading-relaxed opacity-90 mb-3">{triage.actionRequired}</p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-current/20 text-xs">
            <div className="flex justify-between">
              <span className="opacity-80">Continue Clozapine:</span>
              <span className="font-semibold">{triage.canContinueClozapine ? "YES (Permitted)" : "NO (Cease Immediately)"}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Testing Cadence:</span>
              <span className="font-semibold">{triage.testingFrequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">G-CSF (Filgrastim):</span>
              <span className="font-semibold">{triage.gcsfRecommended ? "Urgent Evaluation" : "Not Indicated"}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Future Rechallenge:</span>
              <span className="font-semibold">{triage.canRechallengeInFuture ? "Possible" : "STRICTLY CONTRAINDICATED"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-slate-200">2025 REMS Clinical Pearl: </span>
          The elimination of the centralized REMS registry portal by the FDA on February 24, 2025 removes administrative lockouts and mandatory web reporting, but does not alter standard medical-legal ANC monitoring standards.
        </div>
      </div>
    </div>
  );
};

export const CYP1A2Simulator: React.FC = () => {
  const [dose, setDose] = useState<number>(300);
  const [smoking, setSmoking] = useState<boolean>(false);
  const [quittingSmoking, setQuittingSmoking] = useState<boolean>(false);
  const [coffeeCups, setCoffeeCups] = useState<number>(1);
  const [fluvoxamine, setFluvoxamine] = useState<boolean>(false);
  const [ciprofloxacin, setCiprofloxacin] = useState<boolean>(false);

  // Baseline clearance calculation
  // Smokers have ~1.6x clearance (levels drop by ~38%)
  // Quitting smoking halts induction, levels jump 1.8-2x
  let multiplier = 1.0;

  if (smoking) {
    multiplier *= 0.62; // Tobacco induction lowers levels by ~38%
  }
  if (quittingSmoking) {
    multiplier *= 1.95; // Abrupt cessation without dose reduction causes doubling
  }
  if (fluvoxamine) {
    multiplier *= 5.5; // Potent CYP1A2 inhibition
  }
  if (ciprofloxacin) {
    multiplier *= 2.6; // Potent fluoroquinolone 1A2 inhibition
  }
  // Caffeine competition
  if (coffeeCups >= 3) {
    multiplier *= 1 + (coffeeCups - 2) * 0.08;
  }

  // Base concentration roughly 1.15 ng/mL per mg clozapine in a standard non-smoking adult
  const estimatedLevel = Math.round(dose * 1.15 * multiplier);

  const getLevelStatus = (level: number) => {
    if (level < 350) {
      return {
        label: "Subtherapeutic (< 350 ng/mL)",
        color: "text-amber-400 bg-amber-950/50 border-amber-700/60",
        message: "High risk of treatment resistance or psychotic relapse. Dose titration needed.",
      };
    } else if (level >= 350 && level <= 600) {
      return {
        label: "Optimal Therapeutic Window (350 - 600 ng/mL)",
        color: "text-emerald-400 bg-emerald-950/50 border-emerald-700/60",
        message: "Ideal response window for Treatment-Resistant Schizophrenia with balanced safety.",
      };
    } else if (level > 600 && level <= 999) {
      return {
        label: "Elevated Level (> 600 ng/mL) - Seizure Alert",
        color: "text-orange-400 bg-orange-950/50 border-orange-700/60",
        message: "Sharp increase in myoclonic jerks and EEG spikes. Consider adding valproate or reducing dose.",
      };
    } else {
      return {
        label: "CRITICAL TOXICITY (> 1,000 ng/mL)",
        color: "text-red-400 bg-red-950/60 border-red-700/80 animate-pulse",
        message: "DANGER: High risk of grand mal seizures, status epilepticus, severe sedation, and coma!",
      };
    }
  };

  const status = getLevelStatus(estimatedLevel);

  return (
    <div id="cyp1a2-simulator-tool" className="bg-slate-900/90 border border-cyan-800/40 rounded-xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/70 text-cyan-300 rounded-lg border border-cyan-700/50">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-base">CYP1A2 Pharmacokinetic & Drug Interaction Simulator</h4>
            <p className="text-xs text-slate-400">Model the 70% Hepatic Clearance Pathway & Level Fluctuations</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-cyan-900/30 text-cyan-300 border border-cyan-700/40 rounded-full font-mono">
          TDM Calculator
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Daily Clozapine Dose</span>
              <span className="font-mono text-cyan-300 font-bold">{dose} mg/day</span>
            </div>
            <input
              type="range"
              min={25}
              max={800}
              step={25}
              value={dose}
              onChange={(e) => setDose(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>25 mg</span>
              <span>300 mg (Avg)</span>
              <span>600 mg</span>
              <span>800 mg</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Xenobiotic & Dietary Modulators
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSmoking(!smoking);
                  if (!smoking) setQuittingSmoking(false);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                  smoking
                    ? "bg-cyan-950/70 border-cyan-500 text-cyan-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Active Cigarette Smoker</span>
                <span className="font-mono text-[10px]">-35% Level</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuittingSmoking(!quittingSmoking);
                  if (!quittingSmoking) setSmoking(false);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                  quittingSmoking
                    ? "bg-red-950/70 border-red-500 text-red-200 ring-1 ring-red-500"
                    : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Abrupt Smoking Cessation</span>
                <span className="font-mono text-[10px] text-red-400">+100% Level</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Daily Coffee / Caffeine</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={6}
                  value={coffeeCups}
                  onChange={(e) => setCoffeeCups(Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-700 rounded-lg accent-amber-400"
                />
                <span className="font-mono text-amber-300 w-12 text-right">{coffeeCups} cups</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFluvoxamine(!fluvoxamine)}
                className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                  fluvoxamine
                    ? "bg-red-950/80 border-red-500 text-red-100 ring-1 ring-red-500"
                    : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-red-400" />
                  + Fluvoxamine (1A2i)
                </span>
                <span className="font-mono text-[10px] text-red-400">5-10x</span>
              </button>

              <button
                type="button"
                onClick={() => setCiprofloxacin(!ciprofloxacin)}
                className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                  ciprofloxacin
                    ? "bg-red-950/80 border-red-500 text-red-100 ring-1 ring-red-500"
                    : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-orange-400" />
                  + Ciprofloxacin (1A2i)
                </span>
                <span className="font-mono text-[10px] text-orange-400">2.5x</span>
              </button>
            </div>
          </div>
        </div>

        {/* TDM Result Gauge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-medium">Estimated 12-Hour Trough Concentration</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                Target: 350-600 ng/mL
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black font-mono text-slate-100 tracking-tight">
                {estimatedLevel.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-400">ng/mL</span>
            </div>

            {/* Visual Level Bar */}
            <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
              {/* Target zone 350 to 600 */}
              <div
                className="absolute top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-400/60"
                style={{ left: "29%", width: "21%" }}
              />
              {/* Warning zone 600 to 1000 */}
              <div
                className="absolute top-0 bottom-0 bg-orange-500/30 border-r border-orange-400/60"
                style={{ left: "50%", width: "33%" }}
              />
              {/* Critical zone >1000 */}
              <div className="absolute top-0 bottom-0 bg-red-500/30" style={{ left: "83%", width: "17%" }} />
              {/* Current indicator marker */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#ffffff] transition-all duration-300"
                style={{ left: `${Math.min(100, Math.max(0, (estimatedLevel / 1200) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-4">
              <span>0</span>
              <span className="text-emerald-400 font-bold">350 (Min Efficacy)</span>
              <span className="text-orange-400 font-bold">600 (Threshold)</span>
              <span className="text-red-400 font-bold">1000+ (Toxic)</span>
            </div>

            <div className={`p-3 rounded-lg border text-xs ${status.color}`}>
              <div className="font-bold mb-1">{status.label}</div>
              <div className="text-[11px] leading-relaxed opacity-90">{status.message}</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-4 flex items-center justify-between">
            <span>Metabolic Pathway: CYP1A2 (~70%)</span>
            <span className="font-mono text-cyan-400 font-medium">Draw exact 12h post-dose</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MissedDoseResetCalculator: React.FC = () => {
  const [missedHours, setMissedHours] = useState<number>(36);
  const [regularDose, setRegularDose] = useState<number>(400);

  const isResetRequired = missedHours >= 48;

  return (
    <div id="missed-dose-tool" className="bg-slate-900/90 border border-purple-800/40 rounded-xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-950/70 text-purple-300 rounded-lg border border-purple-700/50">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-base">The 48-Hour Missed Dose Reset Calculator</h4>
            <p className="text-xs text-slate-400">Autonomic Tolerance Decay & Safety Re-titration Protocol</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-purple-900/30 text-purple-300 border border-purple-700/40 rounded-full font-mono">
          Black Box Safety Rule
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300">Prescribed Maintenance Dose</span>
              <span className="font-mono text-purple-300 font-bold">{regularDose} mg/day</span>
            </div>
            <input
              type="range"
              min={100}
              max={800}
              step={25}
              value={regularDose}
              onChange={(e) => setRegularDose(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300">Consecutive Hours Without Clozapine</span>
              <span
                className={`font-mono font-bold text-sm ${
                  isResetRequired ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {missedHours} Hours ({Math.floor(missedHours / 24)}d {missedHours % 24}h)
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={96}
              step={6}
              value={missedHours}
              onChange={(e) => setMissedHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>6h</span>
              <span>24h (1 day)</span>
              <span className="text-amber-400 font-bold">48h (CRITICAL BOUNDARY)</span>
              <span>72h</span>
              <span>96h</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between ${
            isResetRequired
              ? "bg-red-950/60 border-red-700/80 text-red-200"
              : "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isResetRequired ? (
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <h4 className="font-bold text-base">
                {isResetRequired ? "RESET MANDATORY: RE-START AT 12.5 MG" : "RESUME REGULAR DOSE PERMITTED"}
              </h4>
            </div>

            <p className="text-xs leading-relaxed mb-3 opacity-90">
              {isResetRequired
                ? `More than 48 hours have elapsed. Tolerance to alpha-1 adrenergic vasodilation and vagal reflexes has decayed. Administering ${regularDose} mg now risks severe orthostatic collapse, syncope, and cardiac arrest.`
                : `Less than 48 hours have elapsed. Autonomic tolerance remains intact. The patient may resume their regular ${regularDose} mg dose. Advise rising slowly from bed and staying well-hydrated.`}
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-lg text-xs space-y-1 font-mono">
            {isResetRequired ? (
              <>
                <div className="text-red-300 font-semibold">Step 1: Day 1 dose = 12.5 mg at bedtime</div>
                <div className="text-slate-300">Step 2: Day 2 dose = 25 mg (12.5 mg bid or 25 mg qhs)</div>
                <div className="text-slate-300">Step 3: Rapid re-titration by 25-50 mg/day under BP observation</div>
              </>
            ) : (
              <>
                <div className="text-emerald-300 font-semibold">Action: Take next scheduled dose of {regularDose} mg</div>
                <div className="text-slate-300">Check: Sitting/standing BP if feeling lightheaded</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Atom, Info, Sparkles } from "lucide-react";

interface ReceptorPoint {
  key: string;
  name: string;
  clozapineKi: number; // in nM (lower is tighter affinity)
  haloperidolKi: number;
  olanzapineKi: number;
  role: string;
  clozapineClinicalPhenotype: string;
}

const RECEPTORS: ReceptorPoint[] = [
  {
    key: "D2",
    name: "Dopamine D2",
    clozapineKi: 160,
    haloperidolKi: 1.2,
    olanzapineKi: 11,
    role: "Mesolimbic antipsychotic efficacy vs striatal EPS & prolactin",
    clozapineClinicalPhenotype:
      "Low affinity / 'fast-off' dissociation. 30-60% striatal occupancy safely avoids EPS, tardive dyskinesia, and hyperprolactinemia.",
  },
  {
    key: "5HT2A",
    name: "Serotonin 5-HT2A",
    clozapineKi: 6.4,
    haloperidolKi: 78,
    olanzapineKi: 4,
    role: "Cortical dopamine disinhibition, negative symptom relief",
    clozapineClinicalPhenotype:
      "High affinity inverse agonism. 5-HT2A/D2 ratio > 1 promotes prefrontal dopamine release, improving cognitive and negative symptoms.",
  },
  {
    key: "5HT2C",
    name: "Serotonin 5-HT2C",
    clozapineKi: 9.2,
    haloperidolKi: 3000,
    olanzapineKi: 11,
    role: "Appetite regulation and satiety signaling in hypothalamus",
    clozapineClinicalPhenotype:
      "Potent inverse agonism triggers loss of satiety, carbohydrate craving, and severe metabolic weight gain.",
  },
  {
    key: "M1",
    name: "Muscarinic M1",
    clozapineKi: 1.9,
    haloperidolKi: 1500,
    olanzapineKi: 1.9,
    role: "Cognition, memory, cholinergic transmission, bowel peristalsis",
    clozapineClinicalPhenotype:
      "Parent clozapine is a potent antagonist (constipation/dry mouth); active metabolite Norclozapine is an M1 partial agonist (pro-cognitive).",
  },
  {
    key: "M4",
    name: "Muscarinic M4",
    clozapineKi: 18,
    haloperidolKi: 2000,
    olanzapineKi: 45,
    role: "Striatal cholinergic interneurons and salivation pathways",
    clozapineClinicalPhenotype:
      "Active metabolite Norclozapine is a potent partial agonist at M4, driving paradoxical nocturnal sialorrhea (hypersalivation).",
  },
  {
    key: "H1",
    name: "Histamine H1",
    clozapineKi: 1.1,
    haloperidolKi: 360,
    olanzapineKi: 7,
    role: "Arousal, alertness, hypothalamic energy expenditure",
    clozapineClinicalPhenotype:
      "Extreme H1 affinity (Ki 1.1 nM) causes heavy daytime sedation, prolonged sleep duration, and orexigenic weight gain.",
  },
  {
    key: "A1A",
    name: "Alpha-1A Adrenergic",
    clozapineKi: 1.6,
    haloperidolKi: 12,
    olanzapineKi: 19,
    role: "Vascular smooth muscle tone and peripheral arterial resistance",
    clozapineClinicalPhenotype:
      "Very high affinity blockade triggers peripheral vasodilation, postural orthostatic hypotension, syncope, and reflex tachycardia.",
  },
  {
    key: "A2A",
    name: "Alpha-2A Adrenergic",
    clozapineKi: 8.0,
    haloperidolKi: 640,
    olanzapineKi: 230,
    role: "Presynaptic norepinephrine autoreceptor inhibition",
    clozapineClinicalPhenotype:
      "Blocks presynaptic feedback inhibition, causing elevated circulating norepinephrine, resting sinus tachycardia, and salivation.",
  },
];

export const ReceptorArchitectureVisualizer: React.FC = () => {
  const [selectedReceptor, setSelectedReceptor] = useState<ReceptorPoint>(RECEPTORS[0]);
  const [comparisonDrug, setComparisonDrug] = useState<"none" | "haloperidol" | "olanzapine">("haloperidol");

  // Converts Ki to a 0-100 affinity scale for radar (lower Ki = higher affinity = closer to 100)
  // logarithmic mapping: score = max(0, min(100, 100 - (log10(Ki) * 25)))
  const getAffinityScore = (ki: number) => {
    const val = 100 - Math.log10(Math.max(0.1, ki)) * 26;
    return Math.max(5, Math.min(95, val));
  };

  const center = 160;
  const radius = 120;
  const count = RECEPTORS.length;

  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (radius * score) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const clozapinePath = RECEPTORS.map((r, i) => {
    const { x, y } = getCoordinates(i, getAffinityScore(r.clozapineKi));
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ") + " Z";

  const comparisonPath =
    comparisonDrug === "none"
      ? ""
      : RECEPTORS.map((r, i) => {
          const ki = comparisonDrug === "haloperidol" ? r.haloperidolKi : r.olanzapineKi;
          const { x, y } = getCoordinates(i, getAffinityScore(ki));
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ") + " Z";

  return (
    <div id="receptor-architecture-tool" className="bg-slate-900/90 border border-emerald-800/40 rounded-xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-950/70 text-emerald-300 rounded-lg border border-emerald-700/50">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-base">Receptor Binding Poly-Pharmacology Map</h4>
            <p className="text-xs text-slate-400">Ki Affinities, Fast-Off D2 Kinetics, and the Sialorrhea Paradox</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Overlay:</span>
          <select
            value={comparisonDrug}
            onChange={(e) => setComparisonDrug(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1"
          >
            <option value="none">Clozapine Alone</option>
            <option value="haloperidol">vs Haloperidol (Typical)</option>
            <option value="olanzapine">vs Olanzapine (Atypical)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar SVG */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-[320px] h-[320px]">
            <svg viewBox="0 0 320 320" className="w-full h-full">
              {/* Concentric rings */}
              {[25, 50, 75, 100].map((pct) => (
                <circle
                  key={pct}
                  cx={center}
                  cy={center}
                  r={(radius * pct) / 100}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={pct === 100 ? "none" : "3,3"}
                  opacity={0.6}
                />
              ))}

              {/* Axis rays */}
              {RECEPTORS.map((r, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={r.key}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Comparison drug polygon */}
              {comparisonDrug !== "none" && (
                <path
                  d={comparisonPath}
                  fill={comparisonDrug === "haloperidol" ? "rgba(59, 130, 246, 0.2)" : "rgba(245, 158, 11, 0.2)"}
                  stroke={comparisonDrug === "haloperidol" ? "#3b82f6" : "#f59e0b"}
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )}

              {/* Clozapine polygon */}
              <path
                d={clozapinePath}
                fill="rgba(16, 185, 129, 0.25)"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Interactive nodes */}
              {RECEPTORS.map((r, i) => {
                const { x, y } = getCoordinates(i, getAffinityScore(r.clozapineKi));
                const isSelected = selectedReceptor.key === r.key;
                return (
                  <g
                    key={r.key}
                    className="cursor-pointer"
                    onClick={() => setSelectedReceptor(r)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 4.5}
                      fill={isSelected ? "#34d399" : "#10b981"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* Outer labels */}
              {RECEPTORS.map((r, i) => {
                const { x, y } = getCoordinates(i, 118);
                const isSelected = selectedReceptor.key === r.key;
                return (
                  <text
                    key={r.key}
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    className={`text-[11px] font-mono cursor-pointer transition-colors ${
                      isSelected ? "fill-emerald-300 font-bold" : "fill-slate-400 hover:fill-slate-200"
                    }`}
                    onClick={() => setSelectedReceptor(r)}
                  >
                    {r.key}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Clozapine
            </span>
            {comparisonDrug !== "none" && (
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    comparisonDrug === "haloperidol" ? "bg-blue-500" : "bg-amber-500"
                  }`}
                />
                {comparisonDrug === "haloperidol" ? "Haloperidol" : "Olanzapine"}
              </span>
            )}
            <span className="text-[10px] text-slate-500">(Center = Low Affinity / Edge = High Affinity)</span>
          </div>
        </div>

        {/* Selected Receptor Details */}
        <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold tracking-wider">
                Receptor Micro-Architecture
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">{selectedReceptor.name}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Clozapine Ki</span>
              <span className="font-mono text-emerald-400 font-bold text-base">
                {selectedReceptor.clozapineKi} nM
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80 mb-3.5">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Physiological & Neural Circuit Role
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedReceptor.role}</p>
          </div>

          <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/50 mb-4">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Clozapine Clinical Phenotype
            </span>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {selectedReceptor.clozapineClinicalPhenotype}
            </p>
          </div>

          {/* Affinity comparison table */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-slate-800">
            <div className="p-2 bg-emerald-950/30 border border-emerald-800/40 rounded">
              <span className="text-[10px] text-slate-400 block">Clozapine Ki</span>
              <span className="font-bold text-emerald-400">{selectedReceptor.clozapineKi} nM</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-400 block">Haloperidol Ki</span>
              <span className="font-bold text-blue-400">{selectedReceptor.haloperidolKi} nM</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-400 block">Olanzapine Ki</span>
              <span className="font-bold text-amber-400">{selectedReceptor.olanzapineKi} nM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

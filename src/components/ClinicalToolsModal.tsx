// ClinicalToolsModal.tsx
// Interactive bedside clinical calculators and pharmacometric simulation tools
// accessible directly within the 3D Mind Palace.

import React, { useState } from "react";
import {
  ANCTriageCalculator,
  CYP1A2Simulator,
  MissedDoseResetCalculator,
} from "./InteractiveTools";
import {
  X,
  Stethoscope,
  Activity,
  Flame,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface ClinicalToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "anc" | "cyp" | "titration";
}

export const ClinicalToolsModal: React.FC<ClinicalToolsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "anc",
}) => {
  const [activeTab, setActiveTab] = useState<"anc" | "cyp" | "titration">(
    defaultTab
  );

  if (!isOpen) return null;

  return (
    <div
      id="clinical-tools-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="clinical-tools-modal-container"
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Bedside Clinical Calculators & Simulators
              </h2>
              <p className="text-xs text-slate-400">
                Evidence-based decision support, REMS triage, and CYP1A2 pharmacometrics
              </p>
            </div>
          </div>

          <button
            id="close-clinical-tools-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-2 overflow-x-auto">
          <button
            id="tab-anc-triage-btn"
            onClick={() => setActiveTab("anc")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === "anc"
                ? "border-teal-400 text-teal-300 bg-teal-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4 text-teal-400" />
            <span>ANC Triage & REMS Gate</span>
          </button>

          <button
            id="tab-cyp1a2-simulator-btn"
            onClick={() => setActiveTab("cyp")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === "cyp"
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4 text-cyan-400" />
            <span>CYP1A2 & Smoking Simulator</span>
          </button>

          <button
            id="tab-missed-dose-btn"
            onClick={() => setActiveTab("titration")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === "titration"
                ? "border-purple-400 text-purple-300 bg-purple-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>48-Hour Missed Dose Reset</span>
          </button>
        </div>

        {/* Active Tool Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "anc" && <ANCTriageCalculator />}
          {activeTab === "cyp" && <CYP1A2Simulator />}
          {activeTab === "titration" && <MissedDoseResetCalculator />}
        </div>
      </div>
    </div>
  );
};

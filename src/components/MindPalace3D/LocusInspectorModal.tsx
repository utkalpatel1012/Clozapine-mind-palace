// LocusInspectorModal.tsx
// Rich modal that opens when a player walks up to a 3D locus station and inspects it.

import React from "react";
import { MnemonicLocus, PalaceRoom } from "../../types";
import {
  Sparkles,
  Brain,
  Stethoscope,
  BookOpen,
  X,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface LocusInspectorModalProps {
  locus: MnemonicLocus;
  room: PalaceRoom;
  onClose: () => void;
  onAskCurator: (question: string) => void;
}

export const LocusInspectorModal: React.FC<LocusInspectorModalProps> = ({
  locus,
  room,
  onClose,
  onAskCurator,
}) => {
  return (
    <div
      id="locus-inspector-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="locus-inspector-card"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ borderColor: room.themeColor.accentHex }}
      >
        {/* Header with Room Badge & Close Button */}
        <div className="relative p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border"
                style={{
                  color: room.themeColor.accentHex,
                  borderColor: `${room.themeColor.accentHex}66`,
                  backgroundColor: `${room.themeColor.accentHex}15`,
                }}
              >
                {room.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {locus.categoryTag}
              </span>
            </div>

            <button
              id="close-locus-inspector-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close [Esc]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="mt-3 text-2xl font-serif font-bold text-white tracking-wide">
            {locus.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: room.themeColor.accentHex }} />
            <span>3D Spatial Station: <strong>{locus.spatialSpot}</strong></span>
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* 1. Mnemonic Hook Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Brain className="w-4 h-4" />
              <span>Memory Palace Mnemonic Anchor</span>
            </div>
            <p className="text-amber-100 font-serif text-base italic leading-relaxed">
              "{locus.memoryHook}"
            </p>
            <div className="mt-2 text-xs text-amber-300/80 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Anchor: {locus.objectVisual}</span>
            </div>
          </div>

          {/* 2. Scientific Fact & Neurobiological Mechanism */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Pharmacological & Evidence-Based Fact</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {locus.scientificFact}
            </p>
          </div>

          {/* 3. Bedside Clinical Action */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Stethoscope className="w-4 h-4" />
              <span>Bedside Clinical Protocol</span>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">
              {locus.clinicalAction}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            id="ask-curator-about-locus-btn"
            onClick={() => {
              onClose();
              onAskCurator(
                `Can you explain the clinical significance and evidence behind '${locus.name}' from ${room.name}? Specifically: ${locus.scientificFact}`
              );
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-sm font-medium border border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Ask Curator AI about this Station</span>
          </button>

          <button
            id="locus-continue-walking-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-md hover:shadow-amber-500/20"
          >
            <span>Resume Walking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

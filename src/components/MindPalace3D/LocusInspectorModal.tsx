// LocusInspectorModal.tsx
// Rich modal that opens when a player walks up to a 3D locus station and inspects it.

import React, { useState } from "react";
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
  Volume2,
  VolumeX,
  Mic,
} from "lucide-react";
import { palaceAudio } from "../../utils/palaceAudio";

interface LocusInspectorModalProps {
  locus: MnemonicLocus;
  room: PalaceRoom;
  onClose: () => void;
  onAskCurator: (question: string) => void;
  onOpenVoiceTopic?: (topic: {
    title: string;
    category: string;
    context: string;
    suggestedQuestions: string[];
  }) => void;
}

export const LocusInspectorModal: React.FC<LocusInspectorModalProps> = ({
  locus,
  room,
  onClose,
  onAskCurator,
  onOpenVoiceTopic,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (isSpeaking) {
      palaceAudio.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const speechText = `Station: ${locus.name}. Memory anchor: ${locus.memoryHook}. Evidence: ${locus.scientificFact}. Clinical Protocol: ${locus.clinicalAction}`;
      palaceAudio.speak(speechText, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleVoiceAsk = () => {
    palaceAudio.stopSpeaking();
    setIsSpeaking(false);
    if (onOpenVoiceTopic) {
      onClose();
      onOpenVoiceTopic({
        title: locus.name,
        category: `${room.name} • ${locus.categoryTag}`,
        context: `Memory Hook: ${locus.memoryHook}\nScientific Fact: ${locus.scientificFact}\nBedside Protocol: ${locus.clinicalAction}`,
        suggestedQuestions: [
          `What are the clinical pearls for ${locus.name}?`,
          `How do I manage this adverse effect in practice?`,
          `What is the underlying receptor mechanism?`,
        ],
      });
    }
  };

  const handleClose = () => {
    palaceAudio.stopSpeaking();
    setIsSpeaking(false);
    onClose();
  };

  return (
    <div
      id="locus-inspector-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="locus-inspector-card"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ borderColor: room.themeColor.accentHex }}
      >
        {/* Header with Room Badge & Action Controls */}
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

            <div className="flex items-center space-x-2">
              <button
                id="locus-voice-read-btn"
                onClick={toggleSpeech}
                className={`p-2 rounded-lg text-xs font-medium border flex items-center space-x-1 transition-colors ${
                  isSpeaking
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                }`}
                title={isSpeaking ? "Stop Voice Narration" : "Read Station Aloud"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Audio"}</span>
              </button>

              <button
                id="close-locus-inspector-btn"
                onClick={handleClose}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close [Esc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              &ldquo;{locus.memoryHook}&rdquo;
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
              <span>Pharmacological &amp; Evidence-Based Fact</span>
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
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onOpenVoiceTopic && (
              <button
                id="voice-ask-from-inspector-btn"
                onClick={handleVoiceAsk}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Voice Ask Topic</span>
              </button>
            )}

            <button
              id="ask-curator-about-locus-btn"
              onClick={() => {
                handleClose();
                onAskCurator(
                  `Can you explain the clinical significance and evidence behind '${locus.name}' from ${room.name}? Specifically: ${locus.scientificFact}`
                );
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Text Curator AI</span>
            </button>
          </div>

          <button
            id="locus-continue-walking-btn"
            onClick={handleClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-md"
          >
            <span>Resume Walking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

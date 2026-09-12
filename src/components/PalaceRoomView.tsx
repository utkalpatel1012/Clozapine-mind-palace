import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  MapPin,
  Eye,
} from "lucide-react";
import { PalaceRoom, PalaceRoomId, MnemonicLocus } from "../types";
import { PALACE_ROOMS } from "../data/clozapineData";
import { palaceAudio } from "../utils/palaceAudio";
import { ANCTriageCalculator, CYP1A2Simulator, MissedDoseResetCalculator } from "./InteractiveTools";
import { ReceptorArchitectureVisualizer } from "./ReceptorArchitecture";

interface PalaceRoomViewProps {
  room: PalaceRoom;
  onBackToLobby: () => void;
  onNavigateRoom: (roomId: PalaceRoomId) => void;
  onOpenReferenceLibrary: (filterCategory?: string) => void;
  onAskCuratorAboutTopic: (prompt: string) => void;
}

export const PalaceRoomView: React.FC<PalaceRoomViewProps> = ({
  room,
  onBackToLobby,
  onNavigateRoom,
  onOpenReferenceLibrary,
  onAskCuratorAboutTopic,
}) => {
  const [selectedLocus, setSelectedLocus] = useState<MnemonicLocus>(room.spatialLoci[0] || null);
  const [expandedSubtopicIndex, setExpandedSubtopicIndex] = useState<number | null>(0);

  const currentIndex = PALACE_ROOMS.findIndex((r) => r.id === room.id);
  const prevRoom = currentIndex > 0 ? PALACE_ROOMS[currentIndex - 1] : null;
  const nextRoom = currentIndex < PALACE_ROOMS.length - 1 ? PALACE_ROOMS[currentIndex + 1] : null;

  const handleSelectLocus = (locus: MnemonicLocus) => {
    palaceAudio.playLocusInspect();
    setSelectedLocus(locus);
  };

  return (
    <div id={`room-view-${room.id}`} className="min-h-screen bg-[#07090e] text-slate-100 pb-24">
      {/* Top Accent Gradient Bar */}
      <div className={`h-2.5 w-full bg-gradient-to-r ${room.themeColor.bgGradient}`} />

      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-30 bg-[#07090e]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            id="room-back-btn"
            type="button"
            onClick={onBackToLobby}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to 3D Mind Palace</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border uppercase font-semibold ${room.themeColor.badge}`}
            >
              {room.doorLabel}
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono ml-2">
              Wing {currentIndex + 1} of {PALACE_ROOMS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {prevRoom && (
              <button
                type="button"
                onClick={() => {
                  palaceAudio.playDoorOpen();
                  onNavigateRoom(prevRoom.id);
                }}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
                title={`Previous Wing: ${prevRoom.name}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {nextRoom && (
              <button
                type="button"
                onClick={() => {
                  palaceAudio.playDoorOpen();
                  onNavigateRoom(nextRoom.id);
                }}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
                title={`Next Wing: ${nextRoom.name}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Room Architectural Profile Hero */}
        <div className="relative mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              <span>Chamber Atmosphere</span>
              <span>•</span>
              <span className="text-slate-400">{room.roomArchetype}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-100 font-['Cinzel']">
              {room.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-medium mt-1">{room.subtitle}</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4 font-light">
              {room.architecturalAtmosphere}
            </p>
          </div>

          {/* Key Clinical Metrics */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {room.keyMetrics.map((metric, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{metric.label}</span>
                <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">{metric.value}</div>
                <span className="text-[11px] text-slate-400 mt-1 block line-clamp-1">{metric.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Spatial Mnemonic Loci Stations */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xl font-serif font-bold text-slate-100 font-['Cinzel']">
                  Spatial Loci Mnemonic Stations
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any locus station in the room to inspect its sensory memory hook and clinical fact
              </p>
            </div>
            <span className="text-xs text-amber-300 font-mono">
              {room.spatialLoci.length} Memorization Anchors
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Loci Navigation Stations List */}
            <div className="lg:col-span-4 space-y-3">
              {room.spatialLoci.map((locus, index) => {
                const isSelected = selectedLocus?.id === locus.id;
                return (
                  <div
                    key={locus.id}
                    id={`locus-card-${locus.id}`}
                    onClick={() => handleSelectLocus(locus)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg"
                        : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Station {index + 1} • {locus.categoryTag}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                    </div>
                    <h3 className="font-bold text-sm text-slate-100 mb-1">{locus.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{locus.memoryHook}</p>
                  </div>
                );
              })}
            </div>

            {/* Focused Locus Chamber */}
            {selectedLocus && (
              <div className="lg:col-span-8 bg-slate-900/90 border border-amber-900/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Spatial Spot: {selectedLocus.spatialSpot}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                        {selectedLocus.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onAskCuratorAboutTopic(
                          `Explain the clozapine concept represented by: "${selectedLocus.name}". Locus hook: "${selectedLocus.memoryHook}". Deepen my understanding with clinical nuances.`
                        )
                      }
                      className="px-3 py-1.5 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60 rounded-lg text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ask Curator About This Locus</span>
                    </button>
                  </div>

                  {/* Object Visual In Mind Palace */}
                  <div className="mb-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                    <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                        Palace Object & Visual Artifact
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">{selectedLocus.objectVisual}</p>
                    </div>
                  </div>

                  {/* Sensory Memory Hook */}
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 mb-5">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                      Mnemonic Memory Hook
                    </span>
                    <p className="text-xs sm:text-sm text-amber-100/90 italic leading-relaxed">
                      "{selectedLocus.memoryHook}"
                    </p>
                  </div>

                  {/* Scientific Fact */}
                  <div className="mb-5">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Scientific & Pharmacological Reality
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedLocus.scientificFact}
                    </p>
                  </div>

                  {/* Clinical Action */}
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                    <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Clinical Action & Bedside Practice
                    </span>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      {selectedLocus.clinicalAction}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
                  <span>Palace Zone: {selectedLocus.categoryTag}</span>
                  <button
                    type="button"
                    onClick={() => onOpenReferenceLibrary()}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Room Literature</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Interactive Diagnostic & Pharmacokinetic Simulators */}
        <div className="mb-12">
          {room.id === "indications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <h3 className="text-lg font-serif font-bold text-slate-100 font-['Cinzel']">
                  Clinical Triage Simulator (REMS & Absolute Neutrophil Count)
                </h3>
              </div>
              <ANCTriageCalculator />
            </div>
          )}

          {room.id === "pharmacodynamics" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-lg font-serif font-bold text-slate-100 font-['Cinzel']">
                  Receptor Binding Poly-Pharmacology Map & Ki Radar
                </h3>
              </div>
              <ReceptorArchitectureVisualizer />
            </div>
          )}

          {room.id === "pharmacokinetics" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <h3 className="text-lg font-serif font-bold text-slate-100 font-['Cinzel']">
                  CYP1A2 Pharmacokinetic Clearance & Drug Interaction Simulator
                </h3>
              </div>
              <CYP1A2Simulator />
            </div>
          )}

          {(room.id === "blackbox" || room.id === "hematology") && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <h3 className="text-lg font-serif font-bold text-slate-100 font-['Cinzel']">
                  Severe Toxicity & ANC Triage Decision Protocol
                </h3>
              </div>
              <ANCTriageCalculator />
            </div>
          )}

          {room.id === "titration" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <h3 className="text-lg font-serif font-bold text-slate-100 font-['Cinzel']">
                  The 48-Hour Missed Dose Re-titration Engine
                </h3>
              </div>
              <MissedDoseResetCalculator />
            </div>
          )}
        </div>

        {/* Section 3: Subtopic In-Depth Analysis */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xl font-serif font-bold text-slate-100 font-['Cinzel']">
                  Subtopics & In-Depth Clinical Evidence
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exhaustive evidence synthesis, guideline recommendations, and clinical pearls
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {room.subtopics.length} Documented Subtopics
            </span>
          </div>

          <div className="space-y-4">
            {room.subtopics.map((subtopic, index) => {
              const isOpen = expandedSubtopicIndex === index;

              return (
                <div
                  key={index}
                  id={`subtopic-${index}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSubtopicIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-semibold">
                        § Subtopic {index + 1}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">{subtopic.title}</h4>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950 text-slate-400 shrink-0 ml-3">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4">
                      {subtopic.clinicalWarning && (
                        <div className="p-3.5 bg-red-950/40 border border-red-700/50 rounded-lg flex items-start gap-2.5 text-xs text-red-200">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-red-300">Clinical Warning: </span>
                            {subtopic.clinicalWarning}
                          </div>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {subtopic.content}
                      </p>

                      <div>
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                          Key Practice Principles
                        </span>
                        <div className="space-y-1.5">
                          {subtopic.keyPoints.map((pt, ptIdx) => (
                            <div key={ptIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Clinical Pearls For The Room */}
        {room.clinicalPearls && room.clinicalPearls.length > 0 && (
          <div className="mb-12 p-6 rounded-2xl bg-amber-950/20 border border-amber-800/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif font-bold text-amber-200 text-base font-['Cinzel']">
                Chamber Clinical Pearls & High-Yield Truths
              </h3>
            </div>
            <div className="space-y-2">
              {room.clinicalPearls.map((pearl, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-100/90">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{pearl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Wing Navigation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <button
            type="button"
            onClick={onBackToLobby}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to Grand Rotunda</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {nextRoom ? (
              <button
                type="button"
                onClick={() => {
                  palaceAudio.playDoorOpen();
                  onNavigateRoom(nextRoom.id);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
              >
                <span>Enter Wing {currentIndex + 2}: {nextRoom.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onBackToLobby}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Palace Exploration Complete • Return to Rotunda</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

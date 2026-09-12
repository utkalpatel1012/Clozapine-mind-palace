import React, { useState } from "react";
import {
  Hourglass,
  ShieldAlert,
  Atom,
  FlaskConical,
  Skull,
  ShieldCheck,
  Sliders,
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  Volume2,
  VolumeX,
  Search,
  CheckCircle,
} from "lucide-react";
import { PalaceRoom, PalaceRoomId } from "../types";
import { PALACE_ROOMS } from "../data/clozapineData";
import { palaceAudio } from "../utils/palaceAudio";

interface PalaceLobbyProps {
  onEnterRoom: (roomId: PalaceRoomId) => void;
  visitedRooms: Set<PalaceRoomId>;
  onOpenReferenceLibrary: () => void;
  onOpenChat: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Hourglass: <Hourglass className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  Atom: <Atom className="w-6 h-6" />,
  FlaskConical: <FlaskConical className="w-6 h-6" />,
  Skull: <Skull className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Sliders: <Sliders className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
};

export const PalaceLobby: React.FC<PalaceLobbyProps> = ({
  onEnterRoom,
  visitedRooms,
  onOpenReferenceLibrary,
  onOpenChat,
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<PalaceRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(palaceAudio.getMuted());
  const [ambientActive, setAmbientActive] = useState(false);

  const filteredRooms = PALACE_ROOMS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.spatialLoci.some(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.memoryHook.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleToggleSound = () => {
    const muted = palaceAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleToggleAmbient = () => {
    const active = palaceAudio.toggleAmbient();
    setAmbientActive(active);
  };

  const handleDoorClick = (roomId: PalaceRoomId) => {
    palaceAudio.playDoorOpen();
    onEnterRoom(roomId);
  };

  return (
    <div id="palace-grand-lobby" className="relative min-h-screen bg-[#07090e] text-slate-100 overflow-hidden">
      {/* Classical Palace Ceiling / Skylight Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(217,119,6,0.06),transparent_60%)] pointer-events-none" />

      {/* Subtle Checkered Marble Floor Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #07090e 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Top Architectural Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                The Method of Loci • Clinical Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {visitedRooms.size} / {PALACE_ROOMS.length} Wings Explored
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-slate-100 mt-2 font-['Cinzel']">
              The Clozapine Mind Palace
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1.5 font-light">
              Step through the majestic arched doors of the central rotunda to internalize master-level clinical
              pharmacology, receptor kinetics, 5 black box warnings, and 2024–2026 breakthroughs.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="lobby-ambient-audio-btn"
              type="button"
              onClick={handleToggleAmbient}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                ambientActive
                  ? "bg-amber-950/60 border-amber-500/80 text-amber-200"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
              title="Toggle ambient study palace drone"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{ambientActive ? "Palace Drone: ON" : "Ambient Drone"}</span>
            </button>

            <button
              id="lobby-mute-btn"
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              title={isAudioMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              id="lobby-ref-btn"
              type="button"
              onClick={onOpenReferenceLibrary}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Literature Library</span>
            </button>

            <button
              id="lobby-curator-chat-btn"
              type="button"
              onClick={onOpenChat}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-950/40 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult Curator AI</span>
            </button>
          </div>
        </header>

        {/* Central Pedestal / Molecular Compass */}
        <div className="relative mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                <span>The Grand Rotunda Pedestal</span>
                <span>•</span>
                <span>Dibenzodiazepine Tricyclic Scaffold</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 font-['Cinzel']">
                Spatial Mnemonic Navigation System
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 max-w-3xl">
                Each chamber ahead houses vivid sensory <strong>Loci Objects</strong> anchoring intricate pharmacology
                into permanent memory: from the 70% CYP1A2 Hepatic Furnace to the 1500 White Shield Wall. Walk freely
                between doors or filter topics below.
              </p>

              {/* Search filter bar */}
              <div className="mt-5 relative max-w-lg">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="lobby-search-input"
                  type="text"
                  placeholder="Search rooms, loci (e.g. 'CYP1A2', 'REMS', 'Sialorrhea', 'Ileus', 'Kane 1988')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Molecular Badge / Landmark Quick Stats */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-amber-900/30 rounded-xl p-4 sm:p-5">
              <div className="text-xs font-mono text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Core Pharmacophore</span>
                <span className="text-[10px] text-slate-400">MW: 326.82 g/mol</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Chemical Class:</span>
                  <span className="text-slate-200">Dibenzodiazepine</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Target Level:</span>
                  <span className="text-emerald-400 font-bold">350 - 600 ng/mL</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Primary Enzyme:</span>
                  <span className="text-cyan-400 font-bold">CYP1A2 (~70%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Baseline ANC:</span>
                  <span className="text-amber-300 font-bold">≥ 1,500 /uL (Gen)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 9 Grand Palace Doors Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-serif font-bold text-slate-200 font-['Cinzel'] flex items-center gap-2">
              <span>The Arched Portals of the Rotunda</span>
              <span className="text-xs font-sans text-slate-500 font-normal">
                ({filteredRooms.length} Available Portals)
              </span>
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click any portal to cross the threshold
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
              const isVisited = visitedRooms.has(room.id);
              const isHovered = hoveredRoom?.id === room.id;

              return (
                <div
                  key={room.id}
                  id={`palace-door-${room.id}`}
                  onMouseEnter={() => {
                    setHoveredRoom(room);
                    palaceAudio.playFootstep();
                  }}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={() => handleDoorClick(room.id)}
                  className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between p-6 ${
                    isHovered
                      ? `${room.themeColor.border} bg-gradient-to-b ${room.themeColor.bgGradient} shadow-2xl scale-[1.01]`
                      : "border-slate-800/90 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  {/* Top Door Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md border uppercase tracking-wider font-semibold ${room.themeColor.badge}`}
                      >
                        {room.doorLabel}
                      </span>
                      {isVisited && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" />
                          Explored
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mt-3">
                      <div
                        className={`p-3 rounded-xl border transition-all ${
                          isHovered
                            ? "bg-slate-900 text-white shadow-lg"
                            : "bg-slate-950/80 border-slate-800 text-slate-300"
                        }`}
                      >
                        {ICON_MAP[room.icon] || <Compass className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                          {room.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{room.subtitle}</p>
                      </div>
                    </div>

                    {/* Mnemonic Loci count badge */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                        {room.spatialLoci.length} Mnemonic Anchors Inside:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {room.spatialLoci.slice(0, 3).map((locus) => (
                          <span
                            key={locus.id}
                            className="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full"
                          >
                            {locus.name.split(":")[0].replace("The ", "")}
                          </span>
                        ))}
                        {room.spatialLoci.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-mono self-center">
                            +{room.spatialLoci.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Door Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {room.subtopics.length} Sections • {room.keyMetrics.length} Clinical Metrics
                    </span>
                    <span className="font-semibold flex items-center gap-1 text-slate-200 group-hover:translate-x-1 transition-transform">
                      <span>Enter Wing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Palace Grounding / Reference Gateway */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700/50 text-cyan-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-100 text-base font-['Cinzel']">
                Comprehensive Scientific Bibliography
              </h4>
              <p className="text-xs text-slate-400 max-w-xl">
                Every mnemonic anchor and clinical recommendation in this palace is cross-referenced against landmark
                RCTs, systematic reviews, FDA prescribing communications, and peer-reviewed journals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenReferenceLibrary}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Open Reference Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

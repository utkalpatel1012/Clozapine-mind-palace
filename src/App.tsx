import React, { useState, useEffect } from "react";
import { PalaceRoomId } from "./types";
import { PALACE_ROOMS } from "./data/clozapineData";
import { MindPalaceGame } from "./components/MindPalace3D/MindPalaceGame";
import { PalaceRoomView } from "./components/PalaceRoomView";
import { ReferenceLibrary } from "./components/ReferenceLibrary";
import { CuratorChat } from "./components/CuratorChat";
import { ClinicalToolsModal } from "./components/ClinicalToolsModal";

export default function App() {
  // Mode: "3d_game" is the primary default experience
  const [viewMode, setViewMode] = useState<"3d_game" | "2d_dossier">("3d_game");
  const [activeRoomId, setActiveRoomId] = useState<PalaceRoomId | null>(null);

  const [visitedRooms, setVisitedRooms] = useState<Set<PalaceRoomId>>(() => {
    try {
      const saved = localStorage.getItem("clozapine_palace_visited");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Modals state
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [referenceCategory, setReferenceCategory] = useState<string>("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>("");
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        "clozapine_palace_visited",
        JSON.stringify(Array.from(visitedRooms))
      );
    } catch (e) {
      console.warn("Local storage write error", e);
    }
  }, [visitedRooms]);

  const handleEnterRoom = (roomId: PalaceRoomId) => {
    setActiveRoomId(roomId);
    setVisitedRooms((prev) => new Set([...prev, roomId]));
  };

  const handleOpenReferenceLibrary = (category: string = "all") => {
    setReferenceCategory(category);
    setIsReferenceOpen(true);
  };

  const handleAskCurator = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const activeRoom = activeRoomId
    ? PALACE_ROOMS.find((r) => r.id === activeRoomId)
    : null;

  return (
    <div className="relative w-full min-h-screen bg-[#06080e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden">
      {/* 3D Game is the Primary Experience */}
      {viewMode === "3d_game" ? (
        <MindPalaceGame
          initialRoomId={activeRoomId}
          onOpenCurator={() => {
            setChatInitialPrompt("");
            setIsChatOpen(true);
          }}
          onOpenReferences={() => handleOpenReferenceLibrary("all")}
          onOpenTools={() => setIsToolsOpen(true)}
          onSelectLocusForCurator={handleAskCurator}
          onOpenDossier={(roomId) => {
            setActiveRoomId(roomId);
            setViewMode("2d_dossier");
          }}
        />
      ) : (
        /* 2D Dossier / Reading Mode if user explicitly chooses reading view */
        activeRoom && (
          <PalaceRoomView
            room={activeRoom}
            onBackToLobby={() => {
              setViewMode("3d_game");
              setActiveRoomId(null);
            }}
            onNavigateRoom={(roomId) => handleEnterRoom(roomId)}
            onOpenReferenceLibrary={handleOpenReferenceLibrary}
            onAskCuratorAboutTopic={handleAskCurator}
          />
        )
      )}

      {/* Literature Library Modal */}
      <ReferenceLibrary
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
        initialCategory={referenceCategory}
      />

      {/* Curator AI Chat Modal */}
      <CuratorChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialPrompt={chatInitialPrompt}
      />

      {/* Clinical Calculators & Decision Tools Modal */}
      <ClinicalToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
      />
    </div>
  );
}


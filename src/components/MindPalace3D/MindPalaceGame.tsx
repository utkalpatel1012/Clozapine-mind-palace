// MindPalaceGame.tsx
// The complete 3D interactive video game mind palace experience for Clozapine.
// Features 3rd-person/1st-person character control, actual doors to walk through,
// 9 custom architectural chambers, spatial loci inspection, minimap radar, and touch controls.

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PalaceSceneManager, DoorObject, LocusObject } from "./PalaceSceneManager";
import { PalaceRoom, PalaceRoomId, MnemonicLocus } from "../../types";
import { PALACE_ROOMS } from "../../data/clozapineData";
import { LocusInspectorModal } from "./LocusInspectorModal";
import { VoiceTopicInteractionModal, VoiceTopic } from "./VoiceTopicInteractionModal";
import {
  Compass,
  Eye,
  Volume2,
  VolumeX,
  MessageSquare,
  BookOpen,
  DoorOpen,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Stethoscope,
  ChevronDown,
  Navigation,
  Mic,
  Radio,
  Minus,
  Maximize2,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { palaceAudio } from "../../utils/palaceAudio";

interface MindPalaceGameProps {
  onOpenCurator: () => void;
  onOpenReferences: () => void;
  onOpenTools: () => void;
  onSelectLocusForCurator: (prompt: string) => void;
  onOpenDossier?: (roomId: PalaceRoomId) => void;
  initialRoomId?: PalaceRoomId | null;
}

const CLINICAL_TIERS = [
  {
    tierNumber: 1,
    title: "Foundations & Pharmacology",
    badge: "Chambers 1–3",
    color: "#f59e0b",
    rooms: PALACE_ROOMS.slice(0, 3),
  },
  {
    tierNumber: 2,
    title: "Safety, REMS & Toxicity",
    badge: "Chambers 4–6",
    color: "#ef4444",
    rooms: PALACE_ROOMS.slice(3, 6),
  },
  {
    tierNumber: 3,
    title: "Mastery, Guidelines & Horizons",
    badge: "Chambers 7–9",
    color: "#8b5cf6",
    rooms: PALACE_ROOMS.slice(6, 9),
  },
];

export const MindPalaceGame: React.FC<MindPalaceGameProps> = ({
  onOpenCurator,
  onOpenReferences,
  onOpenTools,
  onSelectLocusForCurator,
  onOpenDossier,
  initialRoomId = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<PalaceSceneManager | null>(null);

  // UI state synchronized with 3D engine
  const [currentMode, setCurrentMode] = useState<"rotunda" | "room">("rotunda");
  const [activeRoomId, setActiveRoomId] = useState<PalaceRoomId | null>(initialRoomId);
  const [activeRoom, setActiveRoom] = useState<PalaceRoom | null>(null);

  // Proximity alerts
  const [promptDoor, setPromptDoor] = useState<DoorObject | null>(null);
  const [promptLocus, setPromptLocus] = useState<LocusObject | null>(null);
  const [isNearExit, setIsNearExit] = useState<boolean>(false);

  // Active inspected locus modal
  const [inspectedLocus, setInspectedLocus] = useState<MnemonicLocus | null>(null);

  // Voice Topic Interaction Modal state
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceTopic, setVoiceTopic] = useState<VoiceTopic | null>(null);

  // Settings & HUD toggles
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [showControlsGuide, setShowControlsGuide] = useState(true);

  // Audio Guide & Voice narration state
  const [audioGuideActive, setAudioGuideActive] = useState(true);
  const [isSpeakingTopic, setIsSpeakingTopic] = useState(false);
  const lastAnnouncedTopicIdRef = useRef<string | null>(null);
  const audioGuideActiveRef = useRef(audioGuideActive);
  const audioEnabledRef = useRef(audioEnabled);

  // Visited loci stations tracker
  const [visitedLociIds, setVisitedLociIds] = useState<Record<string, boolean>>({});

  // D-Pad minimization toggle
  const [isControlsMinimized, setIsControlsMinimized] = useState(false);

  useEffect(() => {
    audioGuideActiveRef.current = audioGuideActive;
  }, [audioGuideActive]);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  // Minimap radar state
  const [playerCoord, setPlayerCoord] = useState<{ x: number; z: number; rotation: number }>({
    x: 0,
    z: 4,
    rotation: 0,
  });

  // Joystick state for mobile
  const [touchActive, setTouchActive] = useState(false);
  const joystickStartRef = useRef<{ x: number; y: number } | null>(null);

  // Mouse Drag Look tracking
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const playFootstep = useCallback(() => {
    if (audioEnabled) {
      palaceAudio.playFootstep();
    }
  }, [audioEnabled]);

  const playChime = useCallback(() => {
    if (audioEnabled) {
      palaceAudio.playDoorChime();
    }
  }, [audioEnabled]);

  // Trigger Voice Interaction modal for active or nearest topic
  const handleTriggerVoiceModal = useCallback(
    (customTopic?: VoiceTopic) => {
      if (customTopic) {
        setVoiceTopic(customTopic);
        setVoiceModalOpen(true);
        return;
      }

      if (managerRef.current?.nearestLocus) {
        const loc = managerRef.current.nearestLocus.locus;
        setVoiceTopic({
          title: loc.name,
          category: activeRoom ? `${activeRoom.name} • Station` : "Chamber Station",
          context: `Memory Anchor: ${loc.memoryHook}\nPharmacological Mechanism: ${loc.pharmacologyFact}\nHigh-Yield Pearl: ${loc.highYieldFact}\nClinical Action Protocol: ${loc.clinicalAction}`,
          suggestedQuestions: [
            `What are the high-yield exam pearls for ${loc.name}?`,
            `How should I manage this adverse effect in clinical practice?`,
            `What receptor mechanism explains this finding?`,
          ],
        });
        setVoiceModalOpen(true);
      } else if (managerRef.current?.nearestDoor) {
        const door = managerRef.current.nearestDoor;
        const room = PALACE_ROOMS.find((r) => r.id === door.roomId);
        if (room) {
          setVoiceTopic({
            title: `Door ${door.doorNumber}: ${room.name}`,
            category: "Palace Chamber Entrance",
            context: `Subtitle: ${room.subtitle}\nAtmosphere: ${room.architecturalAtmosphere}\nClinical Pearls: ${room.clinicalPearls.slice(0, 3).join("; ")}`,
            suggestedQuestions: [
              `What are the core concepts covered in ${room.name}?`,
              `What clinical guidelines apply to this topic?`,
              `What are the classic board exam questions on this topic?`,
            ],
          });
          setVoiceModalOpen(true);
        }
      } else if (activeRoom) {
        setVoiceTopic({
          title: activeRoom.name,
          category: "Active Chamber",
          context: `Subtitle: ${activeRoom.subtitle}\nAtmosphere: ${activeRoom.architecturalAtmosphere}\nClinical Pearls: ${activeRoom.clinicalPearls.slice(0, 3).join("; ")}`,
          suggestedQuestions: [
            `Summarize the key takeaways of ${activeRoom.name}`,
            `What are the most critical safety protocols for this chamber?`,
            `What are common clinical pitfalls and traps?`,
          ],
        });
        setVoiceModalOpen(true);
      } else {
        setVoiceTopic({
          title: "Grand Rotunda (Palace Hub)",
          category: "Mind Palace Central Hub",
          context: "The Grand Rotunda provides access to all 9 specialized pharmacological and clinical chambers of Clozapine, from historical discoveries to receptor affinities, toxicity management, and modern guidelines.",
          suggestedQuestions: [
            "Which chamber should I visit first for Clozapine basics?",
            "What are the 5 Black Box warnings of Clozapine?",
            "Explain the February 2025 FDA REMS elimination update.",
          ],
        });
        setVoiceModalOpen(true);
      }
    },
    [activeRoom]
  );

  // Toggle voice narration for current nearest topic
  const handleToggleTopicAudio = useCallback(() => {
    if (isSpeakingTopic) {
      palaceAudio.stopSpeaking();
      setIsSpeakingTopic(false);
      return;
    }

    if (managerRef.current?.nearestLocus) {
      const loc = managerRef.current.nearestLocus.locus;
      const speechText = `Station: ${loc.name}. Memory anchor: ${loc.memoryHook}. Evidence: ${loc.scientificFact}. Protocol: ${loc.clinicalAction}`;
      palaceAudio.speak(speechText, {
        onStart: () => setIsSpeakingTopic(true),
        onEnd: () => setIsSpeakingTopic(false),
        onError: () => setIsSpeakingTopic(false),
      });
    } else if (managerRef.current?.nearestDoor) {
      const door = managerRef.current.nearestDoor;
      const room = PALACE_ROOMS.find((r) => r.id === door.roomId);
      if (room) {
        const pearl = room.clinicalPearls[0] || room.architecturalAtmosphere;
        const speechText = `Door ${door.doorNumber}: ${room.name}. ${room.subtitle}. Clinical pearl: ${pearl}`;
        palaceAudio.speak(speechText, {
          onStart: () => setIsSpeakingTopic(true),
          onEnd: () => setIsSpeakingTopic(false),
          onError: () => setIsSpeakingTopic(false),
        });
      }
    }
  }, [isSpeakingTopic]);

  // Handle entering a room from 3D doorway
  const handleEnterRoom = useCallback(
    (roomId: PalaceRoomId) => {
      const room = PALACE_ROOMS.find((r) => r.id === roomId);
      if (!room || !managerRef.current) return;

      playChime();
      managerRef.current.buildRoomChamber(roomId);
      setCurrentMode("room");
      setActiveRoomId(roomId);
      setActiveRoom(room);
      setPromptDoor(null);
      setPromptLocus(null);
    },
    [playChime]
  );

  // Handle returning to Grand Rotunda from 3D exit doorway
  const handleReturnRotunda = useCallback(() => {
    if (!managerRef.current) return;

    playChime();
    managerRef.current.buildGrandRotunda();
    setCurrentMode("rotunda");
    setActiveRoomId(null);
    setActiveRoom(null);
    setPromptDoor(null);
    setPromptLocus(null);
    setIsNearExit(false);
  }, [playChime]);

  // Handle player interaction button [E]
  const handleInteract = useCallback(() => {
    if (inspectedLocus) {
      setInspectedLocus(null);
      return;
    }

    if (managerRef.current) {
      if (managerRef.current.nearestDoor) {
        handleEnterRoom(managerRef.current.nearestDoor.roomId);
      } else if (managerRef.current.nearestLocus) {
        const loc = managerRef.current.nearestLocus.locus;
        setInspectedLocus(loc);
        setVisitedLociIds((prev) => ({ ...prev, [loc.id]: true }));
      } else if (managerRef.current.isNearExitDoor) {
        handleReturnRotunda();
      }
    }
  }, [handleEnterRoom, handleReturnRotunda, inspectedLocus]);

  // Fast-travel walk helpers
  const handleWalkToDoor = useCallback((roomId: PalaceRoomId) => {
    if (!managerRef.current) return;
    const door = managerRef.current.doors.find((d) => d.roomId === roomId);
    if (door) {
      // Approach 3.0m in front of the door facing it
      const targetX = door.position.x * 0.82;
      const targetZ = door.position.z * 0.82;
      managerRef.current.characterController.setPosition(targetX, 0, targetZ, door.rotationY);
    }
  }, []);

  const handleWalkToLocus = useCallback((locusId: string) => {
    if (!managerRef.current) return;
    const loc = managerRef.current.currentRoomLoci.find((l) => l.locus.id === locusId);
    if (loc) {
      const charX = loc.position.x * 0.72;
      const charZ = loc.position.z * 0.72;
      const yaw = Math.atan2(loc.position.x - charX, loc.position.z - charZ);
      managerRef.current.characterController.setPosition(charX, 0, charZ, yaw);
    }
  }, []);

  const handleWalkToExit = useCallback(() => {
    if (!managerRef.current || !managerRef.current.exitDoor) return;
    managerRef.current.characterController.setPosition(0, 0, 19, Math.PI);
  }, []);

  // 1. Initialize PalaceSceneManager
  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new PalaceSceneManager(
      containerRef.current,
      (roomId) => handleEnterRoom(roomId),
      () => handleReturnRotunda(),
      () => playFootstep(),
      () => handleInteract(),
      () => handleTriggerVoiceModal()
    );

    managerRef.current = manager;

    // If started with an initial room
    if (initialRoomId) {
      const room = PALACE_ROOMS.find((r) => r.id === initialRoomId);
      if (room) {
        manager.buildRoomChamber(initialRoomId);
        setCurrentMode("room");
        setActiveRoomId(initialRoomId);
        setActiveRoom(room);
      }
    }

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (managerRef.current) {
        managerRef.current.update(delta);

        // Update React HUD state periodically
        setPromptDoor(managerRef.current.nearestDoor);
        setPromptLocus(managerRef.current.nearestLocus);
        setIsNearExit(managerRef.current.isNearExitDoor);

        setPlayerCoord({
          x: managerRef.current.characterController.position.x,
          z: managerRef.current.characterController.position.z,
          rotation: managerRef.current.characterController.rotation,
        });

        // Automatic high-yield voice guidance when approaching a topic
        if (audioGuideActiveRef.current && audioEnabledRef.current) {
          if (managerRef.current.nearestDoor) {
            const doorId = managerRef.current.nearestDoor.roomId;
            if (lastAnnouncedTopicIdRef.current !== `door-${doorId}`) {
              lastAnnouncedTopicIdRef.current = `door-${doorId}`;
              const room = PALACE_ROOMS.find((r) => r.id === doorId);
              if (room) {
                palaceAudio.speak(
                  `Approaching Door ${managerRef.current.nearestDoor.doorNumber}: ${room.name}. Press T to voice consult, or E to enter.`
                );
              }
            }
          } else if (managerRef.current.nearestLocus) {
            const locId = managerRef.current.nearestLocus.locus.id;
            if (lastAnnouncedTopicIdRef.current !== `locus-${locId}`) {
              lastAnnouncedTopicIdRef.current = `locus-${locId}`;
              const loc = managerRef.current.nearestLocus.locus;
              palaceAudio.speak(
                `Station: ${loc.name}. Press T for voice inquiry, or E to inspect.`
              );
            }
          } else if (!managerRef.current.nearestDoor && !managerRef.current.nearestLocus) {
            lastAnnouncedTopicIdRef.current = null;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Window Resize Handler
    const handleResize = () => {
      if (containerRef.current && managerRef.current) {
        managerRef.current.onResize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      manager.dispose();
    };
  }, [handleEnterRoom, handleReturnRotunda, handleInteract, playFootstep, initialRoomId]);

  // Camera Perspective Toggle
  const togglePerspective = () => {
    if (managerRef.current) {
      const next = !isFirstPerson;
      managerRef.current.characterController.isFirstPerson = next;
      setIsFirstPerson(next);
    }
  };

  // Mouse Orbit Camera Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !managerRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Orbit Camera
    managerRef.current.characterController.cameraYaw -= deltaX * 0.006;
    managerRef.current.characterController.cameraPitch = Math.max(
      -0.2,
      Math.min(0.9, managerRef.current.characterController.cameraPitch + deltaY * 0.004)
    );
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Swipe for Mobile Camera
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      // Only drag if not touching virtual controls (left 160px or right 160px on mobile bottom)
      const isNearBottomLeft =
        touch.clientX < 180 && touch.clientY > window.innerHeight - 220;
      const isNearBottomRight =
        touch.clientX > window.innerWidth - 180 && touch.clientY > window.innerHeight - 220;

      if (!isNearBottomLeft && !isNearBottomRight) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !managerRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePosRef.current.x;
    const deltaY = touch.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };

    managerRef.current.characterController.cameraYaw -= deltaX * 0.008;
    managerRef.current.characterController.cameraPitch = Math.max(
      -0.2,
      Math.min(0.9, managerRef.current.characterController.cameraPitch + deltaY * 0.006)
    );
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Virtual Joystick Handler (Mobile Bottom Left)
  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickStartRef.current || !managerRef.current) return;
    const dx = clientX - joystickStartRef.current.x;
    const dy = clientY - joystickStartRef.current.y;
    const maxRadius = 45;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const normX = (Math.cos(angle) * clampedDist) / maxRadius;
    const normY = (Math.sin(angle) * clampedDist) / maxRadius;

    managerRef.current.characterController.joystickVector = {
      x: normX,
      y: -normY, // Inverted so dragging up moves forward
    };
  };

  return (
    <div
      id="mind-palace-game-root"
      className="relative w-full h-screen overflow-hidden bg-slate-950 select-none text-slate-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        id="three-canvas-container"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* =================================================================== */}
      {/* TOP HEADER HUD */}
      {/* =================================================================== */}
      <header
        id="game-header-hud"
        className="absolute top-0 inset-x-0 z-30 p-4 pointer-events-none flex items-start justify-between gap-4 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent"
      >
        {/* Left: Location & Fast Door Switcher */}
        <div className="pointer-events-auto flex items-center gap-3">
          {currentMode === "room" && (
            <button
              id="hud-back-to-rotunda-btn"
              onClick={handleReturnRotunda}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-amber-300 text-xs font-semibold tracking-wide transition-all shadow-lg backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Rotunda Hub</span>
            </button>
          )}

          {/* Current Location Pill & Directory Dropdown */}
          <div className="relative">
            <button
              id="hud-location-directory-btn"
              onClick={() => setShowDirectory(!showDirectory)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-medium tracking-wide transition-all shadow-lg backdrop-blur-md"
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  backgroundColor:
                    activeRoom?.themeColor.accentHex || "#f59e0b",
                }}
              />
              <span className="font-semibold text-slate-200">
                {currentMode === "rotunda"
                  ? "Grand Rotunda (Palace Hub)"
                  : activeRoom?.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Quick Door Directory Dropdown */}
            {showDirectory && (
              <div
                id="hud-directory-dropdown"
                className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-slate-900/98 border border-slate-700/90 shadow-2xl p-2.5 z-50 backdrop-blur-md space-y-2 text-left"
              >
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Chamber Directory (9 Doors)</span>
                  <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* Return to Palace Hub */}
                <button
                  onClick={() => {
                    handleReturnRotunda();
                    setShowDirectory(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    currentMode === "rotunda"
                      ? "bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold">Grand Rotunda (Palace Hub)</div>
                    <div className="text-[10px] text-slate-400">Kane 1988 Fountain • All 9 Doors</div>
                  </div>
                </button>

                {/* 3 Organized Clinical Tiers */}
                {CLINICAL_TIERS.map((tier) => (
                  <div key={tier.tierNumber} className="pt-1">
                    <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tier.color }} />
                        <span>Tier {tier.tierNumber}: {tier.title}</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                        {tier.badge}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      {tier.rooms.map((r) => {
                        const globalDoorNumber = PALACE_ROOMS.findIndex((room) => room.id === r.id) + 1;
                        const isCurrentRoom = activeRoomId === r.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => {
                              handleEnterRoom(r.id);
                              setShowDirectory(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
                              isCurrentRoom
                                ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm"
                                : "text-slate-300 hover:bg-slate-800/70"
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: r.themeColor.accentHex }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium text-slate-200">
                                Door {globalDoorNumber}: {r.name}
                              </div>
                              <div className="truncate text-[10px] text-slate-400">
                                {r.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Voice Ask in Directory */}
                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowDirectory(false);
                      handleTriggerVoiceModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>Voice Ask Curator About Topic</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20">Press T</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Tools, Curator, References, Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Guide Toggle */}
          <button
            id="hud-voice-guide-toggle-btn"
            onClick={() => {
              const next = !audioGuideActive;
              setAudioGuideActive(next);
              if (!next) {
                palaceAudio.stopSpeaking();
                setIsSpeakingTopic(false);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all shadow-md backdrop-blur-md cursor-pointer ${
              audioGuideActive
                ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                : "bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-slate-200"
            }`}
            title="Toggle Automatic Voice Guidance on Approaching Topics"
          >
            <Radio className={`w-3.5 h-3.5 ${audioGuideActive ? "text-amber-400 animate-pulse" : "text-slate-500"}`} />
            <span className="hidden md:inline">Voice Guide: {audioGuideActive ? "ON" : "OFF"}</span>
          </button>

          {/* Perspective Switcher */}
          <button
            id="toggle-perspective-btn"
            onClick={togglePerspective}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-all shadow-md backdrop-blur-md"
            title="Toggle Perspective [V]"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">
              {isFirstPerson ? "1st Person" : "3rd Person"}
            </span>
          </button>

          {/* Read Dossier Button (if in a room) */}
          {activeRoomId && onOpenDossier && (
            <button
              id="hud-read-dossier-btn"
              onClick={() => onOpenDossier(activeRoomId)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-amber-300 transition-all shadow-md backdrop-blur-md"
              title="Open Complete Text Dossier"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Dossier</span>
            </button>
          )}

          {/* Clinical Tools Hub */}
          <button
            id="hud-clinical-tools-btn"
            onClick={onOpenTools}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-all shadow-md backdrop-blur-md"
            title="Clinical Calculators & Decision Tools"
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Tools</span>
          </button>

          {/* Curator AI */}
          <button
            id="hud-curator-ai-btn"
            onClick={onOpenCurator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-all shadow-md backdrop-blur-md"
            title="Ask Palace Curator AI"
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Curator AI</span>
          </button>

          {/* References */}
          <button
            id="hud-literature-btn"
            onClick={onOpenReferences}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-all shadow-md backdrop-blur-md"
            title="Literature Archive"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Literature</span>
          </button>

          {/* Audio Toggle */}
          <button
            id="hud-audio-toggle-btn"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white transition-all shadow-md backdrop-blur-md"
            title={audioEnabled ? "Mute Palace Audio" : "Unmute Palace Audio"}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Guide Toggle */}
          <button
            id="hud-guide-toggle-btn"
            onClick={() => setShowControlsGuide(!showControlsGuide)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white transition-all shadow-md backdrop-blur-md"
            title="Game Controls"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* QUICK DOORWAY WALK STRIP (PALACE ROTUNDA & ROOM STATIONS) */}
      {/* =================================================================== */}
      <div
        id="hud-door-walk-strip"
        className="absolute top-18 inset-x-0 z-30 pointer-events-none flex justify-center px-4"
      >
        <div className="pointer-events-auto max-w-full overflow-x-auto no-scrollbar py-1.5 px-3 rounded-2xl bg-slate-950/85 border border-slate-800/90 shadow-2xl backdrop-blur-md flex items-center gap-1.5">
          {currentMode === "rotunda" ? (
            <>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-1 flex items-center gap-1">
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Doors:</span>
              </span>
              {PALACE_ROOMS.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => handleWalkToDoor(r.id)}
                  title={`Walk Dr. Explorer to Door ${idx + 1}: ${r.name}`}
                  className="px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border border-slate-800/80 hover:scale-105 bg-slate-900/90 text-slate-300 hover:text-white cursor-pointer"
                  style={{
                    borderColor: `${r.themeColor.accentHex}40`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: r.themeColor.accentHex }}
                  />
                  <span>
                    {idx + 1}. {r.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={handleWalkToExit}
                className="px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Exit Door</span>
              </button>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  Stations: {activeRoom?.spatialLoci.filter((l) => visitedLociIds[l.id]).length || 0} /{" "}
                  {activeRoom?.spatialLoci.length || 0}
                </span>
              </div>
              {activeRoom?.spatialLoci.map((loc, idx) => {
                const isVisited = !!visitedLociIds[loc.id];
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleWalkToLocus(loc.id)}
                    title={`Walk Dr. Explorer to ${loc.name}`}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border hover:scale-105 cursor-pointer ${
                      isVisited
                        ? "bg-cyan-950/60 text-cyan-200 border-cyan-500/50 shadow-sm"
                        : "bg-slate-900/90 text-slate-300 hover:text-white border-slate-800/80"
                    }`}
                  >
                    {isVisited ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="text-cyan-400 font-mono text-[10px]">#{idx + 1}</span>
                    )}
                    <span>{loc.name.slice(0, 16)}</span>
                  </button>
                );
              })}
              <button
                onClick={() => handleTriggerVoiceModal()}
                className="px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1 cursor-pointer transition-all ml-1 shadow-sm"
                title="Voice Ask Curator about this Chamber [T]"
              >
                <Mic className="w-3 h-3" />
                <span>Voice Ask [T]</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MINIMAP RADAR (TOP RIGHT) */}
      {/* =================================================================== */}
      <div
        id="hud-minimap-radar"
        className="absolute top-20 right-4 z-30 pointer-events-auto flex flex-col items-end"
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950/80 border-2 border-slate-700/80 shadow-2xl backdrop-blur-md overflow-hidden flex items-center justify-center">
          {/* Compass Rings */}
          <div className="absolute inset-2 rounded-full border border-slate-800" />
          <div className="absolute inset-6 rounded-full border border-slate-800/60" />
          <div className="absolute w-full h-[1px] bg-slate-800/60" />
          <div className="absolute h-full w-[1px] bg-slate-800/60" />

          {/* Surrounding Doors or Loci Markers */}
          {currentMode === "rotunda" ? (
            PALACE_ROOMS.map((r, i) => {
              const num = PALACE_ROOMS.length;
              const angle = (i * Math.PI * 2) / num - Math.PI / 2;
              const rDist = 42; // Pixel radius on radar
              const dotX = Math.cos(angle) * rDist;
              const dotY = Math.sin(angle) * rDist;

              return (
                <button
                  key={r.id}
                  onClick={() => handleEnterRoom(r.id)}
                  title={`Enter Door ${i + 1}: ${r.name}`}
                  className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full border border-slate-900 hover:scale-150 transition-transform cursor-pointer"
                  style={{
                    backgroundColor: r.themeColor.accentHex,
                    transform: `translate(${dotX}px, ${dotY}px)`,
                  }}
                />
              );
            })
          ) : (
            // Room loci markers
            activeRoom?.spatialLoci.map((loc, i) => {
              const offsets = [
                { x: -28, y: -24 },
                { x: 28, y: -24 },
                { x: -30, y: 22 },
                { x: 30, y: 22 },
                { x: 0, y: 32 },
              ];
              const off = offsets[i % offsets.length];
              return (
                <div
                  key={loc.id}
                  title={loc.name}
                  className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full border border-slate-900 animate-ping"
                  style={{
                    backgroundColor: activeRoom.themeColor.accentHex,
                    transform: `translate(${off.x}px, ${off.y}px)`,
                  }}
                />
              );
            })
          )}

          {/* Player Avatar Blip with Heading Arrow */}
          <div
            className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-md flex items-center justify-center"
            style={{
              transform: `translate(${(playerCoord.x / 30) * 35}px, ${
                (playerCoord.z / 30) * 35
              }px)`,
            }}
          >
            <div
              className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-white"
              style={{
                transform: `rotate(${playerCoord.rotation + Math.PI}rad)`,
              }}
            />
          </div>
        </div>
        <span className="mt-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded-full border border-slate-800">
          Radar • {currentMode === "rotunda" ? "Palace Hub" : "Chamber"}
        </span>
      </div>

      {/* =================================================================== */}
      {/* CONTROLS GUIDE FLOATER (BOTTOM LEFT OR MINIMIZED) */}
      {/* =================================================================== */}
      {showControlsGuide && (
        <div
          id="hud-controls-card"
          className="absolute bottom-6 left-6 z-30 pointer-events-auto hidden md:block max-w-xs bg-slate-950/85 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs text-slate-300"
        >
          <div className="flex items-center justify-between font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Controls</span>
            </div>
            <button
              onClick={() => setShowControlsGuide(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Move:</span>
              <span className="text-white font-bold">W A S D / Arrows</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sprint:</span>
              <span className="text-white font-bold">Shift</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Jump / Hop:</span>
              <span className="text-white font-bold">Space</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Interact:</span>
              <span className="text-amber-300 font-bold">[E] or Enter</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Look Around:</span>
              <span className="text-white font-bold">Click + Drag Mouse</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Perspective:</span>
              <span className="text-white font-bold">[V] (1st/3rd Person)</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 italic">
            Walk up to doors to enter rooms, or walk up to pedestals to inspect memory hooks.
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIRTUAL ON-SCREEN D-PAD (FOR QUICK MOUSE & TOUCH CHARACTER CONTROL) */}
      {/* =================================================================== */}
      {isControlsMinimized ? (
        <button
          id="hud-expand-dpad-btn"
          onClick={() => setIsControlsMinimized(false)}
          className="absolute bottom-6 left-6 z-30 pointer-events-auto px-3 py-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Walk Controls</span>
          <Maximize2 className="w-3 h-3 text-slate-400" />
        </button>
      ) : (
        <div
          id="hud-onscreen-dpad"
          className="absolute bottom-6 left-6 z-30 pointer-events-auto flex flex-col items-center bg-slate-950/85 border border-slate-800/90 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md"
        >
          <div className="w-full flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-slate-400 mb-1.5 px-1">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Navigation className="w-3 h-3" />
              <span>Walk</span>
            </span>
            <button
              onClick={() => setIsControlsMinimized(true)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Minimize Controls"
            >
              <Minus className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onMouseDown={() => managerRef.current?.characterController.setForward(true)}
              onMouseUp={() => managerRef.current?.characterController.setForward(false)}
              onMouseLeave={() => managerRef.current?.characterController.setForward(false)}
              onTouchStart={() => managerRef.current?.characterController.setForward(true)}
              onTouchEnd={() => managerRef.current?.characterController.setForward(false)}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-black text-sm flex items-center justify-center active:bg-amber-500 active:text-slate-950 select-none shadow-md cursor-pointer hover:bg-slate-800"
              title="Forward (W)"
            >
              ▲
            </button>
            <div />

            <button
              onMouseDown={() => managerRef.current?.characterController.setLeft(true)}
              onMouseUp={() => managerRef.current?.characterController.setLeft(false)}
              onMouseLeave={() => managerRef.current?.characterController.setLeft(false)}
              onTouchStart={() => managerRef.current?.characterController.setLeft(true)}
              onTouchEnd={() => managerRef.current?.characterController.setLeft(false)}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-black text-sm flex items-center justify-center active:bg-amber-500 active:text-slate-950 select-none shadow-md cursor-pointer hover:bg-slate-800"
              title="Turn Left (A)"
            >
              ◄
            </button>
            <button
              onMouseDown={() => managerRef.current?.characterController.setBackward(true)}
              onMouseUp={() => managerRef.current?.characterController.setBackward(false)}
              onMouseLeave={() => managerRef.current?.characterController.setBackward(false)}
              onTouchStart={() => managerRef.current?.characterController.setBackward(true)}
              onTouchEnd={() => managerRef.current?.characterController.setBackward(false)}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-black text-sm flex items-center justify-center active:bg-amber-500 active:text-slate-950 select-none shadow-md cursor-pointer hover:bg-slate-800"
              title="Backward (S)"
            >
              ▼
            </button>
            <button
              onMouseDown={() => managerRef.current?.characterController.setRight(true)}
              onMouseUp={() => managerRef.current?.characterController.setRight(false)}
              onMouseLeave={() => managerRef.current?.characterController.setRight(false)}
              onTouchStart={() => managerRef.current?.characterController.setRight(true)}
              onTouchEnd={() => managerRef.current?.characterController.setRight(false)}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-black text-sm flex items-center justify-center active:bg-amber-500 active:text-slate-950 select-none shadow-md cursor-pointer hover:bg-slate-800"
              title="Turn Right (D)"
            >
              ►
            </button>
          </div>

          {/* Action Row: Sprint, Jump, Interact */}
          <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-slate-800/80">
            <button
              onMouseDown={() => managerRef.current?.characterController.setSprint(true)}
              onMouseUp={() => managerRef.current?.characterController.setSprint(false)}
              onMouseLeave={() => managerRef.current?.characterController.setSprint(false)}
              onTouchStart={() => managerRef.current?.characterController.setSprint(true)}
              onTouchEnd={() => managerRef.current?.characterController.setSprint(false)}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 active:bg-amber-500 active:text-slate-950 select-none cursor-pointer hover:bg-slate-800"
              title="Sprint / Run (Shift)"
            >
              RUN
            </button>
            <button
              onClick={() => managerRef.current?.characterController.jumpAction()}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 active:bg-amber-500 active:text-slate-950 select-none cursor-pointer hover:bg-slate-800"
              title="Jump (Space)"
            >
              JUMP
            </button>
            <button
              onClick={handleInteract}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] active:scale-95 transition-transform select-none shadow-md cursor-pointer hover:bg-amber-400"
              title="Interact / Enter Door (E)"
            >
              [E]
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* INTERACTIVE PROXIMITY BANNER (BOTTOM CENTER) */}
      {/* =================================================================== */}
      <div
        id="hud-proximity-banner-container"
        className="absolute bottom-8 inset-x-0 z-40 pointer-events-none flex items-center justify-center px-4"
      >
        {/* Case 1: Approaching Door in Rotunda */}
        {promptDoor && currentMode === "rotunda" && (
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              id="proximity-enter-door-banner"
              onClick={() => handleEnterRoom(promptDoor.roomId)}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 border-2 hover:scale-105 transition-all shadow-2xl backdrop-blur-md animate-bounce cursor-pointer"
              style={{
                borderColor:
                  PALACE_ROOMS.find((r) => r.id === promptDoor.roomId)?.themeColor
                    .accentHex || "#f59e0b",
              }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm">
                E
              </span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Press [E] or Click to Enter
                </div>
                <div className="text-sm font-serif font-bold text-white">
                  Door {promptDoor.doorNumber} • {promptDoor.name}
                </div>
              </div>
              <DoorOpen className="w-5 h-5 text-amber-400 ml-2" />
            </button>

            {/* Voice consult button on approaching door */}
            <button
              id="proximity-voice-door-btn"
              onClick={() => handleTriggerVoiceModal()}
              className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 transition-all shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105"
              title="Voice Ask About This Chamber [T]"
            >
              <Mic className="w-5 h-5 text-amber-400" />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] font-mono uppercase text-amber-400 font-bold">Voice [T]</div>
                <div className="text-xs font-medium text-slate-200">Ask Topic</div>
              </div>
            </button>

            {/* Audio listen button */}
            <button
              id="proximity-audio-door-btn"
              onClick={handleToggleTopicAudio}
              className={`p-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105 ${
                isSpeakingTopic
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60"
                  : "bg-slate-900/95 text-slate-300 border-slate-700/80 hover:text-white"
              }`}
              title={isSpeakingTopic ? "Stop Audio" : "Listen to Overview"}
            >
              <Headphones className={`w-5 h-5 ${isSpeakingTopic ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            </button>
          </div>
        )}

        {/* Case 2: Approaching Locus in Room */}
        {promptLocus && currentMode === "room" && (
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              id="proximity-inspect-locus-banner"
              onClick={() => {
                setInspectedLocus(promptLocus.locus);
                setVisitedLociIds((prev) => ({ ...prev, [promptLocus.locus.id]: true }));
              }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 border-2 hover:scale-105 transition-all shadow-2xl backdrop-blur-md animate-bounce cursor-pointer"
              style={{
                borderColor: activeRoom?.themeColor.accentHex || "#38bdf8",
              }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm">
                E
              </span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  Press [E] or Click to Inspect Station
                </div>
                <div className="text-sm font-serif font-bold text-white">
                  {promptLocus.locus.name}
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-cyan-400 ml-2" />
            </button>

            {/* Voice consult button on approaching station */}
            <button
              id="proximity-voice-locus-btn"
              onClick={() => handleTriggerVoiceModal()}
              className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 transition-all shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105"
              title="Voice Ask About This Station [T]"
            >
              <Mic className="w-5 h-5 text-cyan-400" />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] font-mono uppercase text-cyan-400 font-bold">Voice [T]</div>
                <div className="text-xs font-medium text-slate-200">Ask Station</div>
              </div>
            </button>

            {/* Audio listen button */}
            <button
              id="proximity-audio-locus-btn"
              onClick={handleToggleTopicAudio}
              className={`p-3 rounded-2xl border transition-all shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105 ${
                isSpeakingTopic
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60"
                  : "bg-slate-900/95 text-slate-300 border-slate-700/80 hover:text-white"
              }`}
              title={isSpeakingTopic ? "Stop Audio" : "Listen to Station Memory Anchor"}
            >
              <Headphones className={`w-5 h-5 ${isSpeakingTopic ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            </button>
          </div>
        )}

        {/* Case 3: Near Exit Doorway in Room */}
        {isNearExit && currentMode === "room" && (
          <button
            id="proximity-exit-room-banner"
            onClick={handleReturnRotunda}
            className="pointer-events-auto flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900/95 border-2 border-amber-500/80 hover:scale-105 transition-all shadow-2xl backdrop-blur-md animate-bounce cursor-pointer"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm">
              E
            </span>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Press [E] or Click to Exit
              </div>
              <div className="text-sm font-serif font-bold text-white">
                Return to Grand Rotunda Hub
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-amber-400 ml-2" />
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* MOBILE TOUCH CONTROLS (ANALOG JOYSTICK & ACTION BUTTONS) */}
      {/* =================================================================== */}
      <div className="md:hidden absolute inset-x-0 bottom-6 px-6 pointer-events-none z-30 flex items-end justify-between">
        {/* Virtual Joystick (Left) */}
        <div
          id="mobile-virtual-joystick"
          className="pointer-events-auto relative w-28 h-28 rounded-full bg-slate-900/70 border-2 border-slate-700/80 backdrop-blur-md flex items-center justify-center touch-none"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            joystickStartRef.current = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };
            setTouchActive(true);
            handleJoystickMove(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleJoystickMove(touch.clientX, touch.clientY);
          }}
          onTouchEnd={() => {
            setTouchActive(false);
            joystickStartRef.current = null;
            if (managerRef.current) {
              managerRef.current.characterController.joystickVector = { x: 0, y: 0 };
            }
          }}
        >
          {/* Inner stick nub */}
          <div
            className={`w-12 h-12 rounded-full border border-amber-400/80 transition-colors shadow-lg ${
              touchActive ? "bg-amber-400" : "bg-amber-500/40"
            }`}
          />
          <span className="absolute bottom-1 text-[9px] font-mono text-slate-400">
            MOVE
          </span>
        </div>

        {/* Action Buttons (Right) */}
        <div className="pointer-events-auto flex flex-col items-end gap-2.5">
          {/* Mobile Voice Button */}
          <button
            id="mobile-voice-btn"
            onClick={() => handleTriggerVoiceModal()}
            className="w-12 h-12 rounded-full bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center active:bg-cyan-500 active:text-slate-950 backdrop-blur-md shadow-lg cursor-pointer"
            title="Voice Consult [T]"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Sprint Toggle */}
          <button
            id="mobile-sprint-btn"
            onTouchStart={() => {
              if (managerRef.current) managerRef.current.characterController.input.sprint = true;
            }}
            onTouchEnd={() => {
              if (managerRef.current) managerRef.current.characterController.input.sprint = false;
            }}
            className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center active:bg-slate-700 backdrop-blur-md"
          >
            RUN
          </button>

          {/* Jump Button */}
          <button
            id="mobile-jump-btn"
            onClick={() => {
              if (managerRef.current && managerRef.current.characterController.isGrounded) {
                managerRef.current.characterController.velocityY = 6.5;
                managerRef.current.characterController.isGrounded = false;
              }
            }}
            className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center active:bg-slate-700 backdrop-blur-md"
          >
            JUMP
          </button>

          {/* Action [E] Button */}
          <button
            id="mobile-interact-btn"
            onClick={handleInteract}
            className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          >
            E
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* LOCUS INSPECTOR MODAL */}
      {/* =================================================================== */}
      {inspectedLocus && activeRoom && (
        <LocusInspectorModal
          locus={inspectedLocus}
          room={activeRoom}
          onClose={() => setInspectedLocus(null)}
          onAskCurator={(prompt) => {
            setInspectedLocus(null);
            onSelectLocusForCurator(prompt);
          }}
          onOpenVoiceTopic={(topic) => {
            setInspectedLocus(null);
            handleTriggerVoiceModal(topic);
          }}
        />
      )}

      {/* =================================================================== */}
      {/* VOICE TOPIC INTERACTION MODAL */}
      {/* =================================================================== */}
      {voiceModalOpen && voiceTopic && (
        <VoiceTopicInteractionModal
          isOpen={voiceModalOpen}
          topic={voiceTopic}
          onClose={() => setVoiceModalOpen(false)}
        />
      )}
    </div>
  );
};

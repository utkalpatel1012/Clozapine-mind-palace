export type PalaceRoomId =
  | "history"
  | "indications"
  | "pharmacodynamics"
  | "pharmacokinetics"
  | "blackbox"
  | "hematology"
  | "titration"
  | "advances"
  | "understudy"
  | "references";

export interface MnemonicLocus {
  id: string;
  name: string;
  objectVisual: string;
  spatialSpot: string;
  memoryHook: string;
  scientificFact: string;
  clinicalAction: string;
  categoryTag: string;
}

export type SpatialLocus = MnemonicLocus;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  groundingSources?: Array<{ title?: string; uri: string }>;
}

export interface KeyMetric {
  label: string;
  value: string;
  detail: string;
  trend?: "up" | "down" | "neutral" | "warning";
}

export interface SubtopicSection {
  title: string;
  content: string;
  keyPoints: string[];
  clinicalWarning?: string;
}

export interface PalaceRoom {
  id: PalaceRoomId;
  doorNumber: number;
  name: string;
  subtitle: string;
  icon: string;
  doorLabel: string;
  roomArchetype: string;
  themeColor: {
    badge: string;
    glow: string;
    border: string;
    bgGradient: string;
    accentHex: string;
  };
  architecturalAtmosphere: string;
  spatialLoci: MnemonicLocus[];
  keyMetrics: KeyMetric[];
  subtopics: SubtopicSection[];
  clinicalPearls: string[];
  referenceIds: string[];
}

export interface ReferenceArticle {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  category:
    | "Landmark & Efficacy"
    | "Hematology & REMS"
    | "Pharmacokinetics & TDM"
    | "Cardiovascular Safety"
    | "GI Motility & Sialorrhea"
    | "Recent Advances (2024-2026)"
    | "Under Study & Pipeline";
  summary: string;
  keyFinding: string;
  evidenceLevel: "Meta-Analysis" | "Systematic Review" | "Randomized Controlled Trial" | "Landmark Cohort" | "FDA Guidance";
  url?: string;
}

export interface RecentAdvanceItem {
  id: string;
  title: string;
  year: string;
  tag: string;
  statusBadge: string;
  summary: string;
  breakthroughDetail: string;
  clinicalPracticeShift: string;
  references: string[];
}

export interface UnderStudyItem {
  id: string;
  title: string;
  phase: string;
  investigationalDomain: string;
  hypothesis: string;
  ongoingEvidence: string;
  futureImplications: string;
  references: string[];
}

export interface DrugInteractionScenario {
  drug: string;
  classType: string;
  metabolicPathway: string;
  interactionEffect: string;
  severity: "Contraindicated" | "High Risk" | "Moderate Risk" | "Monitor / Adjust";
  clinicalGuidance: string;
  plasmaChangePercent: string;
}

export interface ANCTriageResult {
  category: "Normal / Safe" | "Mild Neutropenia" | "Moderate Neutropenia" | "Severe Agranulocytosis";
  badgeColor: string;
  actionRequired: string;
  testingFrequency: string;
  canContinueClozapine: boolean;
  canRechallengeInFuture: boolean;
  gcsfRecommended: boolean;
  clinicalNotes: string;
}

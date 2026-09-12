import React, { useState } from "react";
import {
  BookOpen,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Filter,
  Microscope,
  Clock,
} from "lucide-react";
import {
  CLOZAPINE_REFERENCES,
  RECENT_ADVANCES_DATA,
  UNDER_STUDY_DATA,
} from "../data/clozapineData";

interface ReferenceLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export const ReferenceLibrary: React.FC<ReferenceLibraryProps> = ({
  isOpen,
  onClose,
  initialCategory = "all",
}) => {
  const [activeTab, setActiveTab] = useState<"references" | "advances" | "understudy">("references");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All Literature" },
    { id: "Landmark & Efficacy", label: "Landmark & Efficacy" },
    { id: "Hematology & REMS", label: "Hematology & REMS" },
    { id: "Pharmacokinetics & TDM", label: "Pharmacokinetics & TDM" },
    { id: "Cardiovascular Safety", label: "Cardiovascular Safety" },
    { id: "GI Motility & Sialorrhea", label: "GI Motility & Sialorrhea" },
    { id: "Recent Advances (2024-2026)", label: "Recent Advances (2024-2026)" },
  ];

  const filteredReferences = CLOZAPINE_REFERENCES.filter((ref) => {
    const matchesCat =
      selectedCategory === "all" || ref.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ref.title.toLowerCase().includes(query) ||
      ref.authors.toLowerCase().includes(query) ||
      ref.journal.toLowerCase().includes(query) ||
      ref.keyFinding.toLowerCase().includes(query) ||
      ref.summary.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/70 text-cyan-300 rounded-lg border border-cyan-800/60">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-100 font-['Cinzel']">
                Scientific Literature & Evidence Archive
              </h2>
              <p className="text-xs text-slate-400">
                Peer-reviewed clinical trials, international consensus guidelines, and 2024–2026 frontiers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs & Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("references")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "references"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Primary Citations ({CLOZAPINE_REFERENCES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("advances")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "advances"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recent Advances ({RECENT_ADVANCES_DATA.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("understudy")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "understudy"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Still Under Study ({UNDER_STUDY_DATA.length})</span>
            </button>
          </div>

          {activeTab === "references" && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search literature & trials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>

        {/* Category Filter Chips for References */}
        {activeTab === "references" && (
          <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? "bg-cyan-950 border border-cyan-500 text-cyan-200 font-medium"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "references" && (
            filteredReferences.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No literature matches your search filter.
              </div>
            ) : (
              filteredReferences.map((ref) => {
                const fullCitation = `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}${
                  ref.pmid ? ` PMID: ${ref.pmid}` : ""
                }${ref.doi ? ` DOI: ${ref.doi}` : ""}`;
                const isCopied = copiedId === ref.id;

                return (
                  <div
                    key={ref.id}
                    id={`ref-card-${ref.id}`}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-semibold">
                          {ref.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {ref.evidenceLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1"
                          >
                            <span>PubMed / Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(fullCitation, ref.id)}
                          className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                          title="Copy citation"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="text-[10px]">{isCopied ? "Copied" : "Cite"}</span>
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">{ref.title}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {ref.authors} • <span className="text-slate-300">{ref.journal}</span> ({ref.year})
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed">{ref.summary}</p>

                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-cyan-400">Key Scientific Finding: </span>
                      {ref.keyFinding}
                    </div>
                  </div>
                );
              })
            )
          )}

          {activeTab === "advances" && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200">
                <span className="font-bold text-amber-300 block mb-1">
                  Recent Scientific Breakthroughs & Regulatory Modernization (2024–2026)
                </span>
                This section compiles breakthrough advancements identified across recent literature, including
                the historic 2025 FDA REMS elimination, point-of-care capillary ANC analyzers, and GLP-1 receptor
                agonist synergy for clozapine-induced metabolic syndrome.
              </div>

              {RECENT_ADVANCES_DATA.map((adv) => (
                <div
                  key={adv.id}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold font-mono text-amber-400">{adv.year}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300">
                        {adv.tag}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {adv.statusBadge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{adv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{adv.summary}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{adv.breakthroughDetail}</p>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80 text-xs">
                    <span className="font-semibold text-amber-300 block mb-0.5">Clinical Practice Shift:</span>
                    <span className="text-slate-300">{adv.clinicalPracticeShift}</span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-400">
                    Key Citations: {adv.references.join(" • ")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "understudy" && (
            <div className="space-y-5">
              <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-200">
                <span className="font-bold text-purple-300 block mb-1">
                  Frontiers & Still Under Study Section
                </span>
                Active investigational domains, pipeline drug designs, and clinical trials exploring non-D2
                antipsychotic mechanisms inspired by clozapine and rescue protocols for refractory illness.
              </div>

              {UNDER_STUDY_DATA.map((study) => (
                <div
                  key={study.id}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold font-mono text-purple-400">{study.phase}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/50 text-purple-300">
                      {study.investigationalDomain}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{study.title}</h3>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div>
                      <span className="font-semibold text-purple-300">Scientific Hypothesis: </span>
                      <span>{study.hypothesis}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Current Ongoing Evidence: </span>
                      <span>{study.ongoingEvidence}</span>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                      <span className="font-semibold text-purple-300 block mb-0.5">Future Clinical Implications:</span>
                      <span>{study.futureImplications}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-400">
                    Associated Literature: {study.references.join(" • ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>{CLOZAPINE_REFERENCES.length} Total Verified Citations Indexed</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  RefreshCw,
  Copy,
  Check,
  Radio,
  HelpCircle,
  Stethoscope,
} from "lucide-react";
import { palaceAudio } from "../../utils/palaceAudio";

export interface VoiceTopic {
  title: string;
  category: string;
  context?: string;
  suggestedQuestions?: string[];
}

export interface VoiceTopicInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: VoiceTopic | null;
  topicTitle?: string;
  topicCategory?: string;
  topicContext?: string;
  suggestedQuestions?: string[];
  autoStartListening?: boolean;
}

export const VoiceTopicInteractionModal: React.FC<VoiceTopicInteractionModalProps> = ({
  isOpen,
  onClose,
  topic,
  topicTitle,
  topicCategory,
  topicContext = "",
  suggestedQuestions = [],
  autoStartListening = true,
}) => {
  const activeTitle = topic?.title || topicTitle || "Clozapine Topic";
  const activeCategory = topic?.category || topicCategory || "Mind Palace Station";
  const activeContext = topic?.context || topicContext || "";
  const activeQuestions = topic?.suggestedQuestions || suggestedQuestions || [];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [curatorAnswer, setCuratorAnswer] = useState<string | null>(null);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // Initialize and trigger speech listening when opened
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      palaceAudio.stopSpeaking();
      setIsSpeakingAnswer(false);
      return;
    }

    setTranscript("");
    setInterimTranscript("");
    setCuratorAnswer(null);
    setSpeechError(null);

    if (autoStartListening && isSpeechSupported) {
      startListening();
    }
  }, [isOpen]);

  const startListening = () => {
    palaceAudio.stopSpeaking();
    setIsSpeakingAnswer(false);
    setSpeechError(null);
    setInterimTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setSpeechError("Speech recognition is not supported in this browser. You can type below.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        palaceAudio.playVoiceListenChime();
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript((prev) => (prev ? `${prev} ${final}` : final));
          setInterimTranscript("");
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setSpeechError("Microphone access was denied. Please allow microphone permissions.");
        } else if (event.error !== "no-speech") {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
      setSpeechError("Microphone could not be initialized.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const submitQuery = async (queryText?: string) => {
    const query = (queryText || transcript || interimTranscript).trim();
    if (!query) return;

    stopListening();
    setIsLoading(true);
    setCuratorAnswer(null);
    palaceAudio.stopSpeaking();
    setIsSpeakingAnswer(false);

    try {
      palaceAudio.playVoiceSuccessChime();

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Topic Context: ${activeTitle} (${activeCategory})] ${activeContext ? `\nClinical Details: ${activeContext}\n` : ""}\nUser Clinical Voice Question: "${query}". Please provide an authoritative, concise, and clinically high-yield answer (3-5 sentences maximum for spoken clarity).`,
          thinking: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const answer = data.text || data.reply || data.response || "No response received from clinical curator.";
      setCuratorAnswer(answer);

      // Auto-narrate the Curator's answer aloud
      palaceAudio.speak(answer, {
        onStart: () => setIsSpeakingAnswer(true),
        onEnd: () => setIsSpeakingAnswer(false),
        onError: () => setIsSpeakingAnswer(false),
      });
    } catch (err: any) {
      console.error("Query failed:", err);
      const fallback = `Curator consultation error: ${err.message}. Please check your connection.`;
      setCuratorAnswer(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeakAnswer = () => {
    if (isSpeakingAnswer) {
      palaceAudio.stopSpeaking();
      setIsSpeakingAnswer(false);
    } else if (curatorAnswer) {
      palaceAudio.speak(curatorAnswer, {
        onStart: () => setIsSpeakingAnswer(true),
        onEnd: () => setIsSpeakingAnswer(false),
        onError: () => setIsSpeakingAnswer(false),
      });
    }
  };

  const handleCopy = () => {
    if (!curatorAnswer) return;
    navigator.clipboard.writeText(curatorAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="voice-interaction-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="voice-interaction-card"
        className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Glowing Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeCategory}
                </span>
                <span className="text-xs text-slate-400 flex items-center">
                  <Stethoscope className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  Voice Consultation
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide truncate max-w-md">
                {activeTitle}
              </h2>
            </div>
          </div>

          <button
            id="close-voice-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Listening / Mic Status Panel */}
          <div
            id="mic-status-stage"
            className={`p-6 rounded-xl border text-center transition-all duration-300 ${
              isListening
                ? "bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "bg-slate-950/60 border-slate-800"
            }`}
          >
            {/* Animated Audio Frequency Waves */}
            <div className="flex items-center justify-center space-x-1.5 h-12 mb-4">
              {[0.4, 0.8, 1.2, 0.9, 0.5, 1.1, 0.7].map((delay, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isListening
                      ? "bg-amber-400 animate-pulse"
                      : "bg-slate-700 h-2"
                  }`}
                  style={{
                    height: isListening ? `${24 + Math.sin(Date.now() * 0.01 + delay * 3) * 18}px` : "8px",
                    animationDelay: `${delay * 150}ms`,
                  }}
                />
              ))}
            </div>

            {/* Central Microphone Button */}
            <button
              id="voice-toggle-record-btn"
              onClick={handleToggleMic}
              disabled={isLoading}
              className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full transition-transform active:scale-95 shadow-xl ${
                isListening
                  ? "bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-500/30 animate-pulse"
                  : "bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold"
              }`}
            >
              {isListening ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-slate-950" />
              )}
            </button>

            <div className="mt-3">
              <p className="text-sm font-medium text-slate-200">
                {isListening ? (
                  <span className="text-amber-300 font-semibold flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-2" />
                    Listening to your voice... Speak your question now
                  </span>
                ) : (
                  <span>Tap microphone or speak into your headset</span>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Natural clinical questions: e.g. &ldquo;What are the baseline ANC cutoff rules?&rdquo;
              </p>
            </div>

            {speechError && (
              <div className="mt-3 p-2 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg">
                {speechError}
              </div>
            )}
          </div>

          {/* User Spoken Query Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Your Spoken Question:
              </span>
              {(transcript || interimTranscript) && (
                <button
                  onClick={() => {
                    setTranscript("");
                    setInterimTranscript("");
                  }}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="voice-question-transcript-box"
                value={transcript + (interimTranscript ? ` (${interimTranscript}...)` : "")}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  isListening
                    ? "Your words will appear here in real-time as you speak..."
                    : "Ask anything about this topic or tap a suggested prompt below..."
                }
                rows={2}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm resize-none"
              />

              <button
                id="voice-submit-question-btn"
                onClick={() => submitQuery()}
                disabled={isLoading || (!transcript.trim() && !interimTranscript.trim())}
                className="absolute right-2.5 bottom-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isLoading ? "Consulting..." : "Ask Curator"}</span>
              </button>
            </div>
          </div>

          {/* Quick Click Prompts */}
          {activeQuestions && activeQuestions.length > 0 && !curatorAnswer && (
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Or ask common clinical questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTranscript(q);
                      submitQuery(q);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 hover:border-amber-500/40 text-left transition-colors"
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Curator Answer Panel */}
          {curatorAnswer && (
            <div
              id="voice-curator-answer-panel"
              className="p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-3 animate-in fade-in duration-300"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Curator Spoken Clinical Brief
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    id="toggle-speak-answer-btn"
                    onClick={toggleSpeakAnswer}
                    title={isSpeakingAnswer ? "Pause audio narration" : "Read answer aloud"}
                    className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1 border transition-colors ${
                      isSpeakingAnswer
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    }`}
                  >
                    {isSpeakingAnswer ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 mr-1" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 mr-1" />
                        <span>Speak Aloud</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy Answer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {curatorAnswer}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
                <span className="italic">
                  {isSpeakingAnswer ? "Voice engine is narrating response..." : "Narration paused."}
                </span>

                <button
                  id="speak-followup-btn"
                  onClick={() => {
                    setTranscript("");
                    startListening();
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1 hover:underline"
                >
                  <Mic className="w-3 h-3 mr-0.5" />
                  <span>Ask Follow-up Voice Question</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Real-time Web Speech &amp; Clinical Reasoning Engine</span>
          </div>

          <button
            id="close-voice-modal-btn-footer"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
          >
            Done (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

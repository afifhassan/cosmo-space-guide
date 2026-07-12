import React, { useState } from "react";
import { SPACE_FACTS, SpaceFact } from "../types";
import { Sparkles, RefreshCw, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playStellarChime } from "./AudioSynthesizer";

interface SpaceFactCardProps {
  onAskCosmo: (question: string) => void;
  soundEnabled: boolean;
}

export default function SpaceFactCard({ onAskCosmo, soundEnabled }: SpaceFactCardProps) {
  const [currentFact, setCurrentFact] = useState<SpaceFact>(SPACE_FACTS[0]);
  const [isRotating, setIsRotating] = useState(false);

  const handleNextFact = () => {
    setIsRotating(true);
    if (soundEnabled) {
      playStellarChime();
    }
    
    // Pick a new random fact
    const currentIndex = SPACE_FACTS.findIndex((f) => f.id === currentFact.id);
    let nextIndex = Math.floor(Math.random() * SPACE_FACTS.length);
    while (nextIndex === currentIndex && SPACE_FACTS.length > 1) {
      nextIndex = Math.floor(Math.random() * SPACE_FACTS.length);
    }
    
    setCurrentFact(SPACE_FACTS[nextIndex]);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="bg-slate-900/85 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Absolute design accents */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase text-indigo-300 font-display">
            Stellar Discovery
          </span>
        </div>
        <button
          onClick={handleNextFact}
          disabled={isRotating}
          className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer group"
          title="New Space Fact!"
        >
          <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isRotating ? "rotate-180" : "group-hover:rotate-45"}`} />
        </button>
      </div>

      {/* Fact Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFact.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-[140px] flex flex-col justify-between"
        >
          <div>
            <div className="inline-block px-2.5 py-0.5 bg-indigo-950/80 border border-indigo-400/20 rounded-md text-xs text-indigo-300 font-mono mb-2">
              {currentFact.funLabel}
            </div>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed leading-6 font-sans">
              {currentFact.fact}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-xs text-slate-400">
              Topic: <strong className="text-indigo-400">{currentFact.topic}</strong>
            </span>
            <button
              onClick={() => onAskCosmo(`Tell me more about the amazing space facts regarding ${currentFact.topic}!`)}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/40 rounded-lg text-xs font-medium text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/10"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask Cosmo More!
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

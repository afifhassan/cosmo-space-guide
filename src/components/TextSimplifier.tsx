import React, { useState } from "react";
import { HEAVY_TEXT_SAMPLES, HeavyTextSample } from "../types";
import { Sparkles, HelpCircle, ArrowRight, Clipboard } from "lucide-react";
import { motion } from "motion/react";
import { playRobotBeep } from "./AudioSynthesizer";

interface TextSimplifierProps {
  onSimplify: (text: string) => void;
  isLoading: boolean;
  soundEnabled: boolean;
}

export default function TextSimplifier({ onSimplify, isLoading, soundEnabled }: TextSimplifierProps) {
  const [inputText, setInputText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleSelectSample = (sample: HeavyTextSample) => {
    if (soundEnabled) {
      playRobotBeep();
    }
    setInputText(sample.text);
    setSelectedTopic(sample.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    // Prefix the text for backend processing
    onSimplify(`SIMPLIFY THIS TECHNICAL TEXT: ${inputText}`);
  };

  return (
    <div className="bg-slate-900/85 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Absolute background accent */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold tracking-wider uppercase text-cyan-300 font-display">
          Cosmic Synthesizer
        </h3>
      </div>
      
      <p className="text-xs text-slate-300 mb-4 leading-relaxed leading-5">
        Paste any complex astrophysical research or dense academic text below, and COSMO will synthesize a high-fidelity conceptual translation.
      </p>

      {/* Heavy scientific samples list */}
      <div className="mb-4">
        <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Pick a NASA sample:</span>
        <div className="grid grid-cols-2 gap-1.5">
          {HEAVY_TEXT_SAMPLES.map((sample) => (
            <button
              key={sample.title}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`text-left text-[11px] px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
                selectedTopic === sample.title
                  ? "bg-indigo-600/30 border-indigo-400 text-cyan-300"
                  : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="font-semibold font-display truncate">{sample.topic}</div>
              <div className="text-[9px] text-slate-400 truncate">{sample.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedTopic("");
            }}
            placeholder="Paste dense scientific writing, abstract, or textbook paragraph here..."
            className="w-full h-28 px-3.5 py-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none font-sans"
            maxLength={1000}
          />
          <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
            {inputText.length}/1000
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={`w-full py-2.5 px-4 rounded-xl font-display font-medium text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            inputText.trim() && !isLoading
              ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <span>Synthesize!</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

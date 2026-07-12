import React, { useState } from "react";
import { Sparkles, Calendar, Newspaper, AlertCircle, Play, Info, Flame, Rocket, Star, Compass, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playStellarChime, playRobotBeep } from "./AudioSynthesizer";
import SpaceFactCard from "./SpaceFactCard";

interface DailyUpdatesProps {
  onAskCosmo: (question: string) => void;
  soundEnabled: boolean;
  nasaApodComponent: React.ReactNode; // Let's pass the NasaExplorer here or render parts of it
}

export default function DailyUpdates({ onAskCosmo, soundEnabled, nasaApodComponent }: DailyUpdatesProps) {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  // Today's Date info
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Custom July 12 Space History Fact (James Webb Anniversary is exactly July 12!)
  const dailyMilestone = {
    title: "James Webb Space Telescope (JWST) Anniversary!",
    date: "July 12, 2022",
    description: "On this historic day in astronomy, NASA and ESA released the very first scientific full-color images from the James Webb Space Telescope! These images peered deeper into the infrared universe than ever before, revealing ancient galaxies, nebulae nurseries, and water vapor on faraway planet atmospheres.",
    analogy: "Think of the JWST like a giant cosmic pair of infrared night-vision goggles, letting us see warm objects hidden behind giant clouds of cold space dust!",
    eventImagePrompt: "A stunning, super-colorful deep field image showing thousands of distant glowing spiral galaxies in the deep universe."
  };

  // Daily Quiz Question
  const dailyQuiz = {
    question: "Which of these planets has a storm wider than two entire Earths combined?",
    options: [
      { text: "Mars (The Red Planet)", correct: false },
      { text: "Saturn (The Ringed World)", correct: false },
      { text: "Jupiter (The King of Gas Giants)", correct: true },
      { text: "Mercury (The Speeding Rock)", correct: false },
    ],
    explanation: "Correct! Jupiter has a massive swirling hurricane storm called the **Great Red Spot** that has been raging for at least 300 years, and it's so huge that two whole planet Earths could fit inside side-by-side! Gravity is 2.5 times stronger there too!"
  };

  const handleQuizOption = (idx: number, isCorrect: boolean) => {
    setSelectedQuizOption(idx);
    setQuizAnswered(true);
    if (soundEnabled) {
      if (isCorrect) {
        playStellarChime();
      } else {
        playRobotBeep();
      }
    }
  };

  const handleAskCosmoAboutJWST = () => {
    onAskCosmo(`Tell me about the historic event on July 12, 2022 when NASA released the first full-color images from the James Webb Space Telescope. What did we learn, and what makes this telescope so special compared to Hubble? Provide an insightful, professional overview of the science and technology breakthroughs.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Cosmic Banner & Date */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border-2 border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Abstract orbits */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl text-[#fbbf24] animate-pulse">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono block">
                Cosmic Gazette • Daily Edition
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
                Today's Space Feed
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                📅 Current Solar Time: <span className="text-cyan-400 font-bold">{formattedDate}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-right max-w-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Cosmo's Status</span>
            <p className="text-xs text-indigo-300 font-semibold mt-0.5">
              🚀 Daily transmissions fully loaded!
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Daily Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Milestone of the Day & Quiz (8/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Today's Space Anniversary/Milestone */}
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-2 mb-3.5">
              <span className="bg-[#fbbf24] text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider font-display">
                Star Date: July 12
              </span>
              <span className="text-indigo-300 text-xs font-semibold font-display">Historical Milestone</span>
            </div>

            <h3 className="text-lg font-bold font-display text-white leading-snug">
              {dailyMilestone.title}
            </h3>
            
            <p className="text-xs font-mono text-indigo-400 mt-1 mb-3">
              Anniversary date: {dailyMilestone.date}
            </p>

            <p className="text-sm text-slate-200 leading-relaxed font-sans mb-4">
              {dailyMilestone.description}
            </p>

            {/* Analogy banner */}
            <div className="bg-indigo-600/10 border-l-4 border-indigo-500 p-3 rounded-r-2xl mb-5 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">💡</span>
                <span className="text-xs font-bold text-white uppercase font-display">COSMO Conceptual Analogy</span>
              </div>
              <p className="text-xs text-indigo-200 font-medium">
                {dailyMilestone.analogy}
              </p>
            </div>

            {/* CTA action button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                Want to study the JWST detectors with COSMO AI?
              </div>
              <button
                onClick={handleAskCosmoAboutJWST}
                className="w-full sm:w-auto py-2 px-4.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Newspaper className="w-3.5 h-3.5" />
                Request Technical Briefing
              </button>
            </div>
          </div>

          {/* Daily Curiosity Quiz of the Day */}
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            <div className="flex items-center gap-2 mb-3.5">
              <div className="p-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-400">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-cyan-300 font-display">
                Cosmic Brain-Teaser
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-white mb-4">
              {dailyQuiz.question}
            </h3>

            {/* Option lists */}
            <div className="space-y-2">
              {dailyQuiz.options.map((option, idx) => {
                const isSelected = selectedQuizOption === idx;
                const showSuccess = quizAnswered && option.correct;
                const showFailure = quizAnswered && isSelected && !option.correct;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={quizAnswered}
                    onClick={() => handleQuizOption(idx, option.correct)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      showSuccess
                        ? "bg-green-500/15 border-green-500 text-green-300"
                        : showFailure
                        ? "bg-pink-500/15 border-pink-500 text-pink-300"
                        : isSelected
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <span>{option.text}</span>
                    {quizAnswered && option.correct && (
                      <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-black font-display shrink-0">CORRECT</span>
                    )}
                    {quizAnswered && isSelected && !option.correct && (
                      <span className="text-xs bg-pink-500 text-black px-2 py-0.5 rounded font-black font-display shrink-0">WRONG</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            <AnimatePresence>
              {quizAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-slate-800/80"
                >
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong>Fact:</strong> {dailyQuiz.explanation}
                  </p>
                  
                  <button
                    onClick={() => onAskCosmo(`Why is Jupiter's Great Red Spot storm so huge and how has it survived for hundreds of years? Explain with everyday analogies!`)}
                    className="mt-3 py-1.5 px-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    🤖 Let's ask Cosmo to expand on this storm!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Right Column: Live Feed Components (APOD + Asteroids) (4/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* We embed the NasaExplorer component here */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider mb-1 ml-1">
              📡 NASA Real-time Feeds:
            </span>
            {nasaApodComponent}
          </div>

          {/* Space Safety Status Card */}
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono block mb-2">
              Earth Shield Monitor
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center text-xl animate-pulse">
                🛡️
              </div>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm font-display">
                  Orbit Trajectory Shield: Nominal
                </h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-normal">
                  All planetary transit systems are cleared. No large impact hazards detected in near-space grids for the next 48 hours.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

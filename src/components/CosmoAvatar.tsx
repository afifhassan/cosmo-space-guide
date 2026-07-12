import React from "react";
import { motion } from "motion/react";

interface CosmoAvatarProps {
  state: "idle" | "thinking" | "talking" | "happy";
}

export default function CosmoAvatar({ state }: CosmoAvatarProps) {
  // Define sub-animations or visual indicators based on Cosmo's mood
  const isThinking = state === "thinking";
  const isTalking = state === "talking";
  const isHappy = state === "happy";

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Saturn-like Ring */}
      <motion.div
        className="absolute w-44 h-16 border-4 border-indigo-400/20 rounded-full pointer-events-none"
        style={{ transform: "rotate(-15deg)" }}
        animate={{
          rotate: isThinking ? 345 : [-15, -12, -15],
          scale: isHappy ? 1.1 : 1.0,
        }}
        transition={{
          rotate: isThinking ? { repeat: Infinity, duration: 4, ease: "linear" } : { repeat: Infinity, duration: 3, ease: "easeInOut" },
          scale: { duration: 0.3 }
        }}
      />

      {/* Orbiting Tiny Moon */}
      <motion.div
        className="absolute w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_8px_#fde047]"
        animate={{
          x: [60, -60, 60],
          y: [-15, 15, -15],
          zIndex: [10, -10, 10]
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 2 : 4,
          ease: "easeInOut",
        }}
      />

      {/* Main Helmet Body */}
      <motion.div
        className="relative w-28 h-28 bg-slate-900 rounded-[2rem] border-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center overflow-hidden"
        animate={{
          y: isThinking ? [0, -4, 0] : isHappy ? [0, -12, 0] : [0, -6, 0],
          scale: isHappy ? [1, 1.05, 1] : 1,
        }}
        transition={{
          repeat: isThinking || state === "idle" ? Infinity : isHappy ? 1 : 0,
          duration: isThinking ? 0.8 : isHappy ? 0.4 : 2,
          ease: "easeInOut",
        }}
      >
        {/* Visor Screen with Stars */}
        <div className="absolute inset-1 bg-slate-950 rounded-[1.8rem] flex flex-col items-center justify-center p-3">
          {/* Constellation lines or background glow */}
          <div className="absolute inset-0 bg-radial-gradient from-indigo-900/40 via-transparent to-transparent pointer-events-none" />

          {/* Twinkling background star SVGs */}
          <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-twinkle" />
          <div className="absolute bottom-3 right-4 w-2 h-2 bg-indigo-300/30 rounded-full animate-twinkle" />

          {/* Eyes Panel */}
          <div className="flex gap-4 mb-2 z-10">
            {/* Left Eye */}
            <motion.div
              className="w-3 h-5 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]"
              animate={
                isThinking
                  ? {
                      scaleY: [1, 0.2, 1],
                      x: [-2, 2, -2],
                    }
                  : isHappy
                  ? {
                      scaleY: 1,
                      borderRadius: ["50%", "10% 90% 10% 9%"],
                      rotate: [0, -10, 0]
                    }
                  : {
                      scaleY: [1, 1, 0.1, 1, 1], // Natural blinks
                    }
              }
              transition={{
                duration: isThinking ? 1.2 : isHappy ? 0.3 : 3.5,
                repeat: Infinity,
                repeatDelay: isThinking ? 0 : 2,
              }}
            />

            {/* Right Eye */}
            <motion.div
              className="w-3 h-5 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]"
              animate={
                isThinking
                  ? {
                      scaleY: [1, 0.2, 1],
                      x: [-2, 2, -2],
                    }
                  : isHappy
                  ? {
                      scaleY: 1,
                      borderRadius: ["50%", "90% 10% 9% 10%"],
                      rotate: [0, 10, 0]
                    }
                  : {
                      scaleY: [1, 1, 0.1, 1, 1],
                    }
              }
              transition={{
                duration: isThinking ? 1.2 : isHappy ? 0.3 : 3.5,
                repeat: Infinity,
                repeatDelay: isThinking ? 0 : 2.2,
              }}
            />
          </div>

          {/* Mouth/Speech Wave */}
          <div className="h-4 flex items-center justify-center z-10">
            {isTalking ? (
              // Talking waves
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full"
                    animate={{
                      height: [4, 14, 4],
                    }}
                    transition={{
                      duration: 0.3 + i * 0.05,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            ) : isHappy ? (
              // Happy smile
              <motion.div
                className="w-6 h-3 border-b-4 border-indigo-400 rounded-b-full"
                initial={{ scaleY: 0.1 }}
                animate={{ scaleY: 1 }}
              />
            ) : isThinking ? (
              // Thinking dot wave or straight line
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-yellow-300 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            ) : (
              // Idle smile
              <div className="w-5 h-2.5 border-b-2 border-indigo-400/80 rounded-b-full" />
            )}
          </div>
        </div>

        {/* Glossy Reflection Over Visor */}
        <div className="absolute top-1 left-2 w-12 h-6 bg-white/10 rounded-full blur-[1px] rotate-[-20deg]" />
      </motion.div>

      {/* Antenna with pulsing beacon */}
      <div className="absolute top-0 w-1.5 h-6 bg-slate-800 rounded-full flex flex-col items-center">
        <motion.div
          className="w-3.5 h-3.5 bg-cyan-400 rounded-full -mt-2.5 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          animate={{
            scale: isThinking ? [1, 1.4, 1] : [1, 1.15, 1],
            opacity: isThinking ? [0.6, 1, 0.6] : [0.7, 1, 0.7],
          }}
          transition={{
            duration: isThinking ? 0.5 : 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Base Badge */}
      <div className="mt-4 px-3 py-1 bg-slate-900 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300 shadow-md">
        COSMO
      </div>
    </div>
  );
}

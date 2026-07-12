import React, { useState, useEffect } from "react";
import { NasaApodData, NearEarthObject, NasaAsteroidsData } from "../types";
import { 
  Image as ImageIcon, 
  Orbit, 
  ShieldAlert, 
  ShieldCheck, 
  Gauge, 
  Ruler, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageSquare, 
  Info,
  ExternalLink,
  Loader
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playStellarChime, playRobotBeep } from "./AudioSynthesizer";

interface NasaExplorerProps {
  onAskCosmo: (question: string) => void;
  soundEnabled: boolean;
}

export default function NasaExplorer({ onAskCosmo, soundEnabled }: NasaExplorerProps) {
  // APOD State
  const [apodData, setApodData] = useState<NasaApodData | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [apodError, setApodError] = useState<string | null>(null);
  const [showApodExplanation, setShowApodExplanation] = useState(false);

  // Asteroids State
  const [asteroids, setAsteroids] = useState<NearEarthObject[]>([]);
  const [asteroidsCount, setAsteroidsCount] = useState(0);
  const [asteroidsLoading, setAsteroidsLoading] = useState(true);
  const [asteroidsError, setAsteroidsError] = useState<string | null>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NearEarthObject | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"apod" | "asteroids">("apod");

  useEffect(() => {
    // Fetch NASA APOD
    const fetchApod = async () => {
      try {
        const res = await fetch("/api/nasa/apod");
        if (!res.ok) throw new Error("Could not load APOD from server");
        const data = await res.json();
        setApodData(data);
      } catch (err: any) {
        console.error(err);
        setApodError("Could not download today's space picture.");
      } finally {
        setApodLoading(false);
      }
    };

    // Fetch NASA Asteroids (NeoWs)
    const fetchAsteroids = async () => {
      try {
        const res = await fetch("/api/nasa/asteroids");
        if (!res.ok) throw new Error("Could not load Asteroids from server");
        const data: NasaAsteroidsData = await res.json();
        
        // Extract all asteroids from different dates
        const dates = Object.keys(data.near_earth_objects || {});
        let allAsteroids: NearEarthObject[] = [];
        dates.forEach((d) => {
          allAsteroids = [...allAsteroids, ...data.near_earth_objects[d]];
        });

        // Sort by closest approach miss distance or just take them
        setAsteroids(allAsteroids.slice(0, 10)); // Take top 10 closest/most relevant
        setAsteroidsCount(data.element_count || allAsteroids.length);
        if (allAsteroids.length > 0) {
          setSelectedAsteroid(allAsteroids[0]);
        }
      } catch (err: any) {
        console.error(err);
        setAsteroidsError("Could not retrieve asteroid data.");
      } finally {
        setAsteroidsLoading(false);
      }
    };

    fetchApod();
    fetchAsteroids();
  }, []);

  const handleTabChange = (tab: "apod" | "asteroids") => {
    setActiveTab(tab);
    if (soundEnabled) {
      playRobotBeep();
    }
  };

  const handleSelectAsteroid = (ast: NearEarthObject) => {
    setSelectedAsteroid(ast);
    if (soundEnabled) {
      playStellarChime();
    }
  };

  // Helper to convert meters to kid-friendly analogies
  const getAsteroidSizeAnalogy = (minMeters: number, maxMeters: number) => {
    const avg = (minMeters + maxMeters) / 2;
    if (avg < 10) {
      return `about the size of a standard family car 🚗. It is relatively tiny!`;
    } else if (avg < 30) {
      return `about the size of a double-decker bus 🚌. It could easily fit in a school gym!`;
    } else if (avg < 80) {
      return `as wide as a full commercial airplane ✈️! Imagine that flying through deep space!`;
    } else if (avg < 150) {
      return `longer than a whole football field 🏈. That's a massive pile of cosmic rock!`;
    } else if (avg < 400) {
      return `as tall as the Empire State Building 🏢! It is a truly giant cosmic mountain!`;
    } else {
      return `as wide as 5 Eiffel Towers stacked back-to-back 🗼! That is a monumental space wanderer!`;
    }
  };

  // Helper to convert speed to kid-friendly analogies
  const getAsteroidSpeedAnalogy = (kmsString: string) => {
    const kms = parseFloat(kmsString);
    if (isNaN(kms)) return "flying ultra fast!";
    
    // speed comparison (e.g. from New York to Washington, DC in seconds)
    const mph = kms * 2236.94; // km/s to mph
    if (kms > 15) {
      return `zipping at ${kms.toFixed(1)} km/s! That is fast enough to fly from New York City to Boston in only 15 seconds! ⚡`;
    } else {
      return `speeding at ${kms.toFixed(1)} km/s! That's faster than a rifle bullet, capable of circling Earth in less than an hour! 🛸`;
    }
  };

  const handleAskAboutApod = () => {
    if (!apodData) return;
    onAskCosmo(`Explain today's NASA Astronomy Picture of the Day titled "${apodData.title}". The description says: ${apodData.explanation}`);
  };

  const handleAskAboutAsteroid = () => {
    if (!selectedAsteroid) return;
    const speed = selectedAsteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || "unknown";
    const missDistance = selectedAsteroid.close_approach_data[0]?.miss_distance.kilometers || "unknown";
    const hazardous = selectedAsteroid.is_potentially_hazardous_asteroid ? "YES" : "NO";
    const size = `${selectedAsteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(1)}m to ${selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}m`;

    onAskCosmo(`Tell me about the Asteroid named "${selectedAsteroid.name}". Its diameter is ${size}, its velocity is ${speed} km/s, and it misses Earth by ${parseFloat(missDistance).toLocaleString()} kilometers. Is it hazardous? NASA says: ${hazardous}. Provide a detailed and rigorous scientific overview of this asteroid's trajectory and physical properties with an intuitive size comparison.`);
  };

  return (
    <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="bg-indigo-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-widest font-display">
            Live NASA Feed
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5 flex items-center gap-2">
            <Orbit className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            NASA Space Observatory
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleTabChange("apod")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${
              activeTab === "apod"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Picture of the Day
          </button>
          <button
            onClick={() => handleTabChange("asteroids")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${
              activeTab === "asteroids"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            Asteroid Tracker
          </button>
        </div>
      </div>

      {/* TAB CONTENT: APOD */}
      {activeTab === "apod" && (
        <div className="space-y-4">
          {apodLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
              <span className="text-xs font-mono">Receiving cosmic images from NASA satellite...</span>
            </div>
          ) : apodError || !apodData ? (
            <div className="bg-slate-950/50 border border-red-500/20 rounded-2xl p-6 text-center text-slate-300 text-xs">
              ⚠️ {apodError || "NASA Astronomy Picture is offline. Check back later!"}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Media Display */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                {apodData.media_type === "image" ? (
                  <img
                    src={apodData.url}
                    alt={apodData.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-56 md:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <iframe
                    src={apodData.url}
                    title={apodData.title}
                    className="w-full h-56 md:h-64 rounded-2xl"
                    allowFullScreen
                  />
                )}
                
                {/* Title badge overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                      NASA APOD • {apodData.date}
                    </span>
                    <h3 className="text-white font-bold text-sm md:text-base font-display mt-0.5 leading-snug">
                      {apodData.title}
                    </h3>
                  </div>

                  {apodData.copyright && (
                    <span className="text-[9px] text-slate-400 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/50 shrink-0">
                      © {apodData.copyright.replace(/\n/g, "")}
                    </span>
                  )}
                </div>
              </div>

              {/* Informative Explanation */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-mono text-slate-400 block font-bold">Official NASA Description:</span>
                  <button
                    onClick={() => setShowApodExplanation(!showApodExplanation)}
                    className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {showApodExplanation ? (
                      <>Hide details <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Read full description <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>

                <p className={`text-slate-300 text-xs md:text-sm leading-relaxed ${showApodExplanation ? "" : "line-clamp-2"}`}>
                  {apodData.explanation}
                </p>

                {/* Cosmo Assistant prompt shortcut */}
                <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/30 flex items-center justify-center text-[10px]">
                      🤖
                    </div>
                    <span className="text-xs text-indigo-200">
                      Want a conceptual breakdown of this picture?
                    </span>
                  </div>
                  <button
                    onClick={handleAskAboutApod}
                    className="py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Deconstruct with COSMO AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ASTEROIDS */}
      {activeTab === "asteroids" && (
        <div className="space-y-4">
          {asteroidsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
              <span className="text-xs font-mono">Querying NASA JPL Near-Earth Radar...</span>
            </div>
          ) : asteroidsError || asteroids.length === 0 ? (
            <div className="bg-slate-950/50 border border-red-500/20 rounded-2xl p-6 text-center text-slate-300 text-xs">
              ⚠️ {asteroidsError || "No close-approach asteroids logged for today. Earth is safe!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Left Selector List */}
              <div className="md:col-span-5 space-y-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase font-bold">
                  Asteroids Near Us Today ({asteroidsCount}):
                </span>
                {asteroids.map((ast) => {
                  const isHazardous = ast.is_potentially_hazardous_asteroid;
                  const isSelected = selectedAsteroid?.id === ast.id;
                  return (
                    <button
                      key={ast.id}
                      onClick={() => handleSelectAsteroid(ast)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-bold font-display text-xs truncate flex items-center gap-1">
                          ☄️ {ast.name.replace(/[\(\)]/g, "")}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          Size: {ast.estimated_diameter.meters.estimated_diameter_min.toFixed(0)} - {ast.estimated_diameter.meters.estimated_diameter_max.toFixed(0)}m
                        </div>
                      </div>

                      {isHazardous ? (
                        <span className="p-1 bg-pink-500/20 text-pink-400 rounded-lg border border-pink-500/30 text-[9px] font-mono font-bold shrink-0 flex items-center gap-0.5" title="Potentially Hazardous">
                          <ShieldAlert className="w-3 h-3" />
                          ALERT
                        </span>
                      ) : (
                        <span className="p-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 text-[9px] font-mono shrink-0 flex items-center gap-0.5" title="Safe Transit">
                          <ShieldCheck className="w-3 h-3" />
                          SAFE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Detail Card */}
              {selectedAsteroid && (
                <div className="md:col-span-7 bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 flex flex-col justify-between min-h-[280px]">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3 border-b border-slate-800/60 pb-2">
                      <div>
                        <h3 className="text-white font-bold text-sm md:text-base font-display">
                          Asteroid {selectedAsteroid.name.replace(/[\(\)]/g, "")}
                        </h3>
                        <a
                          href={selectedAsteroid.nasa_jpl_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-cyan-400 hover:underline flex items-center gap-0.5 mt-0.5 font-mono"
                        >
                          Official NASA JPL Orbit Catalog <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      
                      {selectedAsteroid.is_potentially_hazardous_asteroid ? (
                        <div className="px-2.5 py-0.5 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-full text-[10px] font-bold font-mono">
                          Hazard Risk: High
                        </div>
                      ) : (
                        <div className="px-2.5 py-0.5 bg-green-500/15 border border-green-500/25 text-green-400 rounded-full text-[10px] font-mono">
                          Hazard Risk: Safe
                        </div>
                      )}
                    </div>

                    {/* Scientific stats list */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-slate-400 font-mono">DIAMETER</p>
                          <p className="font-bold font-display text-[11px]">
                            {selectedAsteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)} - {selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m
                          </p>
                        </div>
                      </div>

                      <div className="p-2 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-slate-400 font-mono">VELOCITY</p>
                          <p className="font-bold font-display text-[11px]">
                            {parseFloat(selectedAsteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || "0").toFixed(1)} km/s
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analogy Box */}
                    <div className="space-y-2 mb-4 bg-indigo-600/10 border-l-4 border-indigo-500 p-2.5 rounded-r-xl">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span className="text-[10px] font-bold text-white uppercase font-display">COSMO Cognitive Analogy</span>
                      </div>
                      <p className="text-xs text-indigo-200 leading-relaxed">
                        This rock is{" "}
                        <strong>
                          {getAsteroidSizeAnalogy(
                            selectedAsteroid.estimated_diameter.meters.estimated_diameter_min,
                            selectedAsteroid.estimated_diameter.meters.estimated_diameter_max
                          )}
                        </strong>{" "}
                        It is currently{" "}
                        {getAsteroidSpeedAnalogy(
                          selectedAsteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || "0"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Ask Cosmo more */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Miss distance: {parseFloat(selectedAsteroid.close_approach_data[0]?.miss_distance.kilometers || "0").toLocaleString(undefined, { maximumFractionDigits: 0 })} km
                    </span>
                    <button
                      onClick={handleAskAboutAsteroid}
                      className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-indigo-600/10"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Ask COSMO to expand!
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}

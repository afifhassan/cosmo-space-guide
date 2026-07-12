import React, { useState, useEffect } from "react";
import { SPACE_SECTORS, SpaceSector, SpaceTopic } from "../data/categories";
import { 
  Globe, 
  Compass, 
  Atom, 
  Rocket, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  MessageSquare,
  ArrowLeft,
  Search,
  Orbit,
  Loader
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playStellarChime, playRobotBeep } from "./AudioSynthesizer";

interface ExploreSpaceProps {
  onAskCosmo: (question: string) => void;
  soundEnabled: boolean;
  planetMonitorComponent: React.ReactNode; // Embed the planet monitor here for maximum space exploration excitement!
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
}

export default function ExploreSpace({ 
  onAskCosmo, 
  soundEnabled, 
  planetMonitorComponent,
  initialSearchQuery = "",
  onClearInitialSearch
}: ExploreSpaceProps) {
  const [selectedSector, setSelectedSector] = useState<SpaceSector>(SPACE_SECTORS[0]);
  const [selectedTopic, setSelectedTopic] = useState<SpaceTopic>(SPACE_SECTORS[0].topics[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // NASA API States
  const [nasaResults, setNasaResults] = useState<any[]>([]);
  const [isNasaLoading, setIsNasaLoading] = useState(false);
  const [nasaError, setNasaError] = useState<string | null>(null);

  // Synchronize search query from global header search
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      onClearInitialSearch?.();
    }
  }, [initialSearchQuery, onClearInitialSearch]);

  // Debounced search fetch from NASA Image and Video Library
  useEffect(() => {
    if (!searchQuery.trim()) {
      setNasaResults([]);
      setNasaError(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsNasaLoading(true);
      setNasaError(null);
      try {
        const response = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image`
        );
        if (!response.ok) {
          throw new Error("Failed to communicate with NASA database.");
        }
        const data = await response.json();
        // Extract top 8 relevant results
        const items = data.collection?.items?.slice(0, 8) || [];
        setNasaResults(items);
      } catch (err: any) {
        console.error("NASA API Search Error:", err);
        setNasaError("NASA Search is currently offline or congested. Try again shortly!");
      } finally {
        setIsNasaLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSectorChange = (sector: SpaceSector) => {
    setSelectedSector(sector);
    setSelectedTopic(sector.topics[0]);
    if (soundEnabled) {
      playRobotBeep();
    }
  };

  const handleTopicChange = (topic: SpaceTopic) => {
    setSelectedTopic(topic);
    if (soundEnabled) {
      playStellarChime();
    }
  };

  const handleAskCosmoAboutTopic = (topic: SpaceTopic) => {
    onAskCosmo(`Explain the topic "${topic.name}" from the "${selectedSector.title}" category. Its scientific summary is: ${topic.scientificDetail}. Provide an intuitive conceptual analogy and a synthesis of the physical mechanisms behind it.`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevent infinite fallback loops
    e.currentTarget.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"; // Premium real-space fallback image
  };

  // Icon mapping
  const renderSectorIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return <Globe className="w-4 h-4" />;
      case "Compass":
        return <Compass className="w-4 h-4" />;
      case "Atom":
        return <Atom className="w-4 h-4" />;
      case "Rocket":
        return <Rocket className="w-4 h-4" />;
      default:
        return <Orbit className="w-4 h-4" />;
    }
  };

  // Filter search across local sectors and topics
  const allSectorsWithFilteredTopics = SPACE_SECTORS.map((sector) => {
    const filtered = sector.topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.scientificDetail.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...sector, filteredTopics: filtered };
  });

  const isSearching = searchQuery.trim().length > 0;

  // Render search results from official NASA library
  const renderNasaSearchResult = (item: any) => {
    const data = item.data?.[0] || {};
    const link = item.links?.[0] || {};
    const title = data.title || "NASA Cosmic Record";
    const rawDescription = data.description || "Official NASA photographic log or cosmic capture.";
    // Clean description from html tags or weird spacing
    const description = rawDescription.replace(/<[^>]*>/g, '').trim();
    const nasaId = data.nasa_id;
    const dateCreated = data.date_created;
    const center = data.center;
    const imageUrl = link.href || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";

    return (
      <button
        key={nasaId}
        onClick={() => {
          // Generate a full, compatible SpaceTopic on-the-fly
          const nasatopic: SpaceTopic = {
            id: `nasa-${nasaId}`,
            name: title,
            emoji: "🔭",
            summary: description.length > 160 ? description.substring(0, 160) + "..." : description,
            scientificDetail: description,
            analogy: `This cosmic event or system was observed by NASA's astronomical telescopes and cataloged under ID ${nasaId} at ${center || 'NASA'}. It is a real and awe-inspiring structure of our physics-bound universe.`,
            keyFacts: [
              `NASA Archive ID: ${nasaId}`,
              `Creation/Observation Date: ${dateCreated ? new Date(dateCreated).toLocaleDateString() : 'N/A'}`,
              `NASA Operations Center: ${center || 'Joint Astronomy Center'}`
            ],
            imageUrl: imageUrl
          };

          const nasaSector: SpaceSector = {
            id: "nasa-archive",
            title: "NASA Live Database",
            iconName: "Search",
            description: "Direct real-time scientific telemetry from NASA's digital assets repository.",
            colorClass: "from-blue-600 to-indigo-900",
            topics: [nasatopic]
          };

          setSelectedSector(nasaSector);
          setSelectedTopic(nasatopic);
          setSearchQuery(""); // Clear search to load the topic detail view
          if (soundEnabled) playStellarChime();
        }}
        className="w-full p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all cursor-pointer flex gap-3.5 items-start group"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative">
          <img
            src={imageUrl}
            alt={title}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white font-display text-xs sm:text-sm truncate group-hover:text-cyan-300 transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] uppercase font-bold text-cyan-400 font-mono tracking-wider">
              NASA Official Capture
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              ID: {nasaId}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border-2 border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="bg-indigo-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-widest font-display">
              Astronomy Sector Directory
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-1.5">
              Explore the Cosmos
            </h2>
            <p className="text-xs text-indigo-200 mt-1">
              Select any cosmic sector, celestial object, space flight system, or deep space phenomenon below to analyze detailed physical data.
            </p>
          </div>

          {/* Clean Search Input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search celestial topics or NASA archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS OR STANDARD VIEW */}
      {isSearching ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSearchQuery("")}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white font-semibold transition-all cursor-pointer bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sectors
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Query: <strong className="text-indigo-300">"{searchQuery}"</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* COLUMN 1: INTERACTIVE DIRECTORY MATCHES (5/12) */}
            <div className="xl:col-span-5 bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl space-y-4 backdrop-blur-md">
              <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                Cosmo Directory Matches ({allSectorsWithFilteredTopics.map(s => s.filteredTopics.length).reduce((a, b) => a + b, 0)})
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {allSectorsWithFilteredTopics.map((sector) => 
                  sector.filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedSector(sector);
                        setSelectedTopic(topic);
                        setSearchQuery("");
                        if (soundEnabled) playStellarChime();
                      }}
                      className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 text-left transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <span className="text-xl p-1.5 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
                        {topic.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white font-display text-xs sm:text-sm group-hover:text-indigo-400 transition-colors truncate">
                          {topic.name}
                        </h4>
                        <span className="text-[9px] uppercase font-bold text-indigo-400/80 font-mono tracking-wider">
                          {sector.title}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 shrink-0" />
                    </button>
                  ))
                ).flat()}

                {allSectorsWithFilteredTopics.every(s => s.filteredTopics.length === 0) && (
                  <div className="py-12 text-center text-slate-500 text-xs font-sans">
                    👽 No directory matches found. Enter words like 'Sun', 'Black Hole' or 'Exoplanet'.
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: NASA OFFICIAL ARCHIVE (7/12) */}
            <div className="xl:col-span-7 bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl space-y-4 backdrop-blur-md">
              <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  NASA Official Archive Search ({nasaResults.length})
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Live HTTP API
                </span>
              </h3>

              {isNasaLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3">
                  <Loader className="w-8 h-8 animate-spin text-cyan-400" />
                  <span className="text-xs text-cyan-300 font-mono">Querying NASA Digital Repository...</span>
                </div>
              ) : nasaError ? (
                <div className="py-20 text-center text-amber-300 text-xs font-mono bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
                  ⚠️ {nasaError}
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {nasaResults.map((item) => renderNasaSearchResult(item))}

                  {nasaResults.length === 0 && (
                    <div className="py-24 text-center text-slate-500 text-xs font-sans">
                      🔭 No records found in the NASA database. Try simple search queries like "Hubble", "Apollo", "Curiosity", "Earth", or "Nebula"!
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Sector list and Topic list (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Sector Tabs list */}
            <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-4 shadow-2xl backdrop-blur-md">
              <span className="text-[9px] font-mono text-slate-400 block mb-2.5 uppercase font-bold tracking-wider">
                1. Select Sector:
              </span>
              <div className="space-y-1.5">
                {SPACE_SECTORS.map((sector) => {
                  const isSelected = selectedSector.id === sector.id;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => handleSectorChange(sector)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border ${
                          isSelected ? "bg-indigo-500/20 border-indigo-400 text-[#fbbf24]" : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}>
                          {renderSectorIcon(sector.iconName)}
                        </div>
                        <span className="font-bold font-display text-xs">
                          {sector.title}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic List within selected Sector */}
            <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-4 shadow-2xl backdrop-blur-md">
              <span className="text-[9px] font-mono text-slate-400 block mb-2.5 uppercase font-bold tracking-wider">
                2. Pick Topic matter:
              </span>
              <div className="space-y-1.5">
                {selectedSector.topics.map((topic) => {
                  const isSelected = selectedTopic.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicChange(topic)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-400 text-white"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-lg shrink-0">{topic.emoji}</span>
                      <span className="font-semibold text-xs leading-tight truncate">
                        {topic.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Detailed Topic Fact Sheet (8/12) */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[460px] flex flex-col justify-between">
              
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-5 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                      {selectedTopic.emoji}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 font-mono block">
                        {selectedSector.title} Matter
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                        {selectedTopic.name}
                      </h3>
                    </div>
                  </div>
                  
                  <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-slate-400">
                    Topic Ref: #{selectedTopic.id}
                  </span>
                </div>

                {/* Topic Widescreen Real Space Image */}
                {selectedTopic.imageUrl && (
                  <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden mb-5 border border-slate-800 shadow-inner group bg-slate-950">
                    <img
                      src={selectedTopic.imageUrl}
                      alt={selectedTopic.name}
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Main summaries */}
                <p className="text-slate-300 font-medium text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{selectedTopic.summary}"
                </p>

                {/* Professional science fact details */}
                <div className="mb-5 bg-slate-950/60 rounded-2xl p-4.5 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                      Astronomical Data Feed
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedTopic.scientificDetail}
                  </p>
                </div>

                {/* Dynamic Conceptual Analogy Translation */}
                <div className="mb-5 bg-indigo-600/10 border-l-4 border-indigo-500 p-4 rounded-r-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#fbbf24] animate-spin-slow" />
                    <span className="text-[11px] font-bold text-white uppercase font-display tracking-wide">
                      COSMO Conceptual Analogy
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    {selectedTopic.analogy}
                  </p>
                </div>

                {/* Bullet facts list */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
                    Fascinating Fast Facts:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTopic.keyFacts.map((fact, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Cosmo chat shortcuts */}
              <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    Curious for more? Ask our AI guide!
                  </span>
                </div>
                
                <button
                  onClick={() => handleAskCosmoAboutTopic(selectedTopic)}
                  className="w-full sm:w-auto py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask Cosmo to expand on this topic!
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Embedded planet monitor widget at the bottom of the Explore view */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider ml-1">
          🌌 Celestial Monitor Laboratory:
        </span>
        {planetMonitorComponent}
      </div>

    </div>
  );
}

export interface Message {
  id: string;
  sender: "user" | "cosmo" | "system";
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  rigorLevel: "explorer" | "academic";
}

export interface PresetQuestion {
  label: string;
  question: string;
  iconName: string;
}

export interface HeavyTextSample {
  title: string;
  source: string;
  topic: string;
  text: string;
}

export interface SpaceFact {
  id: string;
  fact: string;
  topic: string;
  funLabel: string;
}

export interface NasaApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  date: string;
  copyright?: string;
}

export interface NearEarthObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }[];
}

export interface NasaAsteroidsData {
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

export const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    label: "Mars Red Planet",
    question: "Why is Mars red?",
    iconName: "Flame",
  },
  {
    label: "Black Hole Suction",
    question: "What happens if you fall into a black hole?",
    iconName: "Atom",
  },
  {
    label: "Life on Exoplanets",
    question: "Are there aliens on other planets?",
    iconName: "User",
  },
  {
    label: "Rocket Propulsion",
    question: "How does a rocket fly in space if there is no air?",
    iconName: "Rocket",
  },
  {
    label: "Universe Scale",
    question: "How big is the universe?",
    iconName: "Globe",
  },
];

export const HEAVY_TEXT_SAMPLES: HeavyTextSample[] = [
  {
    title: "Black Hole Spacetime Singularity",
    source: "NASA Astrophysics Guide",
    topic: "Black Holes",
    text: "Gravitational collapse occurs when an astronomical object's internal pressure is insufficient to resist its own gravity, culminating in the formation of a spacetime singularity known as a black hole. Within the Schwarzschild radius, the escape velocity of the gravitational field exceeds the speed of light, rendering electromagnetic radiation unable to propagate outwards, creating an absolute event horizon.",
  },
  {
    title: "Circumstellar Habitable Zones",
    source: "Kepler Mission Paper",
    topic: "Exoplanets",
    text: "Stellar habitable zones represent the orbital region around a star where atmospheric pressure can support liquid water on a terrestrial planet's surface. Detection methods including transit photometry and radial velocity measurements seek to identify Earth-analog exoplanets within these circumstellar limits, analyzing spectral biosignatures in the planetary transmission spectrum.",
  },
  {
    title: "Core-Collapse Stellar Supernovae",
    source: "JPL Nucleosynthesis Study",
    topic: "Stars",
    text: "A Type II supernova is characterized by the rapid and violent nucleosynthetic collapse of a massive star's iron core. This core collapse leads to an outgoing shock wave that photodisintegrates heavy nuclei and drives cosmic nucleosynthesis, expelling the outer stellar envelope into the interstellar medium and leaving behind a neutron star or black hole remnant.",
  },
  {
    title: "Gravitational Lensing & Dark Matter",
    source: "Hubble Telescope Observation Logs",
    topic: "Dark Matter",
    text: "Dark matter is a hypothetical form of matter that does not interact with electromagnetic radiation, making it completely invisible to standard telescope instruments. Its gravitational influence, however, is observed via galactic rotation curves, gravitational lensing, and the cosmic microwave background power spectrum, comprising roughly 27% of the mass-energy density of the universe.",
  },
];

export const SPACE_FACTS: SpaceFact[] = [
  {
    id: "fact-1",
    fact: "One day on Venus is longer than one whole year on Venus! It spins backwards on its axis super slowly, taking 243 Earth days to rotate once, but only 225 Earth days to travel around the Sun.",
    topic: "Venus",
    funLabel: "🐢 The Slow Spinner",
  },
  {
    id: "fact-2",
    fact: "Space is completely silent because there is no air or atmosphere for sound waves to travel through. Astronauts use special radios in their helmets to talk to each other!",
    topic: "Deep Space",
    funLabel: "🤫 Silent Universe",
  },
  {
    id: "fact-3",
    fact: "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons on Earth! That is as heavy as Mount Everest!",
    topic: "Neutron Stars",
    funLabel: "🏋️‍♂️ Heavy Teaspoon",
  },
  {
    id: "fact-4",
    fact: "The footprints left by Apollo astronauts on the Moon will stay there for millions of years because the Moon has no atmosphere, which means there is absolutely no wind or rain to wash them away!",
    topic: "The Moon",
    funLabel: "👣 Everlasting Footprints",
  },
  {
    id: "fact-5",
    fact: "There are more trees on planet Earth (about 3 trillion!) than there are stars in our entire Milky Way galaxy (about 100 to 400 billion stars!). Earth is a very special forest planet!",
    topic: "Galaxy Scale",
    funLabel: "🌳 Tree Power",
  },
  {
    id: "fact-6",
    fact: "A sunset on Mars looks blue! Because Mars has very fine dust particles in its thin atmosphere, it lets blue light penetrate more efficiently than longer-wavelength red or yellow light.",
    topic: "Mars",
    funLabel: "💙 Martian Sunsets",
  },
];

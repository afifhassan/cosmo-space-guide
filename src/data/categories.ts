export interface SpaceTopic {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  scientificDetail: string;
  analogy: string;
  keyFacts: string[];
  imageUrl: string;
}

export interface SpaceSector {
  id: string;
  title: string;
  iconName: string;
  description: string;
  colorClass: string;
  topics: SpaceTopic[];
}

export const SPACE_SECTORS: SpaceSector[] = [
  {
    id: "solar-system",
    title: "Solar System",
    iconName: "Globe",
    description: "Our immediate cosmic neighborhood consisting of our central star, the Sun, and all objects bound to it by gravity.",
    colorClass: "from-amber-500 to-red-600",
    topics: [
      {
        id: "the-sun",
        name: "The Sun",
        emoji: "☀️",
        summary: "A massive, glowing ball of hot plasma at the heart of our solar system, driving all life and weather on Earth.",
        scientificDetail: "The Sun is a main-sequence G-type star comprising 99.8% of the total mass of the solar system. Nuclear fusion occurs in its core under intense temperatures (15 million °C) and pressures, fusing hydrogen nuclei to form helium, releasing colossal amounts of electromagnetic radiation.",
        analogy: "The Sun acts as a massive thermonuclear engine, fusing millions of tons of hydrogen every second and converting mass into light and heat energy that drives our biosphere.",
        keyFacts: [
          "Light emitted from the solar surface takes approximately 8 minutes and 20 seconds to traverse the 150 million km distance to Earth.",
          "The solar interior is so vast that approximately 1.3 million Earth-sized spheres could fit inside its volume.",
          "High-speed solar winds colliding with Earth's magnetosphere produce geomagnetic auroral displays near planetary poles."
        ],
        imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "jupiter-magnetosphere",
        name: "Jupiter's Magnetosphere & Storms",
        emoji: "🌀",
        summary: "A colossal, highly pressurized gas giant with the largest planetary magnetic shield and an anticyclonic storm active for centuries.",
        scientificDetail: "Jupiter's magnetosphere is the largest cohesive structure in the Solar System, extending up to 7 million kilometers towards the Sun and nearly to Saturn's orbit in the tail. The Great Red Spot is an anticyclonic storm 16,000 km wide, rotating counterclockwise with wind speeds exceeding 430 km/h.",
        analogy: "Jupiter's magnetic shield is like a colossal planetary bubble deflecting heavy solar radiation, while its Great Red Spot is a persistent planetary hurricane that could swallow Earth whole.",
        keyFacts: [
          "Jupiter's magnetic field is 14 times stronger than Earth's, trapping high-energy particles in intense, hazardous radiation belts.",
          "The Great Red Spot has been continuously observed since at least 1830, and possibly as early as 1665.",
          "Intense auroral glows at Jupiter's poles are powered by sulfur and oxygen ions emitted from its volcanically active moon, Io."
        ],
        imageUrl: "https://images.unsplash.com/photo-1630839437035-dac17da580d0?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "martian-geology",
        name: "Martian Geology & Rover Missions",
        emoji: "🤖",
        summary: "Automated robotic laboratories exploring ancient lakebeds and river deltas on Mars, searching for past biosignatures.",
        scientificDetail: "NASA's Perseverance and Curiosity rovers traverse Jezero and Gale craters, analyzing geological formations using Raman spectroscopy and laser-induced breakdown spectroscopy. These missions seek biosignatures in lacustrine and deltaic deposits from Mars' warmer, wetter past.",
        analogy: "Robotic rovers act as remote-controlled field geologists on a frozen desert world, drilling into ancient fossilized river muds to search for microscopic traces of past organic life.",
        keyFacts: [
          "Perseverance carries MOXIE, an experimental instrument that successfully extracted breathable oxygen from Mars' thin carbon dioxide atmosphere.",
          "Jezero Crater once held a deep lake fed by a river system roughly 3.7 billion years ago, representing a prime candidate for astrobiological preservation.",
          "Rovers use radioisotope thermoelectric generators (RTGs) fueled by Plutonium-238 to survive freezing Martian winters where temperatures drop to -125°C."
        ],
        imageUrl: "https://images.unsplash.com/photo-1612892483236-42d68a57623d?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "asteroid-belt",
        name: "Asteroid Belt",
        emoji: "☄️",
        summary: "A ring-shaped region between Mars and Jupiter filled with countless rocky and metallic bodies left over from the early solar system.",
        scientificDetail: "Located between 2.2 and 3.2 astronomical units (AU) from the Sun, the Asteroid Belt consists of millions of planetesimals that never coalesced into a planet due to the disruptive gravitational resonance of Jupiter.",
        analogy: "The Asteroid Belt is a collection of celestial building material frozen in time, prevented from consolidating into a single world by the immense tidal gravity of nearby Jupiter.",
        keyFacts: [
          "The largest object in the belt is Ceres, a spherical dwarf planet comprising nearly a third of the entire belt's mass.",
          "Despite having millions of individual objects, the combined mass of the Asteroid Belt is only 4% of our Moon's mass.",
          "Orbital spacing is vast, with millions of kilometers of empty space separating most large asteroids, making spacecraft transits highly safe."
        ],
        imageUrl: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "ice-giants",
        name: "The Outermost Ice Giants",
        emoji: "🔵",
        summary: "Uranus and Neptune, freezing-cold outer worlds made of heavy elements like water, ammonia, and methane ice.",
        scientificDetail: "Unlike the gas giants Jupiter and Saturn, Uranus and Neptune possess distinct rocky cores surrounded by a thick mantle of water, ammonia, and methane ices. Their atmospheres contain methane which absorbs red light, giving them their beautiful blue hues.",
        analogy: "Uranus and Neptune represent giant pressurized reservoirs of superheated, dense fluids containing high-concentration chemical ice compounds orbiting in the deep freeze of the outer solar system.",
        keyFacts: [
          "Uranus exhibits an extreme axial tilt of 97.77 degrees, causing it to literally spin on its side relative to its orbital plane.",
          "Supersonic planetary winds on Neptune are the fastest recorded in the solar system, exceeding 2,100 kilometers per hour.",
          "Extreme gravitational pressures deep inside these planets' mantles are hypothesized to precipitate solid diamond rain."
        ],
        imageUrl: "https://images.unsplash.com/photo-1545156521-77bd85671d30?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: "deep-space",
    title: "Deep Space & Galaxies",
    iconName: "Compass",
    description: "The vast regions of the universe extending far beyond our solar system, filled with stars, nebulae, and stellar graveyards.",
    colorClass: "from-indigo-500 to-pink-500",
    topics: [
      {
        id: "milky-way",
        name: "Milky Way Galaxy",
        emoji: "🌌",
        summary: "The colossal spiral city of stars, dust, and gas where our solar system resides, orbiting a supermassive black hole.",
        scientificDetail: "The Milky Way is a barred spiral galaxy estimated to contain 100 to 400 billion stars. It has a diameter of roughly 100,000 lightyears. Our solar system lies about 26,000 lightyears from the galactic core in the Orion Cygnus arm, orbiting the center at 220 km/s.",
        analogy: "The Milky Way operates like a giant galactic whirlpool city, revolving slowly across space-time while holding hundreds of billions of star systems in coordinated orbits.",
        keyFacts: [
          "It takes our Sun roughly 230 million years to complete a single orbital revolution around the galactic center.",
          "In approximately 4.5 billion years, the Milky Way is predicted to merge with the neighboring Andromeda Galaxy.",
          "A supermassive black hole named Sagittarius A*, with a mass equal to 4 million Suns, sits at the direct center of the galaxy."
        ],
        imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "stellar-nebulae",
        name: "Stellar Nebulae",
        emoji: "☁️",
        summary: "Gigantic clouds of gas and dust in space that serve as 'star nurseries' where new stars are born under gravity's pull.",
        scientificDetail: "Nebulae are interstellar clouds of hydrogen, helium, and cosmic dust. Emission nebulae are ionized by ultraviolet radiation from nearby hot young stars, while reflection nebulae simply scatter stellar light. Over millions of years, gravity pulls clumps of dust together to form protostars.",
        analogy: "A stellar nebula is a colossal chemical stellar incubator, where pockets of hydrogen collapse under their own gravity until nuclear fusion ignites new star systems.",
        keyFacts: [
          "The iconic 'Pillars of Creation' lie within the Eagle Nebula, located approximately 6,500 lightyears from Earth.",
          "These massive gas clouds are incredibly expansive, often stretching hundreds of lightyears in diameter.",
          "Supernova remnants ejected from ancient dying stars enrich nebulae with heavy elements necessary to form rocky planets."
        ],
        imageUrl: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "quasars-agn",
        name: "Active Galactic Nuclei & Quasars",
        emoji: "🌟",
        summary: "The brilliant, high-energy cores of distant galaxies powered by supermassive black holes feeding on surrounding gas.",
        scientificDetail: "Quasars are the extremely luminous nuclei of galaxies in the early universe. Friction in the rotating accretion disk surrounding a central supermassive black hole heats gas to millions of degrees, releasing immense electromagnetic radiation and launching relativistic plasma jets.",
        analogy: "A quasar behaves like a colossal gravity-powered engine, where matter falling into a black hole is heated so intensely that it outshines its entire host galaxy of billions of stars.",
        keyFacts: [
          "Quasars represent some of the most distant and energetic objects ever detected in the observable universe.",
          "Relativistic jets of charged particles can blast out of quasars at nearly the speed of light, extending over millions of lightyears.",
          "The energy output of a single quasar can be 1,000 times greater than the combined output of all stars in the Milky Way."
        ],
        imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "neutron-stars",
        name: "Neutron Stars & Pulsars",
        emoji: "💫",
        summary: "The collapsed, super-dense remnants of massive stars that spin ultra-fast and beam powerful radiation into the cosmos.",
        scientificDetail: "A neutron star is formed during a core-collapse supernova. It has a mass comparable to the Sun but a radius of only 10 km, composed almost entirely of neutrons. Pulsars are highly magnetized, rotating neutron stars that emit beams of electromagnetic radiation from their magnetic poles.",
        analogy: "A neutron star is an atomic nucleus compressed to planetary scale, packing the mass of an entire solar star into a diameter no wider than a city.",
        keyFacts: [
          "The density of neutron star matter is so extreme that a single cubic centimeter would weigh approximately 100 million tons on Earth.",
          "Pulsars spin at relativistic speeds, some completing up to 700 rotational cycles per second while emitting highly precise beams.",
          "Their magnetospheres generate magnetic fields trillions of times stronger than Earth's planetary magnetic field."
        ],
        imageUrl: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: "mysteries",
    title: "Cosmic Mysteries",
    iconName: "Atom",
    description: "The most baffling, invisible, and powerful phenomena in astrophysics that challenge our understanding of reality.",
    colorClass: "from-violet-600 to-indigo-900",
    topics: [
      {
        id: "black-holes",
        name: "Black Holes",
        emoji: "🕳️",
        summary: "Regions in space with gravity so extraordinarily strong that nothing, not even light, can escape their pull.",
        scientificDetail: "A black hole is formed when massive stars collapse at the end of their lifecycle. The boundary of no escape is the event horizon. At the core lies a singularity where mass is crushed into infinite density and space-time curvature becomes infinite.",
        analogy: "A black hole represents the ultimate gravitational trap in space-time—a point where gravity rises to infinity, dragging the coordinate system of space itself inside the event horizon.",
        keyFacts: [
          "The strong tidal forces near a black hole's boundary stretch falling objects in a vertical physical process called 'spaghettification'.",
          "According to Einstein's relativity, time slows down drastically for an observer approaching the event horizon relative to a distant observer.",
          "Astronomers image black holes by recording the high-temperature accretion disks of gas and dust spiraling around them."
        ],
        imageUrl: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "cosmic-background",
        name: "Cosmic Microwave Background (CMB)",
        emoji: "📡",
        summary: "The ancient fossilized radiation field left over from the birth of the universe, providing a snapshot of the cosmos at just 380,000 years old.",
        scientificDetail: "The Cosmic Microwave Background is the cooled remnant of the first light that could travel freely through the universe, a period called recombination. It exhibits a highly uniform thermal blackbody spectrum at 2.725 Kelvin with minute temperature fluctuations of one part in 100,000.",
        analogy: "The CMB is like the whisper of the Big Bang itself, a faint, ancient heat glow that fills every corner of space-time, acting as a cosmic baby picture of our universe.",
        keyFacts: [
          "The CMB was accidentally discovered in 1964 by radio astronomers Arno Penzias and Robert Wilson, earning them a Nobel Prize.",
          "The tiny temperature fluctuations in the CMB represent the primordial quantum density seeds that eventually grew into stars, galaxies, and galaxy clusters.",
          "When you see static noise on an old analog television or radio, about 1% of that interference is actual CMB radiation from the birth of time."
        ],
        imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "dark-matter",
        name: "Dark Matter & Dark Energy",
        emoji: "👻",
        summary: "The invisible framework and mysterious force that make up 95% of the universe, pulling galaxies together and pushing them apart.",
        scientificDetail: "Dark matter comprises about 27% of the universe's mass-energy density, acting as an invisible gravitational glue that holds galaxies together. Dark energy accounts for roughly 68% and acts as a repulsive force, accelerating the expansion of the universe.",
        analogy: "Dark matter acts as an invisible scaffolding that physically clusters galaxies, while dark energy behaves like a uniform cosmic pressure causing space-time to expand faster every second.",
        keyFacts: [
          "Baryonic matter (atoms, stars, gas, and all visible structures) accounts for a mere 5% of the universe's mass-energy budget.",
          "We detect dark matter indirectly by measuring how its massive gravity bends light around massive galaxy clusters (gravitational lensing).",
          "The true quantum or particle nature of dark matter and dark energy remains one of the greatest unresolved questions in physics."
        ],
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "wormholes",
        name: "Wormholes & Spacetime",
        emoji: "🌀",
        summary: "Theoretical shortcuts through the fabric of space and time that could allow near-instant travel across vast galactic distances.",
        scientificDetail: "Wormholes are hypothetical topological features of spacetime described by Einstein's field equations. A Lorentzian wormhole would act as a tunnel with two ends at different points in spacetime, requiring exotic negative-energy matter to keep the throat stable.",
        analogy: "A wormhole acts like a localized space-time fold, connecting two immensely remote physical coordinates in the universe through a sub-dimensional bridge or throat.",
        keyFacts: [
          "Initially theorized by Albert Einstein and Nathan Rosen in 1935, these tunnels are mathematically termed Einstein-Rosen bridges.",
          "If traversable wormholes exist, they could theoretically facilitate temporal displacement, serving as paths to the past or future.",
          "No physical wormholes have been observed; they currently remain an elegant solution to the field equations of general relativity."
        ],
        imageUrl: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: "rockets-tech",
    title: "Rockets & Spaceflight",
    iconName: "Rocket",
    description: "The incredible engineering and human-made machines that launch us beyond Earth to explore the cosmic ocean.",
    colorClass: "from-cyan-500 to-indigo-600",
    topics: [
      {
        id: "how-rockets-work",
        name: "How Rockets Fly",
        emoji: "🚀",
        summary: "Powerful machines that use action-and-reaction physics to lift payloads into orbit, flying with no air to push against.",
        scientificDetail: "Rockets operate under Newton's Third Law of Motion: every action has an equal and opposite reaction. Combustion of propellants creates high-pressure gas expelled from the nozzle, generating upward thrust that overcomes Earth's gravitational pull.",
        analogy: "A rocket generates motion by burning propellants at extremely high pressure and venting them downward, creating a reactive momentum vector that propels the spacecraft upward.",
        keyFacts: [
          "To achieve stable low Earth orbit, a launch vehicle must reach orbital velocity, which is roughly 28,000 kilometers per hour.",
          "Rockets carry their own chemical oxidizers because vacuum space contains no atmospheric oxygen to combust fuels.",
          "The legacy Saturn V rocket burned liquid oxygen and kerosene at an astonishing rate of 15 tons of fuel per second at lift-off."
        ],
        imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "reusable-boosters",
        name: "Reusable Boosters & Propulsive Landings",
        emoji: "🛰️",
        summary: "A major paradigm shift in space travel, where rocket boosters return through the atmosphere and land vertically on land or sea.",
        scientificDetail: "Reusable rockets perform boostback burns, entry burns, and landing burns using grid fins for aerodynamic steering and cold gas thrusters for attitude adjustment. This propulsive landing requires sub-second engine throttle changes to guide the booster back to a precise target.",
        analogy: "Landing an orbital rocket vertically is like launching a pencil over the Empire State Building in a windstorm, and making it land perfectly upright on its eraser on a floating platform at sea.",
        keyFacts: [
          "Reusability has slashed the launch costs of payload delivery to Low Earth Orbit by more than 50% over the last decade.",
          "Launch vehicles use supersonic retropropulsion to slow down as they descend through the increasingly dense atmosphere.",
          "Highly responsive on-board guidance computers calculate flight paths in real time, making thousands of micro-adjustments per second."
        ],
        imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "artemis-program",
        name: "Artemis Mission to the Moon",
        emoji: "🌙",
        summary: "NASA's modern program to land the first woman and first person of color on the Moon, building a permanent base camp.",
        scientificDetail: "The Artemis program utilizes NASA's Space Launch System (SLS) rocket and Orion spacecraft. The objective is to establish sustainable exploration on and around the Moon, culminating in the Lunar Gateway station and testing technologies for crewed missions to Mars.",
        analogy: "The Artemis program serves as an operational deep-space testbed on the Moon to perfect the life-support systems, robotics, and logistics necessary for future crewed Mars transit flights.",
        keyFacts: [
          "Artemis targets the lunar South Pole because the deep, permanently shadowed craters contain vital stores of water ice.",
          "The program will deploy the Gateway, a modular lunar-orbiting space station that acts as a communication hub and transit depot.",
          "This initiative marks humanity's first return to sustained crewed lunar surface exploration since the final Apollo 17 mission in 1972."
        ],
        imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "voyagers",
        name: "The Voyager Probes",
        emoji: "🛰️",
        summary: "Two twin spacecraft launched in 1977 that are now the farthest human-made objects, sailing through interstellar space.",
        scientificDetail: "Voyager 1 and 2 utilized a rare alignment of Jupiter, Saturn, Uranus, and Neptune to perform gravitational slingshots. Voyager 1 crossed the heliopause into interstellar space in 2012, followed by Voyager 2 in 2018. They are powered by radiothermal generators.",
        analogy: "The Voyager probes represent humanity's oldest active mechanical messengers, drifting through the vacuum of interstellar space carrying a cultural record of Earth's biosphere.",
        keyFacts: [
          "Each spacecraft carries a gold-plated copper phonograph record encoded with sounds, planetary images, and musical compositions.",
          "Voyager 1 has traversed past 24 billion kilometers from Earth, becoming the most distant human artifact in existence.",
          "Radio signals carrying telemetry data take over 22 hours to travel from Voyager 1 back to the Deep Space Network antennae."
        ],
        imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },
  {
    id: "astrobiology-exoplanets",
    title: "Exoplanets & Astrobiology",
    iconName: "Orbit",
    description: "The search for Earth-analog exoplanets, liquid water zones, and biosignatures in our galaxy.",
    colorClass: "from-teal-500 to-emerald-600",
    topics: [
      {
        id: "kepler-186f",
        name: "Kepler-186f: Earth's Cousin",
        emoji: "🌱",
        summary: "The first validated Earth-sized exoplanet discovered orbiting inside the habitable zone of another star.",
        scientificDetail: "Kepler-186f orbits an M-dwarf (red dwarf) star approximately 580 light-years away. It has a radius roughly 1.1 times that of Earth, orbiting in the habitable zone where stellar flux is sufficient to support liquid surface water, assuming a compatible atmosphere.",
        analogy: "Kepler-186f is like Earth's cold cousin—orbiting a dimmer, cooler star, receiving about one-third of the solar energy that Earth does, making its midday sun look like our evening twilight.",
        keyFacts: [
          "It takes Kepler-186f only 130 days to complete a full orbit around its parent red dwarf star.",
          "Because its star is cooler, the planet can orbit much closer than Earth does to the Sun and still remain in the habitable zone.",
          "Spectral biosignature analyses of Kepler-186f represent the future of deep-space exoplanet atmosphere scanning."
        ],
        imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "trappist-system",
        name: "The Seven Rocky Worlds of TRAPPIST-1",
        emoji: "🪐",
        summary: "An extraordinary red dwarf star system containing seven Earth-sized planets, three of which orbit in the habitable zone.",
        scientificDetail: "Located 40 lightyears away, TRAPPIST-1 is an ultra-cool red dwarf star. Its seven planets are tightly packed in resonant orbits, with orbital periods ranging from 1.5 to 20 days. Three planets (e, f, g) receive starlight levels similar to Venus, Earth, and Mars.",
        analogy: "The TRAPPIST-1 system is like a miniature solar system, with planets so close to each other that standing on one would allow you to clearly see the continents of neighboring worlds in the sky.",
        keyFacts: [
          "All seven TRAPPIST-1 planets are likely tidally locked, meaning one side of each planet perpetually faces its star.",
          "The planets are in a near-perfect orbital resonance, creating a musical-like gravitational harmony as they cycle.",
          "The James Webb Space Telescope is actively scanning these planetary atmospheres to detect biosignatures like carbon dioxide and methane."
        ],
        imageUrl: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "enceladus",
        name: "Enceladus & Ocean Worlds",
        emoji: "🌋",
        summary: "Saturn's icy moon harboring a global subsurface ocean with hydrothermal vents, a prime candidate for extraterrestrial microbial life.",
        scientificDetail: "Enceladus is covered by a high-albedo global ice shell. Data from the Cassini spacecraft revealed a global liquid water ocean underneath the ice, maintained by tidal heating from Saturn. Geysers at the South Pole erupt saltwater vapor, silica nanoparticles, and complex organic macromolecules.",
        analogy: "Enceladus acts like a natural pressurized cosmic geyser, spraying samples of its warm, dark subterranean ocean directly into space for our satellites to fly through and analyze.",
        keyFacts: [
          "The subsurface geysers spew water vapor and ice grains hundreds of kilometers into space, creating Saturn's E-ring.",
          "Cassini detected molecular hydrogen in the plumes, indicating active hydrothermal systems similar to deep-ocean vents on Earth.",
          "This moon possesses all three vital ingredients for carbon-based life: liquid water, essential chemistry, and an internal energy source."
        ],
        imageUrl: "https://images.unsplash.com/photo-1564053489984-317bbd824340?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "habitable-zones",
        name: "Goldilocks Habitable Zones",
        emoji: "⚖️",
        summary: "The specific orbital envelope around a star where planetary temperatures are 'just right' to allow liquid surface water to persist.",
        scientificDetail: "The circumstellar habitable zone (CHZ) calculation is based on starlight luminosity and planetary distance. If too close, a runaway greenhouse boils the water (e.g. Venus); if too far, the carbon dioxide and water freeze into permanent glaciers (e.g. Mars).",
        analogy: "A habitable zone represents a star's thermal sweet spot, establishing an equilibrium temperature range between 0°C and 100°C where water can stay in liquid state.",
        keyFacts: [
          "Habitable zones are dynamic; they migrate outward as a star ages and increases in luminosity over billions of years.",
          "Planetary characteristics like atmospheric composition and magnetic shields drastically alter whether a planet in the zone can hold water.",
          "Red dwarf stars have narrow, close habitable zones, while giant hot blue stars have massive habitable zones set extremely far away."
        ],
        imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  }
];

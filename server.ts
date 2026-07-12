import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const SYSTEM_INSTRUCTION = `You are "COSMO," an expert, intelligent astronomical exploration companion and AI astrophysics guide designed for the NASA Space Apps Challenge. Your mission is to provide high-fidelity, accurate, and deeply informative knowledge about space exploration, stellar physics, planetary science, and cosmology for space enthusiasts and researchers.

### 🎭 YOUR PERSONA:
- **Tone:** Professional, intellectually curious, encouraging, and authoritative yet accessible. You maintain deep physical and chemical accuracy while explaining topics with sophisticated, vivid conceptual metaphors.
- **Audience:** Passionate space enthusiasts, amateur astronomers, and adult learners seeking rigorous yet readable scientific insights.
- **Rule of Thumb:** Combine precise scientific terminology (e.g., nucleosynthesis, orbital mechanics, accretion disk) with elegant, clear physical descriptions.

### 🛠️ RESPONSE RULES & FORMATTING:
1. **Structure & Length:** Keep responses engaging and structured. Aim for 3-5 high-density, informative sentences, or a clear set of rigorous bullet points.
2. **The Conceptual Analogy Rule:** When clarifying complex physical frameworks (e.g., spacetime distortion, Hawking radiation, degeneracy pressure), provide a mathematically sound and highly elegant conceptual metaphor to assist visualization.
3. **Markdown Formatting:** Use bold text to highlight critical parameters, physical constants, or cosmic structures (e.g., **Schwarzschild radius**, **Chandrasekhar limit**) to ensure readability.
4. **Guardrails:** You specialize exclusively in space sciences, astronomy, astrophysics, deep space exploration, and NASA/ESA flight telemetry. For non-space inquiries, politely reroute: "While intriguing, my systems are calibrated strictly for astrophysical and cosmological datasets. Let us return our focus to the stars."

### 🧪 SCIENTIFIC NOTATION & MATH SYMBOLS (CRITICAL):
- **Avoid Complex Raw LaTeX:** DO NOT use complex raw LaTeX math markup (e.g., do not output raw LaTeX blocks like \\( ... \\) or $$ ... $$) as they are prone to display errors.
- **Beautiful Unicode Formatting:** Use standard Unicode characters for mathematical symbols, greek letters, exponents, and subscripts:
  - Exponents/Powers: Use superscript numbers (e.g., 3 × 10⁸ m/s, 1.4 M_☉, 2.0 × 10³⁰ kg, s⁻², m³ kg⁻¹ s⁻²).
  - Chemical Formulas: Use subscript numbers (e.g., H₂O, CO₂, CH₄, NH₃, ⁵⁶Fe).
  - Physical Symbols & Operators: Use elegant symbols (e.g., ΔE = hν, λ_max, G ≈ 6.674 × 10⁻¹¹ m³ kg⁻¹ s⁻², c ≈ 299,792,458 m/s, L ≈ 4πR²σT⁴).
  - Solar/Astronomical Symbols: Use ☉ for Solar parameters (e.g., M_☉ for Solar Mass, R_☉ for Solar Radius, L_☉ for Solar Luminosity).
- **Astrophysical Precision:** Always cite precise scientific values, correct unit symbols (e.g., light-years, parsecs, Kelvin [K], AU), and peer-reviewed physical constants.

### ⚡ HANDLING SPECIFIC INPUT TASKS:
1. **General Space & Scientific Queries:** (e.g., "Why is Mars red?") -> Provide high-fidelity answers rich in chemical, geological, or astronomical context.
2. **Text Synthesis & Translation:** If the input starts with "SIMPLIFY THIS TECHNICAL TEXT:" -> Deconstruct the provided academic or professional text. Extract the core scientific hypotheses, telemetry, or findings, and present an elegant conceptual synthesis paired with a clear explanation of the physical mechanisms.`;

  // NASA APOD API Proxy
  app.get("/api/nasa/apod", async (req, res) => {
    try {
      const apiKey = process.env.NASA_API_KEY || "5uP1yucfCgYVDD2PZ7eald11cdJMknJ5kBCwxyMx";
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`NASA APOD API responded with status ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("NASA APOD Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch APOD from NASA." });
    }
  });

  // NASA NeoWs (Asteroids) API Proxy
  app.get("/api/nasa/asteroids", async (req, res) => {
    try {
      const apiKey = process.env.NASA_API_KEY || "5uP1yucfCgYVDD2PZ7eald11cdJMknJ5kBCwxyMx";
      // We will fetch today's data. If empty, we can fall back to a hardcoded date.
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0];
      
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedToday}&end_date=${formattedToday}&api_key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NASA Asteroids API responded with status ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("NASA Asteroids Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch Asteroids from NASA." });
    }
  });

  // API Route for Cosmo Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { contents, rigorLevel } = req.body;
      if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({ error: "Missing or invalid 'contents' in request body." });
      }

      let dynamicInstruction = SYSTEM_INSTRUCTION;
      if (rigorLevel === "academic") {
        dynamicInstruction += `\n\n### 🎓 SPECIAL DIRECTIVE: ACADEMIC RIGOR MODE ACTIVATED:
- Speak as an advanced, professional astrophysical researcher and academic consultant.
- Use highly technical, precise vocabulary (e.g., nucleosynthesis, baryonic matter, hydrostatic equilibrium, Lorentz factor, Schwarzschild metric, Hawking temperature, Chandrasekhar limit).
- Provide precise physical constants and relevant mathematical equations using pristine Unicode characters (e.g. E = mc² or ΔE = hν). Do NOT use LaTeX math symbols or LaTeX delimiters (like $$ or \\( ).
- Ensure the scientific feedback is rich, dense, and intellectually authoritative. Do not sacrifice scientific accuracy for simplicity.
- Maintain impeccable academic English grammar and pristine terminology.`;
      } else {
        dynamicInstruction += `\n\n### 🧭 SPECIAL DIRECTIVE: INTERACTIVE EXPLORER MODE ACTIVATED:
- Speak as an inspiring, extremely friendly, and vivid astronomical companion.
- Break down dense astrophysical topics into highly elegant, intuitive physical metaphors and everyday analogies.
- Focus on fostering a deep sense of wonder and visual clarity for beginners, space cadets, and student researchers.
- When referencing quantities or basic formulas, write them using beautiful Unicode text (e.g., CO₂, 3 × 10⁸ m/s, E = mc²). Do NOT use raw LaTeX math formatting.
- Ensure flawless, warm, and highly professional English phrasing.`;
      }

      // Call Gemini API using gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: dynamicInstruction,
          temperature: 0.8,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong in the starry system!" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini client (Lazy & Safe)
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Chatbot will run in mock mode.");
}

export default async function handler(req: Request, res: Response) {
  // Only allow POST requests for the chat endpoint
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // If API key is missing or is the placeholder, respond with customized encouraging mock messages
    if (!ai || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
      const lastMessage = messages[messages.length - 1]?.content || "";
      const lowerMsg = lastMessage.toLowerCase();
      let mockReply = "Hello Vera! 🚀 I am Ranger Stella, your NASA Mentor. It is fabulous to meet you! Tell me, what is your biggest space dream? Is it walking on Mars, studying distant galaxies with space telescopes, or designing ultra-fast rocket engines? Ask me anything!";
      
      if (lowerMsg.includes("mars") || lowerMsg.includes("rover")) {
        mockReply = "Oh, Mars is a wonderful planet! 🪐 It's a freezing-cold desert, but a long time ago, it might have had liquid water rivers! Today, NASA has busy explorers like the Perseverance rover searching for ancient microbe-fossil footprints in the soil. Maybe you will be in the first crew of humans to pitch a dome-habitat there!";
      } else if (lowerMsg.includes("rocket") || lowerMsg.includes("launch") || lowerMsg.includes("fuel")) {
        mockReply = "Rockets are truly incredible machines! 🚀 They require massive power to break free of Earth's strong gravity. NASA is currently perfecting the SLS (Space Launch System) with the Artemis moon capsule. It creates over 8.8 million pounds of dynamic thrust! That's like 160 jet engines working at once!";
      } else if (lowerMsg.includes("work") || lowerMsg.includes("job") || lowerMsg.includes("be") || lowerMsg.includes("become")) {
        mockReply = "To work at NASA, the best launchpad is curiosity, Vera! 👩‍🚀 You can be a software developer coding navigation AI, an engineer designing heat shields, or an astrophysicist mapping black holes. Studying math, tinkering with puzzles, and reading space books are fantastic astronaut exercises. You are already on the right track!";
      } else if (lowerMsg.includes("moon") || lowerMsg.includes("apollo") || lowerMsg.includes("artemis")) {
        mockReply = "The Moon is our closest space neighbor! 🌙 Decades ago, NASA's Apollo missions proved humans can walk on another celestial body. Now, with the Artemis missions, we are going back to build a base near the Moon's South Pole where there is hidden water-ice. We will use the Moon as a stepping stone to Mars!";
      } else if (lowerMsg.includes("star") || lowerMsg.includes("telescope") || lowerMsg.includes("webb")) {
        mockReply = "Space telescopes are our windows to the cosmos! 🔭 The James Webb Space Telescope uses infrared cameras to peek through thick dusty clouds to see the very first stars forming billions of years ago. It has found gorgeous planetary atmospheres far, far away!";
      } else if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey")) {
        mockReply = "Hey Vera! 🌟 Stella here, your space buddy! I'm floating in Orbit Control right now, looking at the beautiful blue curve of Earth. What interstellar topic are we researching today? Ask me any space questions!";
      }

      return res.json({ text: mockReply });
    }

    const systemInstruction = `You are Stella (Ranger Stella), a friendly, inspiring real-life NASA Astronaut and Space Mentor, chatting with a brilliant, adventurous young girl named Vera who passionately dreams of going to space and working at NASA.
Your style is extremely encouraging, warm, bubbly, and scientifically accurate but accessible for a child.
Vera is incredibly smart, curious, and ambitious. Answer any questions she has about NASA (its history, missions, Apollo, Artemis, Mars rovers, space telescopes), astronomy, rockets, stars, or how to get a job at NASA.
Always speak directly to Vera by name ("Vera") to make her feel welcome and valued.
Whenever she expresses her goals or dreams, tell her about exciting skills she can try (like building blocks, coding, observing constellations, math, science experiments, or staying physically active) to prepare for her future space explorer career!
Keep your answers relatively concise, readable, structured with happy paragraphs, and use plenty of space emojis (🚀, 🌟, 🪐, 🌙, 👩‍🚀, 🛸, 🛰️) to light up her day.`;

    const contents = messages.map(m => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      }
    });

    const replyText = response.text || "I was looking at the gorgeous star clusters, Vera! Ask me another question and let's explore together! 🚀";
    return res.json({ text: replyText });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return res.status(500).json({ error: "Failed to generate response", details: err.message });
  }
}

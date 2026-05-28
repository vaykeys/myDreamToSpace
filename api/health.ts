import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export default function handler(req: Request, res: Response) {
  res.json({
    status: "ok",
    mode: process.env.NODE_ENV,
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
}

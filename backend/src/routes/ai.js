import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

const GROK_API_KEY = process.env.GROK_API_KEY?.trim();
const GROK_ENDPOINT = process.env.GROK_ENDPOINT?.trim();
const GROK_MODEL = process.env.GROK_MODEL?.trim();


// AI Chatbot
router.post("/chat", authMiddleware, async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      GROK_ENDPOINT,
      {
        model: GROK_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an AI study assistant. Help the student with their academic questions, study tips, and motivation.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("AI Chat Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI Service Error", details: err.response?.data?.error?.message || err.message });
  }
});

// Generate Study Plan
router.post("/generate-plan", authMiddleware, async (req, res) => {
  const { subjects, tasks, hoursPerDay } = req.body;

  const prompt = `
    I have these subjects: ${subjects.join(", ")}.
    I have these pending tasks: ${tasks
      .map((t) => `${t.title} (due ${t.deadline})`)
      .join(", ")}.
    I can study for ${hoursPerDay} hours per day.
    Today is ${new Date().toDateString()}.
    Create a detailed daily study schedule for the next 7 days starting from tomorrow.
    Format the output as a JSON object with a 'schedule' key, which is an array of days.
    Each day object should have:
    - 'date' (YYYY-MM-DD string)
    - 'day' (string, e.g. Monday)
    - 'activities' (array of strings)
  `;

  try {
    const response = await axios.post(
      GROK_ENDPOINT,
      {
        model: GROK_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert study planner. Output ONLY valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(JSON.parse(response.data.choices[0].message.content));
  } catch (err) {
    console.error("AI Plan Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI Service Error", details: err.response?.data?.error?.message || err.message });
  }
});

export default router;

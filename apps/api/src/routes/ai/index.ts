import { Router, type IRouter } from "express";
import { GetAiAssistanceBody } from "@workspace/api-zod";
import {
  getAssistance,
  getOperationalRecommendations,
} from "../../services/aiService.js";

const router: IRouter = Router();

router.post("/ai/assist", async (req, res) => {
  const parsed = GetAiAssistanceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { query, persona, language } = parsed.data;

  try {
    const result = await getAssistance(query, persona, language ?? "English");
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "AI assistance error");
    res.status(500).json({ error: "Failed to generate AI assistance" });
  }
});

router.get("/ai/recommendations", async (req, res) => {
  try {
    const recommendations = await getOperationalRecommendations();
    res.json(recommendations);
  } catch (err) {
    req.log.error({ err }, "AI recommendations error");
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

export default router;

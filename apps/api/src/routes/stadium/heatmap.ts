/**
 * @layer server — HTTP Transport
 * GET /api/stadium/crowd
 * Returns zone-level crowd density heatmap.
 */

import { Router, type IRouter } from "express";
import { getCrowdHeatmap } from "../../services/stadium/index.js";

const router: IRouter = Router();

router.get("/stadium/crowd", (_req, res) => {
  res.json(getCrowdHeatmap());
});

export default router;

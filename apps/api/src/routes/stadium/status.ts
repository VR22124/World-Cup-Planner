/**
 * @layer server — HTTP Transport
 * GET /api/stadium/status
 * Returns live match status, weather, attendance, and overall crowd level.
 */

import { Router, type IRouter } from "express";
import { getStadiumStatus } from "../../services/stadium/index.js";

const router: IRouter = Router();

router.get("/stadium/status", (_req, res) => {
  res.json(getStadiumStatus());
});

export default router;

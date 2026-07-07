/**
 * @layer server — HTTP Transport
 * GET /api/stadium/incidents
 * Returns the active and resolved critical incident log.
 */

import { Router, type IRouter } from "express";
import { getIncidents } from "../../services/stadium/index.js";

const router: IRouter = Router();

router.get("/stadium/incidents", (_req, res) => {
  res.json(getIncidents());
});

export default router;

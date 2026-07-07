/**
 * @layer server — HTTP Transport
 * GET /api/stadium/gates
 * Returns per-gate congestion, queue times, and accessibility flags.
 */

import { Router, type IRouter } from "express";
import { getGates } from "../../services/stadium/index.js";

const router: IRouter = Router();

router.get("/stadium/gates", (_req, res) => {
  res.json(getGates());
});

export default router;

/**
 * @layer server — HTTP Transport
 * GET /api/stadium/transport
 * Returns the live transit schedule: metro, bus, shuttle, taxi, walking routes.
 */

import { Router, type IRouter } from "express";
import { getTransport } from "../../services/stadium/index.js";

const router: IRouter = Router();

router.get("/stadium/transport", (_req, res) => {
  res.json(getTransport());
});

export default router;

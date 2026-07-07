/**
 * @layer server — HTTP Transport
 * Stadium route composition.
 *
 * This module is a pure router composition file. It composes all stadium
 * sub-routers into a single mountable router. Business logic lives exclusively
 * in `../../services/stadium/`.
 */

import { Router, type IRouter } from "express";
import statusRouter from "./status.js";
import gatesRouter from "./gates.js";
import heatmapRouter from "./heatmap.js";
import transportRouter from "./transport.js";
import incidentsRouter from "./incidents.js";
import supportingRouter from "./supporting.js";

const router: IRouter = Router();

router.use(statusRouter);
router.use(gatesRouter);
router.use(heatmapRouter);
router.use(transportRouter);
router.use(incidentsRouter);
router.use(supportingRouter);

export default router;

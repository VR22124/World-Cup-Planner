/**
 * @layer server — HTTP Transport
 * GET /api/stadium/volunteers
 * GET /api/stadium/alerts
 * GET /api/stadium/accessibility
 * GET /api/stadium/sustainability
 *
 * Miscellaneous supporting stadium endpoints.
 */

import { Router, type IRouter } from "express";
import {
  getVolunteers,
  getAlerts,
  getAccessibilityInfo,
  getSustainabilityMetrics,
} from "../../services/stadium/index.js";

const router: IRouter = Router();

/** Volunteer roster with roles, zones, languages, and current tasks. */
router.get("/stadium/volunteers", (_req, res) => {
  res.json(getVolunteers());
});

/** Operational alerts sorted by severity. */
router.get("/stadium/alerts", (_req, res) => {
  res.json(getAlerts());
});

/** Accessibility resources: wheelchair entrances, restrooms, services. */
router.get("/stadium/accessibility", (_req, res) => {
  res.json(getAccessibilityInfo());
});

/** Sustainability and energy metrics. */
router.get("/stadium/sustainability", (_req, res) => {
  res.json(getSustainabilityMetrics());
});

export default router;

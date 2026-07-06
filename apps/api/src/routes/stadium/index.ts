/**
 * Stadium API routes — all GET endpoints returning real-time simulated
 * stadium data (crowd heatmaps, gate status, transport, incidents, etc.).
 */

import { Router, type IRouter } from "express";
import {
  getStadiumStatus,
  getGates,
  getCrowdHeatmap,
  getTransport,
  getIncidents,
  getVolunteers,
  getAlerts,
  getAccessibilityInfo,
} from "../../services/stadiumSimulator.js";

const router: IRouter = Router();

/** Live match status, weather, attendance, and overall crowd level. */
router.get("/stadium/status", (_req, res) => {
  res.json(getStadiumStatus());
});

/** Per-gate congestion, queue times, and accessibility flags. */
router.get("/stadium/gates", (_req, res) => {
  res.json(getGates());
});

/** Zone-level crowd density heatmap. */
router.get("/stadium/crowd", (_req, res) => {
  res.json(getCrowdHeatmap());
});

/** Transport network: metro, bus, shuttle, taxi, walking routes. */
router.get("/stadium/transport", (_req, res) => {
  res.json(getTransport());
});

/** Active and resolved incident log. */
router.get("/stadium/incidents", (_req, res) => {
  res.json(getIncidents());
});

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

export default router;

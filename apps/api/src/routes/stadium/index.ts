// @ts-nocheck
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

router.get("/stadium/status", (_req, res) => {
  res.json(getStadiumStatus());
});

router.get("/stadium/gates", (_req, res) => {
  res.json(getGates());
});

router.get("/stadium/crowd", (_req, res) => {
  res.json(getCrowdHeatmap());
});

router.get("/stadium/transport", (_req, res) => {
  res.json(getTransport());
});

router.get("/stadium/incidents", (_req, res) => {
  res.json(getIncidents());
});

router.get("/stadium/volunteers", (_req, res) => {
  res.json(getVolunteers());
});

router.get("/stadium/alerts", (_req, res) => {
  res.json(getAlerts());
});

router.get("/stadium/accessibility", (_req, res) => {
  res.json(getAccessibilityInfo());
});

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stadiumRouter from "./stadium/index.js";
import geminiRouter from "./gemini/index.js";
import aiRouter from "./ai/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stadiumRouter);
router.use(geminiRouter);
router.use(aiRouter);

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stadiumRouter from "./stadium/index";
import geminiRouter from "./gemini/index";
import aiRouter from "./ai/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stadiumRouter);
router.use(geminiRouter);
router.use(aiRouter);

export default router;

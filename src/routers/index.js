import { Router } from "express";
import authRouter from "./auth.router.js";
import tournamentRouter from "./tournament.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/login", authRouter);
router.use("/tournament", tournamentRouter)

export default router
import { Router } from "express";
import authRouter from "./auth.router.js";
import tournamentRouter from "./tournament.router.js";
import matchRouter from "./match.router.js";
import memberRouter from "./user.router.js";

const router = Router();

router.use("/member", memberRouter);
router.use("/auth", authRouter);
router.use("/tournament", tournamentRouter);
router.use("/match", matchRouter);

export default router
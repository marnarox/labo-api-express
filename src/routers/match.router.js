import { Router } from "express";
import matchController from "../controllers/match.controller.js";
import { connected } from "../middlewares/auth.middleware.js";
import { bodyValidator } from "../middlewares/validator.middleware.js";
import { setResultValidator } from "../validators/match.validator.js";

const matchRouter = Router();
matchRouter.patch(
	"/:matchId/result",
	connected(["admin"]),
	bodyValidator(setResultValidator),
	matchController.setResult,
);
export default matchRouter;
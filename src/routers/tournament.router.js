import { Router } from "express";
import tournamentController from "../controllers/tournament.controller.js";
import {
	bodyValidator,
	queryValidator,
} from "../middlewares/validator.middleware.js";
import { connected } from "../middlewares/auth.middleware.js";
import {
	createTournamentValidator,
	getAllTournamentsValidator,
	registerTournamentValidator,
} from "../validators/tournament.validator.js";

const tournamentRouter = Router();

tournamentRouter.post(
	"/",
	connected(["admin"]),
	bodyValidator(createTournamentValidator),
	tournamentController.create,
);

tournamentRouter.delete(
	"/:id",
	connected(["admin"]),
	tournamentController.delete,
);

tournamentRouter.get(
	"/",
	queryValidator(getAllTournamentsValidator),
	tournamentController.listing,
);

tournamentRouter.get("/:id", tournamentController.details);

tournamentRouter.post(
	"/:id/join",
	connected(),
	tournamentController.register,
);

tournamentRouter.post(
	"/:id/register",
	connected(["admin"]),
	bodyValidator(registerTournamentValidator),
	tournamentController.register,
);

tournamentRouter.post(
	"/:id/leave",
	connected(),
	tournamentController.unsubscribe,
);

tournamentRouter.post(
	"/:id/unregister",
	connected(["admin"]),
	bodyValidator(registerTournamentValidator),
	tournamentController.unsubscribe,
);

tournamentRouter.post(
	"/:id/start",
	connected(["admin"]),
	tournamentController.start,
);

tournamentRouter.patch(
	"/:id/next-round",
	connected(["admin"]),
	tournamentController.nextRound,
);

tournamentRouter.get(
	"/:id/score/:playerId",
	tournamentController.scoreOfPlayer,
);

tournamentRouter.get("/:id/scores", tournamentController.allPlayersScores);

tournamentRouter.get(
	"/:id/match/current",
	tournamentController.getCurrentRoundMatches,
);

tournamentRouter.get("/:id/round/:round", tournamentController.getRoundMatches);

export default tournamentRouter;
import { Router } from 'express';
import tournamentController from '../controllers/tournament.controller.js'

import {connected} from '../middlewares/auth-middleware.js'
import { bodyValidator, queryValidator } from '../middlewares/validator-middleware.js';
import { creationTournamentValidator, listingTounamentValidator } from '../validators/tournament.validator.js';


const tournamentRouter = Router();

tournamentRouter.post('/create', connected(["admin"]), bodyValidator(creationTournamentValidator), tournamentController.create)
tournamentRouter.delete('/:id', connected(["admin"]), tournamentController.delete);
tournamentRouter.get("/listing", queryValidator(listingTounamentValidator), tournamentController.listing)
tournamentRouter.get("/:id", tournamentController.details);
tournamentRouter.post("/:id/register", connected(), tournamentController.register)
tournamentRouter.delete("/:id/unsubscribe", connected(), tournamentController.unsubscribe)
tournamentRouter.post('/:id/start', connected(["admin"]), tournamentController.start)
export default tournamentRouter;
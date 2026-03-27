import db from "../database/index.js";
import { MatchNotFoundError } from "../custom-errors/match.error.js";
import { TournamentIsNotRunningError } from "../custom-errors/tournament.error.js";

const matchService = {
	setResult: async (matchId, result) => {
		const match = await db.Match.findByPk(matchId, {
			include: [
				{
					model: db.Tournament,
					as: "tournament",
				},
			],
		});
		if (!match) {
			throw new MatchNotFoundError();
		}

		if (match.tournament.status !== "started") {
			throw new TournamentIsNotRunningError();
		}

		match.result = result;
		await match.save();
	},
};

export default matchService;
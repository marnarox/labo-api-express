import matchService from "../services/match.service.js";

const matchController = {
	setResult: async (req, res) => {
		const matchId = req.params.matchId;
		const result = req.data.result;

		await matchService.setResult(matchId, result);

		res.status(204).send();
	},
};

export default matchController;
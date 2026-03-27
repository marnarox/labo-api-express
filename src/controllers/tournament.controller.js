import {
	TournamentDetailsDTO,
	TournamentListingDTO,
} from '../dtos/tournament.dto.js';
import tournamentService from '../services/tournament.service.js';

const tournamentController = {
	create: async (req, res) => {
		const tournament = await tournamentService.create(req.data, req.user.id);

		const dto = new TournamentListingDTO(tournament);
		res.status(201).json({ data: dto });
	},
	delete: async (req, res) => {
		const tournamentId = req.params.id;
		await tournamentService.delete(tournamentId, req.user);

		res.status(204).send();
	},
	listing: async (req, res) => {
		const {
			name,
			status,
			eloMin,
			eloMax,
			womanOnly,
			hasPlaces,
			categoryId,
			orderByDate,
			limit,
			offset,
		} = req.validatedQuery;
		const filter = {
			name,
			status,
			eloMin,
			eloMax,
			womanOnly,
			hasPlaces,
			categoryId,
		};
		const pagination = {
			orders: {
				date: orderByDate,
			},
			limit,
			offset,
		};
		const tournaments = await tournamentService.listing(
			filter,
			pagination,
			req.user,
		);

		const dtos = tournaments.map((t) => new TournamentListingDTO(t));

		res.status(200).json({ data: dtos });
	},
	details: async (req, res) => {
		const tournamentId = +req.params.id;
		const tournament = await tournamentService.details(tournamentId);

		if (!tournament) {
			return res.status(404).json({ message: 'Tournament not found' });
		}
		res.status(200).json({
			data: new TournamentDetailsDTO(tournament),
		});
	},
	register: async (req, res) => {
		const tournamentId = +req.params.id;
		const playerId = req.user.id;

		await tournamentService.register(tournamentId, playerId);

		res.status(200).json().send();
	},
	unsubscribe: async (req, res) => {
		const tournamentId = +req.params.id;
		const playerId = req.user.id;

		await tournamentService.unsubscribe(tournamentId, playerId);
		res.status(200).json().send();
	},
	start: async (req, res) => {
		const tournamentId = +req.params.id;
		const match = await tournamentService.start(tournamentId);
		res.status(201).json(match);
	},
	encounter: async (req, res) => {
		const matchId = req.params.id;
		const result = req.body
		await tournamentService.encounter(matchId, result);

		res.status(204).send();
	},
	nextRound: async(req,res)=> {
		const tournamentId = req.params.id;
		await tournamentService.nextRound(tournamentId);
		res.status(204).send();
	},
	scoreOfPlayer: async (req, res) => {
		const tournamentId = +req.params.id;
		const playerId = req.params.playerId;

		const score = await tournamentService.scoreOfPlayer(
			tournamentId,
			playerId,
		);

		res.status(200).json({
			data: new PlayerScoreDto(score),
		});
	},

	allPlayersScores: async (req, res) => {
		const tournamentId = +req.params.id;

		const scores = await tournamentService.allPlayersScores(tournamentId);

		res.status(200).json({
			data: scores.map(score => new PlayerScoreDto(score)),
		});
	},

	getCurrentRoundMatches: async (req, res) => {
		const tournamentId = +req.params.id;

		const { round, matches } =
			await tournamentService.getRoundMatches(tournamentId);

		res.status(200).json({
			data: new RoundMatchesDto(round, matches),
		});
	},

	getRoundMatches: async (req, res) => {
		const tournamentId = +req.params.id;
		const round = +req.params.round;

		const matches = await tournamentService.getRoundMatches(
			tournamentId,
			round,
		);

		res.status(200).json({
			data: new RoundMatchesDto(round, matches),
		});
	},
};

export default tournamentController;

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
};

export default tournamentController;

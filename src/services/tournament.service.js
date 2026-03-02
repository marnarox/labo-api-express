import dayjs from 'dayjs';
import db from '../database/index.js';
import {
	EloRangeError,
	EloRangeIsNotMatchingError,
	IsAlreadyRegisteredError,
	PlayerRangeError,
	RegistrationClosedError,
	RegistrationPeriodTooShortError,
	TournamentAlreadyStartedError,
	TournamentIsFullError,
	TournamentNotFoundError,
	WrongCategoryError,
	WrongGenderError,
	YouCantDeleteThisTournamentError,
} from '../custom-errors/tournament.error.js';
import { Op, Sequelize } from 'sequelize';
import { IsRegisteredError } from '../custom-errors/user.error.js';

const tournamentService = {
	create: async (data, organizerId) => {
		const creationTournamentDate = dayjs();
		const organizer = await db.User.findByPk(organizerId);
		if (!organizer) {
			throw new OrganizerDoesNotExist(organizerId);
		}
		if (data.playerMin > data.playerMax) {
			throw new PlayerRangeError();
		}
		if (data.eloMin > data.eloMax) {
			throw new EloRangeError();
		}

		//Ajoute x jours (le nombre de joueurs minimum au tournoi) à la date de fin d'inscription pour laisser un minimum de temps
		const minDateEndInscription = creationTournamentDate.add(
			data.playerMin,
			'day',
		);

		if (data.endInscriptionDate < minDateEndInscription) {
			throw new RegistrationPeriodTooShortError();
		}
		const newTournamentData = {
			...data,
			organizerId,
		};
		const categories = data.categoryIds
			? await db.Category.findAll({ where: { id: data.categoryIds } })
			: await db.Category.findAll();
		const tournament = await db.Tournament.create(newTournamentData);
		await tournament.setCategories(categories);
		return tournament;
	},
	listing: async (filter, pagination) => {
		const where = {};

		if (filter) {
			if (filter.name) {
				where.name = {
					[Op.iLike]: `%${filter.name}%`,
				};
			}
			if (filter.status) {
				where.status = filter.status;
			}
			if (filter.minElo) {
				where.minElo = { [Op.gte]: filter.minElo };
			}

			if (filter.maxElo) {
				where.eloMax = { [Op.lte]: filter.maxElo };
			}
			if (filter.womanOnly !== undefined) {
				where.isWoman = filter.womanOnly;
			}
		}

		const order = [];
		if (pagination.orders) {
			if (pagination.orders.date) {
				order.push(['endInscriptionDate', pagination.orders.date]);
			}
		}

		//
		const tournaments = await db.Tournament.findAll({
			where,
			offset: pagination.offset,
			limit: pagination.limit,
			order,
			include: [
				{
					model: db.Category,
					as: 'categories',
					through: {
						attributes: [],
					},
				},
			],
		});

		const promises = await tournaments.map(async (tournament) => {
			const numberOfPlayers = await tournament.countPlayers();
			return numberOfPlayers;
		});

		const allPromises = await Promise.all(promises);
		for (let i = 0; i < allPromises.length; i++) {
			tournaments[i].nbrOfPlayers = allPromises[i];
		}

		return tournaments;
	},
	delete: async (id, requester) => {
		const tournament = await db.Tournament.findByPk(id);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		if (requester.role !== 'admin') {
			throw new YouCantDeleteThisTournamentError();
		}
		if (tournament.status === 'en cours') {
			throw new TournamentAlreadyStartedError();
		}
		await tournament?.destroy();
	},
	details: async (tournamentId) => {
		const tournament = await db.Tournament.findByPk(tournamentId, {
			include: [
				{
					model: db.Category,
					as: 'categories',
				},
				{
					model: db.User,
					as: 'players',
				},
				{
					model: db.Match,
					as: 'matches',
					include: [
						{
							model: db.User,
							as: 'blackPlayer',
						},
						{
							model: db.User,
							as: 'whitePlayer',
						},
					],
				},
			],
		});
		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		return tournament;
	},
	register: async (tournamentId, playerId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);

		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		const player = await db.User.findByPk(playerId);
		if (!player) {
			throw new UserNotFoundError();
		}

		//check si on est pas déjà enregistrer
		const isAlreadyRegistered = await tournament.hasPlayers(player);
		if (isAlreadyRegistered) {
			throw new IsAlreadyRegisteredError();
		}
		//check si la date d'inscription n'est pas dépassé
		if (dayjs().isAfter(dayjs(tournament.endInscriptionDate))) {
			throw new RegistrationClosedError();
		}

		//check s'il reste de la place
		if (tournament.playerMax <= tournament.nbrOfPlayers) {
			throw new TournamentIsFullError();
		}
		//Check si c'est reservé au femme/autres
		if (tournament.isWoman && !['femme', 'autre'].includes(player.gender)) {
			throw new WrongGenderError();
		}

		//check si notre elo fit dans la range d'elo requi
		if (tournament.eloMin > player.elo || player.elo > tournament.eloMax) {
			throw new EloRangeIsNotMatchingError();
		}
		const tournamentCategories = await tournament.getCategories();
		const age = tournament.endInscriptionDate.diff(player.birthDate, 'year');
		const eligibleCategory = tournamentCategories.find(
			(c) => age >= c.minAge && (!c.maxAge || age <= c.maxAge),
		);
		if (!eligibleCategory) {
			throw new WrongCategoryError();
		}

		await tournament.addPlayers(player);
	},
	unsubscribe: async (tournamentId, playerId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		const player = await db.User.findByPk(playerId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		//check si la date d'inscription n'est pas dépassé
		if (dayjs().isAfter(dayjs(tournament.endInscriptionDate))) {
			throw new RegistrationClosedError();
		}
		const isRegistered = await tournament.hasPlayers(player);
		if (!isRegistered) {
			throw new IsRegisteredError();
		}
		await tournament.removePlayers(player);
	},
};

export default tournamentService;

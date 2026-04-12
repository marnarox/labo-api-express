import dayjs from 'dayjs';
import db from '../database/index.js';
import {
	EloRangeError,
	EloRangeIsNotMatchingError,
	IsAlreadyRegisteredError,
	MatchesAlreadyExistsError,
	MinimumPlayerRequiredError,
	NotAllMatchesHaveAResultError,
	PlayerRangeError,
	RegistrationClosedError,
	RegistrationNotClosedError,
	RegistrationPeriodTooShortError,
	TournamentAlreadyStartedError,
	TournamentIsFullError,
	TournamentNotFoundError,
	TournamentNotStartedError,
	WrongCategoryError,
	WrongGenderError,
	YouCantDeleteThisTournamentError,
} from '../custom-errors/tournament.error.js';
import { Op, Sequelize } from 'sequelize';
import { IsRegisteredError } from '../custom-errors/user.error.js';
import { MatchNotFoundError } from '../custom-errors/match.error.js';
import Tournament from '../database/entities/tournament.entity.js';
import { shuffle } from '../utils/array.utils.js';
import {
	canMemberRegisterToTournament,
	computePlayerScoreInATournament,
	isMemberRegisteredToTournament,
} from '../utils/tournament.utils.js';

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
	listing: async (filter, pagination, requester = null) => {
		const where = {};
		const catWhere = {};
		console.log("🚨🚨🚨🚨🚨🚨🚨");
		console.log(filter);
		console.log("🚨🚨🚨🚨🚨🚨🚨");
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
			if (filter.isWoman !== undefined) {
				where.isWoman = filter.isWoman;
			}
			if (filter.category) {
				catWhere.name = filter.category;
			}
		}

		const order = [];
		if (pagination.orders) {
			if (pagination.orders.date) {
				order.push(['endInscriptionDate', pagination.orders.date]);
			}
		}

		//
		let { count, rows: tournaments } = await db.Tournament.findAndCountAll({
			where,
			offset: pagination.offset,
			limit: pagination.limit,
			order,
			distinct: true,
			include: [
				{
					model: db.Category,
					as: 'categories',
					where: Object.keys(catWhere).length > 0 ? catWhere : null,
					required: Object.keys(catWhere).length > 0,
					through: {
						attributes: [],
					},
				},
			],
		});

		// const promises = await tournaments.map(async (tournament) => {
		// 	const numberOfPlayers = await tournament.countPlayers();
		// 	return numberOfPlayers;
		// });

		// const allPromises = await Promise.all(promises);
		// for (let i = 0; i < allPromises.length; i++) {
		// 	tournaments[i].nbrOfPlayers = allPromises[i];
		// }

		const nbrOfPlayersPromises = tournaments.map(async (tournament) => {
			tournament.nbrOfPlayers = await tournament.countPlayers();
			return tournament;
		});
		tournaments = await Promise.all(nbrOfPlayersPromises);
		if (requester) {
			// check if the user is registered to each tournament
			const isUserRegisteredPromises = tournaments.map(async (tournament) => {
				tournament.isRegistered = await isMemberRegisteredToTournament(
					tournament.id,
					requester.id,
				);
				return tournament;
			});
			tournaments = await Promise.all(isUserRegisteredPromises);

			// check if the user can register to each tournament
			const canUserRegisterPromises = tournaments.map(async (tournament) => {
				try {
					await canMemberRegisterToTournament(tournament.id, requester.id);
					tournament.canRegister = true;
				} catch (error) {
					tournament.canRegister = false;
				}
				return tournament;
			});
			tournaments = await Promise.all(canUserRegisterPromises);
		}

		return {
			data: tournaments,
			total: count,
			limit: pagination.limit,
			offset: pagination.offset,
		};
	},
	delete: async (id, requester) => {
		const tournament = await db.Tournament.findByPk(id);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		if (tournament.status === 'en cours') {
			throw new TournamentAlreadyStartedError();
		}
		await tournament?.destroy();
	},
	details: async (tournamentId, requester = null) => {
		const tournament = await db.Tournament.findByPk(tournamentId, {
			include: [
				{
					model: db.Category,
					as: 'categories',
				},
				{
					model: db.User,
					as: 'players',
					through: { attributes: [] }, // to exclude the join table attributes
				},
			],
		});
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		if (requester) {
			// check if the user is registered to the tournament
			tournament.isRegistered = await isMemberRegisteredToTournament(
				tournamentId,
				requester.id,
			);

			// check if the requester can register
			try {
				await canMemberRegisterToTournament(tournamentId, requester.id);
				tournament.canRegister = true;
			} catch (error) {
				tournament.canRegister = false;
			}
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
		// if (dayjs().isAfter(dayjs(tournament.endInscriptionDate))) {
		// 	throw new RegistrationClosedError();
		// }

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
		const endInscription = dayjs(tournament.endInscriptionDat);
		const age = endInscription.diff(player.birthDate, 'year');
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
		// if (dayjs().isAfter(dayjs(tournament.endInscriptionDate))) {
		// 	throw new RegistrationClosedError();
		// }
		if (tournament.status === 'en cours') {
			throw new TournamentAlreadyStartedError();
		}
		const isRegistered = await tournament.hasPlayers(player);
		if (!isRegistered) {
			throw new IsRegisteredError();
		}
		await tournament.removePlayers(player);
	},

	start: async (tournamentId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		// check if the tournament is already started
		if (tournament.status !== 'en attente de joueurs') {
			throw new TournamentAlreadyStartedError();
		}

		// check if the tournament has enough players to start
		const players = await tournament.getPlayers();
		if (players.length < tournament.minPlayers) {
			throw new InvalidNumberOfPlayerError();
		}

		tournament.status = 'en cours';
		tournament.currentRound = 1;

		// generate Round Robin matches

		// shuffle players
		shuffle(players);

		// if the number of players is odd, add a dummy player for the bye
		if (players.length % 2 === 1) {
			players.push(null);
		}

		const n = players.length;
		const totalRoundsPerLeg = n - 1;
		let playerList = [...players]; // create a copy of the players array to manipulate
		const matches = [];

		// generate HOME matches
		for (let round = 0; round < totalRoundsPerLeg; round++) {
			for (let i = 0; i < n / 2; i++) {
				const whitePlayer = playerList[i];
				const blackPlayer = playerList[n - 1 - i];

				if (whitePlayer && blackPlayer) {
					matches.push({
						tournamentId: tournament.id,
						roundNumber: round + 1,
						whitePlayerId: whitePlayer.id,
						blackPlayerId: blackPlayer.id,
					});
				} else {
					matches.push({
						tournamentId: tournament.id,
						roundNumber: round + 1,
						whitePlayerId: whitePlayer.id,
						blackPlayerId: null,
					});
				}
			}
			// rotate players for the next round
			playerList.splice(1, 0, playerList.pop());
		}

		// generate the return matches and inserve the 2 players
		const returnMatches = matches.map((match) => ({
			tournamentId: match.tournamentId,
			roundNumber: match.roundNumber + totalRoundsPerLeg,
			whitePlayerId: match.blackPlayerId,
			blackPlayerId: match.whitePlayerId,
		}));

		await db.Match.bulkCreate([...matches, ...returnMatches]);
		await tournament.save();
	},
	encounter: async (matchId, result) => {
		const match = await db.Match.findByPk(matchId);
		const tournament = await match.getTournament();
		if (!match) {
			throw new MatchNotFoundError();
		}
		if (tournament.currentRound === match.roundNumber) {
			match.result = result.result;
			await match.save();
			return match;
		}
	},
	nextRound: async (tournamentId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		// check if the tournament is running (so if the status is something else than started)
		if (tournament.status !== 'en cours') {
			throw new TournamentAlreadyStartedError();
		}

		const matches = await tournament.getMatches({
			where: { roundNumber: tournament.currentRound },
		});

		// check if all round has a result
		if (matches.some((match) => match.result === 'Pas encore joué')) {
			throw new NotAllMatchesHaveAResultError();
		}

		tournament.currentRound++;
		await tournament.save();
	},
	scoreOfPlayer: async (tournamentId, playerId) => {
		const player = await db.Member.findByPk(playerId);
		if (!player) {
			throw new MemberNotFoundError();
		}

		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		if (tournament.status === 'en attente') {
			throw new TournamentNotStartedError();
		}

		const score = await computePlayerScoreInATournament(tournamentId, playerId);

		score.player = player;

		return score;
	},

	allPlayersScores: async (tournamentId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		if (tournament.status === 'en attente') {
			throw new TournamentNotStartedError();
		}

		const players = await tournament.getPlayers();
		const scorePromises = players.map(async (player) => {
			const score = await computePlayerScoreInATournament(
				tournamentId,
				player.id,
			);

			score.player = player;

			return score;
		});

		const scores = await Promise.all(scorePromises);

		return scores.sort((a, b) => b.score - a.score);
	},

	getRoundMatches: async (tournamentId, roundNumber = null) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		if (
			tournament.status === 'en attente de joueurs' ||
			tournament.status === 'en attente'
		) {
			throw new TournamentNotStartedError();
		}

		const targetRound = roundNumber || tournament.currentRound;

		const matches = await tournament.getMatches({
			where: { roundNumber: targetRound },
			include: [
				{
					model: db.User,
					as: 'whitePlayer',
				},
				{
					model: db.User,
					as: 'blackPlayer',
				},
			],
		});

		return { roundNumber: targetRound, matches };
	},
	getMaxRoundTournament: async (tournamentId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		const maxScore = await db.Match.max('roundNumber', {
			where: { tournamentId: tournamentId },
		});

		return maxScore;
	},
};

export default tournamentService;

import dayjs from 'dayjs';
import db from '../database/index.js';
import {
	EloRangeError,
	PlayerRangeError,
	RegistrationPeriodTooShortError,
	TournamentAlreadyStartedError,
	TournamentNotFoundError,
	YouCantDeleteThisTournamentError,
} from '../custom-errors/tournament.error.js';

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

		const tournament = await db.Tournament.create(newTournamentData);
		return tournament;
	},
	delete: async (id, requester) => {
		const tournament = await db.Tournament.findByPk(id);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		if (requester.role !== 'admin') {
			throw new YouCantDeleteThisTournamentError();
		}
		if(tournament.status === "en cours"){
			throw new TournamentAlreadyStartedError();
		}
		await tournament?.destroy();
	},
};

export default tournamentService;

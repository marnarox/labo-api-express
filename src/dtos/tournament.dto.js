import { MatchListingDto } from './match.dto.js';
import { MemberListingDto } from './user.dto.js';

export class TournamentListingDTO {
	id;
	name;
	location;
	playerMin;
	playerMax;
	eloMin;
	eloMax;
	currentRound;
	isWoman;
	fitElo;
	status;
	endInscriptionDate;
	currentRound;
	nbrOfPlayers;
	categories;
	limit;
	isRegistered;
	canRegister;

	constructor(tournament) {
		this.id = tournament.id;
		this.name = tournament.name;
		this.location = tournament.location;
		this.playerMin = tournament.playerMin;
		this.playerMax = tournament.playerMax;
		this.eloMin = tournament.eloMin;
		this.eloMax = tournament.eloMax;
		this.fitElo = tournament.fitElo;
		this.currentRound = tournament.currentRound;
		this.isWoman = tournament.isWoman;
		this.status = tournament.status;
		this.endInscriptionDate = tournament.endInscriptionDate;
		this.currentRound = tournament.currentRound;
		this.nbrOfPlayers = tournament.nbrOfPlayers;
		this.categories = tournament.categories;
		this.limit = tournament.limit;
		this.isRegistered = tournament.isRegistered;
		this.canRegister = tournament.canRegister;
	}
}
export class TournamentPaginatedDTO {
    data;
    total;
    limit;
    offset;

    constructor(result) {
        this.data   = result.data.map(t => new TournamentListingDTO(t));
        this.total  = result.total;
        this.limit  = result.limit;
        this.offset = result.offset;
    }
}

export class TournamentDetailsDto {
	id;
	name;
	location;
	nbrOfPlayers;
	playerMin;
	playerMax;
	categories;
	eloMin;
	eloMax;
	status;
	endInscriptionDate;
	currentRound;
	players;
	isRegistered;
	canRegister;
	isWoman;
	maxRound;

	constructor(tournament) {
		this.id = tournament.id;
		this.name = tournament.name;
		this.location = tournament.location;
		this.nbrOfPlayers = tournament.nbrOfPlayers;
		this.playerMin = tournament.playerMin;
		this.playerMax = tournament.playerMax;
		this.categories = tournament.categories.map((category) => category.name);
		this.eloMin = tournament.eloMin;
		this.eloMax = tournament.eloMax;
		this.status = tournament.status;
		this.endInscriptionDate = tournament.endInscriptionDate;
		this.currentRound = tournament.currentRound;
		this.players = tournament.players.map(
			(player) => new MemberListingDto(player),
		);
		this.isRegistered = tournament.isRegistered;
		this.canRegister = tournament.canRegister;
		this.isWoman = tournament.isWoman;
		this.maxRound = tournament.maxRound;
	}
}

export class PlayerScoreDto {
	player;
	score;
	victory;
	draw;
	defeat;

	constructor(score) {
		this.player = new MemberListingDto(score.player);
		this.score = score.score;
		this.victory = score.victory;
		this.draw = score.draw;
		this.defeat = score.defeat;
	}
}
export class RoundMatchesDto {
	roundNumber;
	matches;

	constructor(roundNumber, matches) {
		this.roundNumber = roundNumber;
		this.matches = matches.map((match) => new MatchListingDto(match));
	}
}
export class maxRoundDto {
	maxRound;

	constructor(maxRound) {
		this.maxRound = maxRound;
	}
}

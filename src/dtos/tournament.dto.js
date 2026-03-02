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
	status;
	endInscriptionDate;
	currentRound;
	nbrOfPlayers;
	categories;

	constructor(tournament) {

		this.id = tournament.id
		this.name = tournament.name
		this.location = tournament.location
		this.playerMin = tournament.playerMin
		this.playerMax = tournament.playerMax
		this.eloMin = tournament.eloMin
		this.eloMax = tournament.eloMax
		this.currentRound = tournament.currentRound
		this.isWoman = tournament.isWoman
		this.status = tournament.status
		this.endInscriptionDate = tournament.endInscriptionDate
		this.currentRound = tournament.currentRound;
		this.nbrOfPlayers = tournament.nbrOfPlayers;
		this.categories = tournament.categories
	}
}

export class TournamentDetailsDTO {
	id;
	name;
	location;
	playerMin;
	playerMax;
	eloMin;
	eloMax;
	currentRound;
	isWoman;
	status;
	endInscriptionDate;
	players;
	categories;
	matches;

	constructor(tournament) {

		this.id = tournament.id
		this.name = tournament.name
		this.location = tournament.location
		this.playerMin = tournament.playerMin
		this.playerMax = tournament.playerMax
		this.eloMin = tournament.eloMin
		this.eloMax = tournament.eloMax
		this.currentRound = tournament.currentRound
		this.isWoman = tournament.isWoman
		this.status = tournament.status
		this.endInscriptionDate = tournament.endInscriptionDate
		this.currentRound = tournament.currentRound;
		this.categories = tournament.categories;
		this.players = tournament.players;
		this.matches = tournament.matches;

	}
}

export class TournamentListingDTO {
	id;
	name;
	place;
	playerMin;
	playerMax;
	eloMin;
	eloMax;
	roundNumber;
	isWoman;
	status;
	endInscriptionDate;

	constructor(tournament) {
		        console.log("🚨🚨🚨🚨🚨🚨🚨");
        console.log(tournament);
        console.log("🚨🚨🚨🚨🚨🚨🚨");
		this.id = tournament.id
		this.name = tournament.name
		this.place = tournament.place
		this.playerMin = tournament.playerMin
		this.playerMax = tournament.playerMax
		this.eloMin = tournament.eloMin
		this.eloMax = tournament.eloMax
		this.roundNumber = tournament.roundNumber
		this.isWoman = tournament.isWoman
		this.status = tournament.status
		this.endInscriptionDate = tournament.endInscriptionDate
	}
}

import { MemberListingDto } from "./user.dto.js";
export class MatchListingDto {
	id;
	whitePlayer;
	blackPlayer;
	result;
	roundNumber;

	constructor(match) {
		this.id = match.id;
		this.whitePlayer = new MemberListingDto(match.whitePlayer);
		this.blackPlayer = new MemberListingDto(match.blackPlayer);
		this.result = match.result;
		this.roundNumber = match.roundNumber;
	}
}
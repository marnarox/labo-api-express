export class MemberListingDto {
	id;
	username;
	birthDate;
	gender;
	elo;

	constructor(member) {
		this.id = member.id;
		this.username = member.username;
		this.birthDate = member.birth;
		this.gender = member.gender;
		this.elo = member.elo;
	}
}

export class MemberDto {
	id;
	username;
	email;
	birthDate;
	gender;
	el;
	role;

	constructor(member) {
		this.id = member.id;
		this.username = member.username;
		this.email = member.email;
		this.birthDate = member.birth;
		this.gender = member.gender;
		this.elo = member.elo;
		this.role = member.role;
	}
}
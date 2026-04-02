export class MemberListingDto {
	id;
	nickname;
	birthDate;
	gender;
	elo;

	constructor(member) {
		this.id = member.id;
		this.nickname = member.nickname;
		this.birthDate = member.birthDate;
		this.gender = member.gender;
		this.elo = member.elo;
	}
}

export class MemberDto {
	id;
	nickname;
	email;
	birthDate;
	gender;
	elo;
	role;

	constructor(member) {
		this.id = member.id;
		this.nickname = member.nickname;
		this.email = member.email;
		this.birthDate = member.birth;
		this.gender = member.gender;
		this.elo = member.elo;
		this.role = member.role;
	}
}

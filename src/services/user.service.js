import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import db from '../database/index.js';

import {
	EmailAlreadyExistsError,
	InvalidCredentialsError,
	MemberNotFoundError,
	NickNameAlreadyExistsError,
} from '../custom-errors/user.error.js';
const { ENCRYPTION_ROUND } = process.env;

const userService = {
	create: async (data) => {
		//pas deux fois le même mail
		const existingEmail = await db.User.findOne({
			where: {
				email: data.email,
			},
		});
		if (existingEmail) {
			throw new EmailAlreadyExistsError();
		}
		const existingNickName = await db.User.findOne({
			where: {
				nickname: data.nickname,
			},
		});
		if (existingNickName) {
			throw new NickNameAlreadyExistsError();
		}

		data.password = bcrypt.hashSync(data.password, +ENCRYPTION_ROUND);

		const newUser = await db.User.create(data);
		return newUser;
	},
	login: async (credentials) => {
		let existingUser = null;

		if (credentials.email) {
			existingUser = await db.User.findOne({
				where: { email: credentials.email },
			});
		} else if (credentials.nickname) {
			existingUser = await db.User.findOne({
				where: { nickname: credentials.nickname },
			});
		}

		if (!existingUser) {
			throw new InvalidCredentialsError();
		}

		const checkPassword = bcrypt.compareSync(
			credentials.password,
			existingUser.password,
		);
		if (!checkPassword) {
			throw new InvalidCredentialsError();
		}

		return existingUser;
	},
	getById: async (id) => {
		const member = await db.User.findOne({ where: { id } });
		if (!member) {
			throw new MemberNotFoundError();
		}
		return member;
	},
	update: async (id, data) => {
		const member = await db.User.findOne({ where: { id } });
		if (!member) {
			throw new MemberNotFoundError();
		}

		if (data.email && data.email !== member.email) {
			// check if the email already exists
			const existingUser = await db.User.findOne({
				where: { email: data.email },
			});
			if (existingUser) {
				throw new EmailAlreadyExistsError();
			}
		}

		if (data.nickname && data.nickname !== member.nickname) {
			// check if nickname already exists
			const existingnickname = await db.User.findOne({
				where: { nickname: data.nickname },
			});
			if (existingnickname) {
				throw new NickNameAlreadyExistsError();
			}
		}

		// update the user
		const updatedMember = await member.update(data);
		return updatedMember;
	},
	getAll: async (filter, pagination) => {
		const where = {};
		if (filter.nickname) {
			where.nickname = filter.nickname;
		}
		if (filter.email) {
			where.email = filter.email;
		}
		if (filter.birthDate) {
			where.birthDate = filter.birthDate;
		}
		if (filter.gender) {
			where.gender = filter.gender;
		}
		if (filter.elo) {
			where.elo = filter.elo;
		}

		const order = [];
		if (pagination.sortBy) {
			order.push([pagination.sortBy, pagination.sortOrder || 'ASC']);
		} else {
			order.push(['nickname', 'ASC']);
		}

		const { rows: members, count } = await db.User.findAndCountAll({
			where,
			offset: pagination.offset,
			limit: pagination.limit,
			order,
		});
		return { members, count };
	},
};

export default userService;

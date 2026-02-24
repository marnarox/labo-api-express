import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import db from '../database/index.js';

import {
	EmailAlreadyExistsError,
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
};

export default userService;

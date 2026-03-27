import { Router } from 'express';
import {
	bodyValidator,
	paramValidator,
	queryValidator,
} from '../middlewares/validator.middleware.js';
import {
	getAllValidator,
	getByIdValidator,
	registerValidator,
	updateValidator,
} from '../validators/user.validator.js';
import memberController from '../controllers/member.controller.js';
import { connected } from '../middlewares/auth.middleware.js';

const memberRouter = Router();
memberRouter.post(
	'/',
	connected(['admin']),
	bodyValidator(registerValidator),
	memberController.register,
);
memberRouter.get(
	'/',
	connected(['admin']),
	queryValidator(getAllValidator),
	memberController.getAll,
);
memberRouter.get('/me', connected(), memberController.getConsumer);
memberRouter.get(
	'/:id',
	connected(),
	paramValidator(getByIdValidator),
	memberController.getById,
);
memberRouter.put(
	'/me',
	connected(),
	bodyValidator(updateValidator),
	memberController.updateConsumer,
);
memberRouter.put(
	'/:id',
	connected(),
	paramValidator(getByIdValidator),
	bodyValidator(updateValidator),
	memberController.updateById,
);

export default memberRouter
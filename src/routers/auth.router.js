import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

import { bodyValidator } from '../middlewares/validator-middleware.js';
import { registerValidator } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post(
	'/register',
	bodyValidator(registerValidator),
	authController.register,
);

export default authRouter;

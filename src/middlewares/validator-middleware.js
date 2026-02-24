import z from 'zod'
export const bodyValidator = (dataValidator) => {
	return (req, res, next) => {
		const { data, success, error } = dataValidator.safeParse(req.body);

		if (!success) {
			//Le form est pas valide
			//TODO GERER LES ERREURS
			const { fieldErrors } = error.flatten();
			res.status(400).json({
				errors: fieldErrors,
			});
		} else {
			//formulaire reçu est valide
			req.data = data;
			next();
		}
	};
};
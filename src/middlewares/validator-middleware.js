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

export const queryValidator = (dataValidator) => {
  return (req, res, next) => {
    console.log("REQ QUERY");
    console.log(req.query);

    const { data, success, error } = dataValidator.safeParse(req.query);
    console.log("QUERY VALIDATOR DATA:");
    console.log({ data, success, error });

    req.validatedQuery = data;
    next();
  };
};
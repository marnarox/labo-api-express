import z from 'zod';

export const createTournamentValidator = z.object({
	name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
	location: z.string().optional(),
	playerMin: z.number().int().min(2).max(32).optional(),
	playerMax: z.number().int().min(2).max(32).optional(),
	eloMin: z.number().int().min(0).max(3000).optional(),
	eloMax: z.number().int().min(0).max(3000).optional(),
	categoryIds: z.array(z.coerce.number().int().positive()).optional(),
	isWoman: z.boolean().default(false),
	endInscriptionDate: z.coerce.date(),
});

export const getAllTournamentsValidator = z.object({
	name: z.string().optional().catch(null),
	status: z.string().optional().catch(null),
	category: z.string().optional().catch(null),
	womanOnly: z
		.preprocess((val) => {
			if (val === 'true') return true;
			if (val === 'false') return false;
			return val;
		}, z.boolean().optional())
		.catch(null),
	fromElo: z.coerce.number().optional().catch(null),
	toElo: z.coerce.number().optional().catch(null),
  orderByDate: z.enum(["asc", "desc"]).optional().catch("asc"),
	offset: z.coerce.number().min(0).default(0).catch(0),
	limit: z.coerce.number().min(1).max(20).default(10).catch(10),
});
export const registerTournamentValidator = z.object({
	memberId: z.uuid(),
});
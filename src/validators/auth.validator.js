import z from 'zod';

export const registerValidator = z.object({
	email: z.email(),

	nickname: z
		.string()
		.min(3)
		.max(16)
		.regex(/^[a-zA-Z0-9_-]{3,20}$/, {
			message:
				'Nickname must be 3-20 characters, letters, numbers, _ or - only',
		}),
	password: z.string().min(8).max(64),
	gender: z.enum(['homme', 'femme', 'autre']),
	// Vérifie que la date fournie est une chaîne au format ISO 8601 (ex: 2024-05-20)
	birthDate: z.iso.date(),
	elo: z.number().min(0).max(3000).optional(),
});

export const loginValidator = z
	.object({
		email: z.email().optional(),
		nickname: z.string().optional(),
		password: z.string(),
	})
	.refine((data) => data.email || data.nickname, { //le refine me permet de vérifier qu'au moins l'email ou le nickname est fournis
		message: 'Email or nickname is required',
	});

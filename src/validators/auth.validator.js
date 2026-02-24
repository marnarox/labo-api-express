import z from 'zod';

export const registerValidator = z.object({
	email: z.email(),

	nickname: z.string().min(3).max(16),
	password: z.string().min(8).max(64),
	// Vérifie que la date fournie est une chaîne au format ISO 8601 (ex: 2024-05-20)
	gender: z.enum(['homme', 'femme', 'autre']),
	birthDate: z.iso.date(),
	elo: z.number().min(0).max(3000).optional(),
});

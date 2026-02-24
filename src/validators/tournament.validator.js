import z from 'zod';

export const creationTournamentValidator = z.object({
name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  place: z.string().optional(),
  playerMin: z.number().int().min(2).max(32),
  playerMax: z.number().int().min(2).max(32),
  eloMin: z.number().int().min(0).max(3000),
  eloMax: z.number().int().min(0).max(3000),
  isWoman: z.boolean().default(false),
  endInscriptionDate: z.coerce.date(),
});


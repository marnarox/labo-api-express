import z from "zod";

export const registerValidator = z.object({
	username: z.string().min(3).max(20),
	email: z.email(),
	password: z.string().min(6).max(100),
	birthdate: z.iso.date(),
	gender: z.enum(["homme", "femme", "autre"]),
	elo: z.number().int().min(0).max(3000).optional(),
});

export const updateValidator = z.object({
	username: z.string().min(3).max(20).optional(),
	email: z.email().optional(),
	birthdate: z.iso.date().optional(),
	gender: z.enum(["homme", "femme", "autre"]).optional(),
	elo: z.number().int().min(0).max(3000).optional(),
});
z
export const getByIdValidator = z.object({
	id: z.uuid(),
});

export const getAllValidator = z.object({
	username: z.string().min(3).max(20).optional(),
	email: z.email().optional(),
	birthdate: z.iso.date().optional(),
	gender: z.enum(["M", "F", "O"]).optional(),
	elo: z.number().int().min(0).max(3000).optional(),
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["ASC", "DESC"]).optional(),
});
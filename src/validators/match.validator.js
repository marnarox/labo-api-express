import z from "zod";

export const setResultValidator = z.object({
	result: z.enum(["white_win", "black_win", "draw"]).optional().default(null),
});
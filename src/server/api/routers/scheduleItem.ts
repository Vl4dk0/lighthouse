import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().optional(),
  dayOfWeek: z.enum(["Po", "Ut", "St", "Št", "Pi"]).optional(),
  category: z.string().optional(),
});

export const scheduleItemRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.scheduleItem.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  }),

  search: publicProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    const { query, dayOfWeek, category } = input;

    const where = {
      AND: [
        query
          ? {
              OR: [
                {
                  courseName: { contains: query, mode: "insensitive" as const },
                },
                {
                  courseCode: { contains: query, mode: "insensitive" as const },
                },
                { teacher: { contains: query, mode: "insensitive" as const } },
                { room: { contains: query, mode: "insensitive" as const } },
                { note: { contains: query, mode: "insensitive" as const } },
              ],
            }
          : {},
        dayOfWeek ? { dayOfWeek } : {},
        category ? { category } : {},
      ],
    };

    return await ctx.db.scheduleItem.findMany({
      where,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.scheduleItem.findUnique({
      where: { id: input },
    });
  }),
});

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const DEMO_USER_ID = "demo-user-123"; // Leaving for fallback or types if needed, but logic below replaces usage

export const scheduleRouter = createTRPCRouter({
    getCurrent: publicProcedure
        .input(z.object({ username: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            // Find or create user by email (username)
            let user = await ctx.db.user.findUnique({
                where: { email: input.username },
            });

            user ??= await ctx.db.user.create({
                data: {
                    name: input.username.split("@")[0] ?? "User",
                    email: input.username,
                },
            });

            // Get current schedule for this user
            const schedule = await ctx.db.schedule.findFirst({
                where: { userId: user.id, isCurrent: true },
                include: { events: true },
            });

            if (!schedule) {
                // Create a default empty schedule if none exists
                return ctx.db.schedule.create({
                    data: {
                        name: "Môj Rozvrh",
                        isCurrent: true,
                        userId: user.id,
                    },
                    include: { events: true }
                })
            }

            return schedule;
        }),

    create: publicProcedure
        .input(z.object({ name: z.string().min(1), username: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({ where: { email: input.username } });
            if (!user) throw new Error("User not found");

            return ctx.db.schedule.create({
                data: {
                    name: input.name,
                    userId: user.id,
                    isCurrent: true,
                },
            });
        }),

    addEvent: publicProcedure
        .input(z.object({
            scheduleId: z.string(),
            title: z.string(),
            type: z.string(),
            day: z.string(),
            startTime: z.string(),
            endTime: z.string(),
            location: z.string().optional(),
            teacher: z.string().optional(),
            color: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.event.create({
                data: {
                    scheduleId: input.scheduleId,
                    title: input.title,
                    type: input.type,
                    day: input.day,
                    startTime: input.startTime,
                    endTime: input.endTime,
                    location: input.location,
                    teacher: input.teacher,
                    color: input.color,
                },
            });
        }),

    deleteEvent: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.event.delete({
                where: { id: input.id },
            });
        }),

    // Helper to seed data if empty
    seed: publicProcedure.mutation(async ({ ctx }) => {
        const schedule = await ctx.db.schedule.findFirst({
            where: { userId: DEMO_USER_ID, isCurrent: true },
        });

        if (!schedule) return null;

        // Add some sample events based on the PDF/Image
        await ctx.db.event.createMany({
            data: [
                {
                    scheduleId: schedule.id,
                    title: "Diskrétna Matematika",
                    type: "Prednáška",
                    day: "Utorok",
                    startTime: "07:00",
                    endTime: "08:00",
                    location: "M-I",
                    color: "sky"
                },
                {
                    scheduleId: schedule.id,
                    title: "Matematická analýza",
                    type: "Cvičenie",
                    day: "Štvrtok",
                    startTime: "07:00",
                    endTime: "08:00",
                    location: "F1-248",
                    color: "red"
                },
                {
                    scheduleId: schedule.id,
                    title: "PPSP",
                    type: "Náhradné cvičenie",
                    day: "Utorok",
                    startTime: "08:00",
                    endTime: "09:00",
                    location: "-1.58",
                    color: "purple"
                }

            ]
        })
    })
});

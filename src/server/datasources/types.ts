import { z } from "zod";

export const ScheduleItemSchema = z.object({
  id: z.string(),
  category: z.string(), // e.g., "1-INF", "A-buAN"
  courseName: z.string(),
  courseCode: z.string().optional(),
  dayOfWeek: z.enum(["Po", "Ut", "St", "Št", "Pi"]),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string(),
  teacher: z.string(),
  note: z.string(),
});

export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;

export const ExtractedScheduleSchema = z.object({
  items: z.array(ScheduleItemSchema),
  extractedAt: z.string(),
  sourceUrl: z.string(),
});

export type ExtractedSchedule = z.infer<typeof ExtractedScheduleSchema>;

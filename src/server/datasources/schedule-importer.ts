import { PrismaClient } from "../../../generated/prisma";
import { CandleScheduleExtractor } from "./candle-extractor";
import type { ScheduleItem } from "./types";

const prisma = new PrismaClient();

export class ScheduleImporter {
  private extractor: CandleScheduleExtractor;

  constructor() {
    this.extractor = new CandleScheduleExtractor();
  }

  async importSchedule(): Promise<void> {
    console.log("Starting schedule import...");

    try {
      // Extract schedule from candle
      console.log("Extracting schedule from candle...");
      const extractedSchedule = await this.extractor.extractWeeklySchedule();

      console.log(`Extracted ${extractedSchedule.items.length} schedule items`);

      // Clear existing schedule items
      console.log("Clearing existing schedule items...");
      await prisma.scheduleItem.deleteMany();

      // Import new schedule items
      console.log("Importing new schedule items...");
      const importPromises = extractedSchedule.items.map((item) =>
        this.importScheduleItem(item),
      );

      await Promise.all(importPromises);

      console.log(
        `Successfully imported ${extractedSchedule.items.length} schedule items`,
      );
      console.log(`Import completed at: ${new Date().toISOString()}`);
    } catch (error) {
      console.error("Failed to import schedule:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  private async importScheduleItem(item: ScheduleItem): Promise<void> {
    try {
      await prisma.scheduleItem.create({
        data: {
          id: item.id,
          category: item.category,
          courseName: item.courseName,
          courseCode: item.courseCode || null,
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
          room: item.room,
          teacher: item.teacher,
          note: item.note,
        },
      });
    } catch (error) {
      console.error(`Failed to import schedule item ${item.id}:`, error);
      throw error;
    }
  }

  async getImportedSchedule(): Promise<any[]> {
    try {
      const items = await prisma.scheduleItem.findMany({
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      return items;
    } catch (error) {
      console.error("Failed to fetch imported schedule:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  const importer = new ScheduleImporter();

  importer
    .importSchedule()
    .then(() => {
      console.log("Import completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Import failed:", error);
      process.exit(1);
    });
}

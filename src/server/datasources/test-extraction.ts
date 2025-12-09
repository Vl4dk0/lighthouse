import { CandleScheduleExtractor } from "./candle-extractor";

export async function testCandleExtraction() {
  const extractor = new CandleScheduleExtractor();

  try {
    console.log("Starting schedule extraction...");
    const schedule = await extractor.extractWeeklySchedule();

    console.log(
      `Successfully extracted ${schedule.items.length} schedule items`,
    );
    console.log("Sample items:");
    schedule.items.slice(0, 30).forEach((item, index) => {
      console.log(`${index + 1}. ${item.courseName} (${item.courseCode})`);
      console.log(`   ${item.dayOfWeek} ${item.startTime}-${item.endTime}`);
      console.log(`   Room: ${item.room}, Teacher: ${item.teacher}`);
      console.log(`   Note: ${item.note}`);
      console.log("");
    });

    return schedule;
  } catch (error) {
    console.error("Failed to extract schedule:", error);
    throw error;
  }
}

async function main() {
  const schedule = await testCandleExtraction();
  console.log("Schedule extracted successfully");
}

void main();

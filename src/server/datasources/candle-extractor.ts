import * as cheerio from "cheerio";
import type { ExtractedSchedule, ScheduleItem } from "./types";

export class CandleScheduleExtractor {
  private readonly baseUrl = "https://candle.fmph.uniba.sk";
  private readonly scheduleEndpoint = "/hodiny-v-intervaloch/zoznam";

  async extractWeeklySchedule(): Promise<ExtractedSchedule> {
    const htmlContent = await this.fetchScheduleHtml();
    const scheduleItems = this.parseScheduleHtml(htmlContent);

    return {
      items: scheduleItems,
      extractedAt: new Date().toISOString(),
      sourceUrl: `${this.baseUrl}${this.scheduleEndpoint}`,
    };
  }

  private async fetchScheduleHtml(): Promise<string> {
    const formData = new URLSearchParams({
      searchIntervals: "Pondelok 00:00-Piatok 23:59",
    });

    const response = await fetch(`${this.baseUrl}${this.scheduleEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.9",
        "Cache-Control": "max-age=0",
      },
      body: formData,
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch schedule: ${response.status} ${response.statusText}`,
      );
    }

    return await response.text();
  }

  private parseScheduleHtml(html: string): ScheduleItem[] {
    const items: ScheduleItem[] = [];
    const $ = cheerio.load(html);

    // Find the schedule table with class 'vysledky_podrobneho_hladania'
    const table = $(".vysledky_podrobneho_hladania");
    if (!table.length) {
      console.warn("No schedule table found in the HTML");
      return items;
    }

    // Find all data rows (skip header rows)
    const rows = table.find("tbody tr");

    rows.each((index, element) => {
      const $row = $(element);
      const cells = $row.find("td");

      if (cells.length >= 8) {
        const item = this.parseScheduleRow($, cells, index);
        if (item) {
          items.push(item);
        }
      }
    });

    return items;
  }

  private parseScheduleRow(
    $: cheerio.CheerioAPI,
    cells: cheerio.Cheerio<any>,
    index: number,
  ): ScheduleItem | null {
    try {
      // Extract data from table cells based on actual structure:
      // 0: Deň (Day)
      // 1: Od (From)
      // 2: Do (To)
      // 3: Kategória (Category)
      // 4: Predmet (Subject)
      // 5: Učiteľ (Teacher)
      // 6: Miestnosť (Room)
      // 7: Poznámka (Note)

      const dayOfWeek = $(cells[0]).text().trim();
      const startTime = $(cells[1]).text().trim();
      const endTime = $(cells[2]).text().trim();
      const category = $(cells[3]).text().trim();

      // Subject cell contains the course name and potentially code
      const subjectCell = $(cells[4]);
      const subjectLink = subjectCell.find(".subjectName");
      let courseName = "";
      let courseCode = "";

      if (subjectLink.length) {
        courseName = subjectLink.text().trim();
        // Extract course code from category if it looks like a code
        if (category.match(/^[A-Z]?[\d-]+[A-Z]*$/)) {
          courseCode = category;
        }
      } else {
        courseName = subjectCell.text().trim();
      }

      const teacher = $(cells[5]).text().trim();
      const room = $(cells[6]).text().trim();
      const note = $(cells[7]).text().trim();

      // Validate day of week
      const validDays = ["Po", "Ut", "St", "Št", "Pi"];
      if (!validDays.includes(dayOfWeek)) {
        return null;
      }

      return {
        id: `schedule-${index}-${Date.now()}`,
        category,
        courseName,
        courseCode,
        dayOfWeek: dayOfWeek as ScheduleItem["dayOfWeek"],
        startTime,
        endTime,
        room,
        teacher,
        note,
      };
    } catch (error) {
      console.warn(`Failed to parse schedule row ${index}:`, error);
      return null;
    }
  }
}

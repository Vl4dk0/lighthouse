"use client";

import { useState, useRef } from "react";
import { EventCard } from "./EventCard";
import { ScheduleSearchModal } from "../schedule/ScheduleSearchModal";
import { api } from "~/trpc/react";
import { Plus, X, Search } from "lucide-react";

interface CalendarProps {
  username: string;
}

export function Calendar({ username }: CalendarProps) {
  const [view, setView] = useState<"Deň" | "Týždeň" | "Mesiac">("Týždeň");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Form state
  const titleRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLSelectElement>(null);
  const startRef = useRef<HTMLSelectElement>(null);
  const endRef = useRef<HTMLSelectElement>(null);

  const utils = api.useUtils();
  const { data: schedule, isLoading } = api.schedule.getCurrent.useQuery({
    username,
  });
  const createEvent = api.schedule.addEvent.useMutation({
    onSuccess: async () => {
      await utils.schedule.getCurrent.invalidate();
      setIsModalOpen(false);
    },
  });

  const deleteEvent = api.schedule.deleteEvent.useMutation({
    onSuccess: async () => {
      await utils.schedule.getCurrent.invalidate();
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Naozaj chcete odstrániť tento predmet?")) {
      deleteEvent.mutate({ id });
    }
  };

  const mapScheduleItemToEvent = (item: any, scheduleId: string) => {
    const dayMapping: Record<string, string> = {
      Po: "Pondelok",
      Ut: "Utorak",
      St: "Streda",
      Št: "Štvrtok",
      Pi: "Piatok",
    };

    const getColorByCategory = (category: string) => {
      if (category.startsWith("1-INF")) return "blue";
      if (category.startsWith("A-")) return "green";
      return "purple";
    };

    return {
      title: item.courseName,
      type: item.category,
      day: dayMapping[item.dayOfWeek] || item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      location: item.room,
      teacher: item.teacher,
      color: getColorByCategory(item.category),
    };
  };

  const handleAddScheduleItem = (item: any) => {
    if (!schedule) return;

    const eventData = mapScheduleItemToEvent(item, schedule.id);
    createEvent.mutate({
      scheduleId: schedule.id,
      ...eventData,
    });
    setIsSearchModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule) return;

    createEvent.mutate({
      scheduleId: schedule.id,
      title: titleRef.current?.value ?? "",
      type: typeRef.current?.value ?? "",
      day: dayRef.current?.value ?? "Pondelok",
      startTime: startRef.current?.value ?? "",
      endTime: endRef.current?.value ?? "",
      color: "sky", // Default for now
      location: "Unknown",
    });
  };

  const hours = ["7:00", "8:00", "9:00", "10:00", "11:00"];

  const days = [
    "Pondelok",
    "Utorok",
    "Streda",
    "Štvrtok",
    "Piatok",
    "Sobota",
    "Nedeľa",
  ];

  if (isLoading) return <div className="p-10">Načítavam rozvrh...</div>;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex rounded-md border border-gray-200 bg-white p-1">
          <button className="rounded px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Dnes
          </button>
          <button className="rounded px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Späť
          </button>
          <button className="rounded px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Ďalej
          </button>
        </div>

        <span className="text-sm font-medium text-gray-600">
          {schedule?.name ?? "Rozvrh"}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={16} />
            Pridať predmet
          </button>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Search size={16} />
            Hľadať predmety
          </button>
          <div className="flex rounded-md border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setView("Mesiac")}
              className={`rounded px-4 py-1.5 text-sm font-medium transition ${view === "Mesiac" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Mesiac
            </button>
            <button
              onClick={() => setView("Týždeň")}
              className={`rounded px-4 py-1.5 text-sm font-medium transition ${view === "Týždeň" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Týždeň
            </button>
            <button
              onClick={() => setView("Deň")}
              className={`rounded px-4 py-1.5 text-sm font-medium transition ${view === "Deň" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Deň
            </button>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[80px_1fr] overflow-auto">
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white"></div>
        <div className="sticky top-0 z-10 grid grid-cols-7 border-b border-gray-100 bg-white">
          {days.map((day) => (
            <div
              key={day}
              className="border-l border-gray-50 py-4 text-center text-sm font-semibold text-gray-700 first:border-l-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex h-28 items-center justify-center border-b border-gray-100 text-xs font-medium text-gray-500"
            >
              {hour}
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-7">
          {/* Grid Lines */}
          {hours.map((_, i) => (
            <div
              key={i}
              className="relative -z-10 col-span-7 h-28 border-b border-gray-100"
            />
          ))}

          {/* Vertical Lines */}
          <div className="absolute inset-0 -z-20 grid grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-full border-l border-gray-100" />
            ))}
          </div>

          {/* Events Mapping */}
          {schedule?.events.map((event) => {
            // Simple mapping logic: find column index based on day
            const dayIndex = days.indexOf(event.day); // 0-6
            if (dayIndex === -1) return null;

            // Row mapping: simplified for demo.
            // Assuming fixed slots matching the visual design.
            // Real implementation would calculate top/height based on time.
            // For now, let's map specific hours to row indices 1-5
            const hourMap: Record<string, number> = {
              "07:00": 1,
              "08:00": 2,
              "09:00": 3,
              "10:00": 4,
              "11:00": 5,
            };
            const rowStart = hourMap[event.startTime] ?? 1;

            return (
              <div
                key={event.id}
                className="h-28 p-1"
                style={{
                  gridColumnStart: dayIndex + 1 + 1, // +1 for time axis, +1 for 1-based index
                  gridRowStart: rowStart,
                }}
              >
                <EventCard
                  time={`${event.startTime} - ${event.endTime}`}
                  type={event.type}
                  title={event.title}
                  color={
                    event.color as
                      | "blue"
                      | "red"
                      | "purple"
                      | "green"
                      | "emerald"
                      | "sky"
                  }
                  onDelete={() => handleDelete(event.id)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Nový predmet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Názov predmetu
                </label>
                <input
                  ref={titleRef}
                  required
                  className="w-full rounded border p-2"
                  placeholder="napr. Matematická analýza"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Typ
                </label>
                <input
                  ref={typeRef}
                  required
                  className="w-full rounded border p-2"
                  placeholder="napr. Prednáška"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deň
                  </label>
                  <select ref={dayRef} className="w-full rounded border p-2">
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Čas od
                  </label>
                  <select ref={startRef} className="w-full rounded border p-2">
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Čas do
                  </label>
                  <select ref={endRef} className="w-full rounded border p-2">
                    {hours.map((h) => {
                      // Simple next hour logic
                      const nextHour = parseInt(h) + 1 + ":00";
                      return (
                        <option key={h} value={nextHour}>
                          {nextHour}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={createEvent.isPending}
                  className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {createEvent.isPending ? "Ukladám..." : "Pridať"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Search Modal */}
      <ScheduleSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddItem={handleAddScheduleItem}
      />
    </div>
  );
}

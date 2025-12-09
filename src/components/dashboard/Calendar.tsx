"use client";

import { useState, useRef } from "react";
import { EventCard } from "./EventCard";
import { ScheduleSearchModal } from "../schedule/ScheduleSearchModal";
import { api } from "~/trpc/react";
import { Plus, X, Search } from "lucide-react";
import type { ScheduleItem } from "~/server/datasources/types";

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

  const mapScheduleItemToEvent = (item: any, scheduleId: string) => {
    const dayMapping: Record<string, string> = {
      Po: "Pondelok",
      Ut: "Utorok",
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
    if (!schedule) return null;

    return {
      scheduleId: schedule.id,
      ...mapScheduleItemToEvent(item, schedule.id),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule) return;

    createEvent.mutate(
      {
        scheduleId: schedule.id,
        title: titleRef.current?.value ?? "",
        type: typeRef.current?.value ?? "",
        day: dayRef.current?.value ?? "Pondelok",
        startTime: startRef.current?.value ?? "",
        endTime: endRef.current?.value ?? "",
        color: "sky", // Default for now
        location: "Unknown",
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      },
    );
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

        </div>
      )}

      {/* Schedule Search Modal */}
      <ScheduleSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddItem={handleAddScheduleItem}
        createEvent={createEvent}
      />
    </div>
  );
}

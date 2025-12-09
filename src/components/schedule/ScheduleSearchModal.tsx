"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal, ModalHeader, ModalBody } from "~/components/ui/Modal";
import { api } from "~/trpc/react";
import type { ScheduleItem } from "~/server/datasources/types";
import { Plus } from "lucide-react";

interface ScheduleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem?: (item: ScheduleItem) => any;
}

const dayColors = {
  Po: "bg-blue-100 text-blue-800 border-blue-200",
  Ut: "bg-green-100 text-green-800 border-green-200",
  St: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Št: "bg-red-100 text-red-800 border-red-200",
  Pi: "bg-purple-100 text-purple-800 border-purple-200",
};

function ScheduleItemSubCard({
  item,
  onAdd,
}: {
  item: ScheduleItem;
  onAdd: (item: ScheduleItem) => any;
}) {
  const utils = api.useUtils();
  const createEvent = api.schedule.create.useMutation({
    onSuccess: () => {
      utils.schedule.invalidate();
    },
  });

  const dayColor =
    dayColors[item.dayOfWeek as keyof typeof dayColors] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-2 py-1 text-xs font-medium ${dayColor}`}
          >
            {item.dayOfWeek}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {item.startTime} - {item.endTime}
          </span>
          <span className="text-sm text-gray-600">{item.room}</span>
          {item.category && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              {item.category}
            </span>
          )}
        </div>
        {item.teacher && (
          <p className="mt-1 ml-2 text-xs text-gray-600">{item.teacher}</p>
        )}
        {item.note && (
          <p className="mt-1 ml-2 text-xs text-gray-500">{item.note}</p>
        )}
      </div>
      <button
        onClick={() => {
          const eventData = onAdd(item);
          if (eventData) {
            createEvent.mutate(eventData);
          }
        }}
        disabled={createEvent.isPending}
        className="ml-3 flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createEvent.isPending ? (
          <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
        ) : (
          <Plus size={12} />
        )}
        {createEvent.isPending ? "Pridávam..." : "Pridať"}
      </button>
    </div>
  );
}

export function ScheduleSearchModal({
  isOpen,
  onClose,
  onAddItem,
}: ScheduleSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: allItems = [], isLoading } = api.scheduleItem.getAll.useQuery();

  const filteredItems = useMemo(() => {
    if (!allItems.length) return [];

    return allItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        !!item.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDay = !selectedDay || item.dayOfWeek === selectedDay;
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesDay && matchesCategory;
    });
  }, [allItems, searchQuery, selectedDay, selectedCategory]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, ScheduleItem[]>();

    filteredItems.forEach((item) => {
      const courseName = item.courseName;
      if (!groups.has(courseName)) {
        groups.set(courseName, []);
      }
      groups.get(courseName)!.push(item);
    });

    return Array.from(groups.entries()).map(([courseName, items]) => ({
      courseName,
      items: items.sort((a, b) => {
        // Sort by day then by start time
        const dayOrder = { Po: 1, Ut: 2, St: 3, Št: 4, Pi: 5 };
        const dayDiff =
          (dayOrder[a.dayOfWeek as keyof typeof dayOrder] || 0) -
          (dayOrder[b.dayOfWeek as keyof typeof dayOrder] || 0);
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
      }),
    }));
  }, [filteredItems]);

  const categories = useMemo(() => {
    const cats = new Set(allItems.map((item) => item.category));
    return Array.from(cats).sort();
  }, [allItems]);

  const days = ["Po", "Ut", "St", "Št", "Pi"];

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedDay("");
      setSelectedCategory("");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="h-[90vh] w-[95vw] max-w-7xl"
    >
      <ModalHeader title="Hľadať predmety" onClose={onClose} />

      <ModalBody className="flex h-full flex-col">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Hľadať podľa názvu predmetu, kódu, učiteľa, miestnosti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute top-2.5 left-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Day Filter */}
          <div className="min-w-[200px] flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deň v týždni
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Všetky dni</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-[200px] flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Kategória
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Všetky kategórie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Načítavam predmety...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenašli sa žiadne predmety
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Skúste upraviť vyhľadávanie alebo filtre
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Našlo sa {filteredItems.length} predmet
                  {filteredItems.length !== 1 ? "ov" : ""} v{" "}
                  {groupedItems.length} skupinách
                </p>
                {(searchQuery || selectedDay || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDay("");
                      setSelectedCategory("");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Vymazať filtre
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {groupedItems.map(({ courseName, items }) => (
                  <div
                    key={courseName}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      {courseName}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <ScheduleItemSubCard
                          key={item.id}
                          item={item}
                          onAdd={onAddItem || (() => {})}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

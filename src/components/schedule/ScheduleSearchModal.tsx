"use client";

import { useState, useEffect, useMemo } from "react";
import { Modal, ModalHeader, ModalBody } from "~/components/ui/Modal";
import { ScheduleItemCard } from "./ScheduleItemCard";
import { api } from "~/trpc/react";
import type { ScheduleItem } from "~/server/datasources/types";

interface ScheduleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem?: (item: ScheduleItem) => void;
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

  const categories = useMemo(() => {
    const cats = new Set(allItems.map((item) => item.category));
    return Array.from(cats).sort();
  }, [allItems]);

  const days = ["Po", "Ut", "St", "Št", "Pi"];

  const handleAddItem = (item: ScheduleItem) => {
    onAddItem?.(item);
    onClose();
  };

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedDay("");
      setSelectedCategory("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <ModalHeader title="Search Schedule Items" onClose={onClose} />

      <ModalBody>
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by course name, code, teacher, room..."
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
              Day of Week
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Days</option>
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
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
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
              <p className="mt-2 text-gray-600">Loading schedule items...</p>
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
                No schedule items found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {filteredItems.length} schedule item
                  {filteredItems.length !== 1 ? "s" : ""}
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
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid max-h-96 gap-4 overflow-y-auto">
                {filteredItems.map((item) => (
                  <ScheduleItemCard
                    key={item.id}
                    item={item}
                    onAdd={onAddItem ? handleAddItem : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

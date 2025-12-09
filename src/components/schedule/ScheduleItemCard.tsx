import type { ScheduleItem } from "../../../generated/prisma";
import { twMerge } from "tailwind-merge";

interface ScheduleItemCardProps {
  item: ScheduleItem;
  onAdd?: (item: ScheduleItem) => void;
  className?: string;
}

const dayColors = {
  Po: "bg-blue-100 text-blue-800 border-blue-200",
  Ut: "bg-green-100 text-green-800 border-green-200",
  St: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Št: "bg-red-100 text-red-800 border-red-200",
  Pi: "bg-purple-100 text-purple-800 border-purple-200",
};

export function ScheduleItemCard({
  item,
  onAdd,
  className,
}: ScheduleItemCardProps) {
  const dayColor =
    dayColors[item.dayOfWeek as keyof typeof dayColors] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div
      className={twMerge(
        "rounded-lg border p-4 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {item.courseName}
          </h3>
          {item.courseCode && (
            <p className="text-sm text-gray-600">{item.courseCode}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={twMerge(
              "rounded-full border px-2 py-1 text-xs font-medium",
              dayColor,
            )}
          >
            {item.dayOfWeek}
          </span>
          {item.category && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              {item.category}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-gray-700">
            {item.startTime} - {item.endTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-gray-700">{item.room}</span>
        </div>

        {item.teacher && (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-700">{item.teacher}</span>
          </div>
        )}

        {item.note && (
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xs text-gray-600">{item.note}</span>
          </div>
        )}
      </div>

      {onAdd && (
        <button
          onClick={() => onAdd(item)}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add to Schedule
        </button>
      )}
    </div>
  );
}

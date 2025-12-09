"use client";

import { useState } from "react";
import { EventCard } from "./EventCard";

export function Calendar() {
    const [view, setView] = useState<"Deň" | "Týždeň" | "Mesiac">("Týždeň");

    const hours = [
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
    ];

    const days = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"];

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex rounded-md border border-gray-200 bg-white p-1">
                    <button className="rounded px-4 py-1.5 text-sm font-medium hover:bg-gray-50 text-gray-700">Dnes</button>
                    <button className="rounded px-4 py-1.5 text-sm font-medium hover:bg-gray-50 text-gray-700">Späť</button>
                    <button className="rounded px-4 py-1.5 text-sm font-medium hover:bg-gray-50 text-gray-700">Ďalej</button>
                </div>

                <span className="text-sm font-medium text-gray-600">
                    1 September 2026 - 8 September 2026
                </span>

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

            {/* Calendar Grid */}
            <div className="grid grid-cols-[80px_1fr] overflow-auto flex-1">
                {/* Header Row (Days) */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100"></div> {/* Top-left empty corner */}
                <div className="sticky top-0 z-10 grid grid-cols-7 border-b border-gray-100 bg-white">
                    {days.map((day) => (
                        <div key={day} className="py-4 text-center text-sm font-semibold text-gray-700 border-l border-gray-50 first:border-l-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Time Column + Grid Content */}
                <div className="flex flex-col">
                    {hours.map((hour) => (
                        <div key={hour} className="h-28 border-b border-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                            {hour}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 relative">
                    {/* Grid Lines */}
                    {hours.map((_, i) => (
                        <div key={i} className="col-span-7 h-28 border-b border-gray-100 relative -z-10" />
                    ))}

                    {/* Vertical Lines */}
                    <div className="absolute inset-0 grid grid-cols-7 -z-20">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="border-l border-gray-100 h-full" />
                        ))}
                    </div>

                    {/* Events - Absolute Positioning or Grid placement */}

                    {/* Tuesday - 7:00 */}
                    <div className="col-start-2 row-start-1 p-1 h-28">
                        <EventCard
                            time="07:00 - 08:00"
                            type="Prednáška"
                            title="Diskrétna Matematika"
                            color="sky"
                            className="h-20" /* Occupy part of the slot */
                        />
                    </div>

                    {/* Thursday - 7:00 */}
                    <div className="col-start-4 row-start-1 p-1 h-28 flex gap-1">
                        <EventCard
                            time="07:00 - 8:00"
                            type="Cvičenie"
                            title="Matematická analýza"
                            color="red"
                            className="flex-1"
                        />
                    </div>

                    {/* Friday - 7:00 */}
                    <div className="col-start-5 row-start-1 p-1 h-28">
                        <EventCard
                            time="07:00 - 08:00"
                            type="Prednáška"
                            title="Matematická analýza"
                            color="blue" // Design shows blue here
                        />
                    </div>

                    {/* Thursday - 8:00 */}
                    <div className="col-start-4 row-start-2 p-1 h-28">
                        <EventCard
                            time="08:00 - 9:00"
                            type="Náhradne cvičenie"
                            title="PPSP"
                            color="purple"
                            className="h-20"
                        />
                    </div>

                    {/* Wednesday - 9:00 */}
                    <div className="col-start-3 row-start-3 p-1 h-28">
                        <EventCard
                            time="09:00 - 10:00"
                            type="Prednáška"
                            title="Programovanie 4"
                            color="sky"
                            className="h-20"
                        />
                    </div>

                    {/* Friday - 9:00 */}
                    <div className="col-start-5 row-start-3 p-1 h-28">
                        <EventCard
                            time="09:00 - 10:00"
                            type="Zápočet"
                            title="Diskrétna Matematika"
                            color="green"
                            className="h-20"
                        />
                    </div>

                    {/* Tuesday - 10:00 */}
                    <div className="col-start-2 row-start-4 p-1 h-28">
                        <EventCard
                            time="09:00 - 9:00"
                            type="Náhradne cvičenie"
                            title="PPSP"
                            color="purple"
                            className="h-20"
                        />
                    </div>

                    {/* Saturday - 10:00 */}
                    <div className="col-start-6 row-start-4 p-1 h-28">
                        <EventCard
                            time="09:00 AM - 04:00 PM"
                            type="Niles Miller"
                            title="Storage"
                            color="blue" // Looks darker blue in screenshot
                            className="bg-[#3D6ABE]"
                        />
                    </div>

                    {/* Tuesday - 11:00 (which is 5th row) */}
                    <div className="col-start-2 row-start-5 p-1 h-28">
                        <EventCard
                            time="07:00 - 8:00"
                            type="Cvičenie"
                            title="Matematická analýza"
                            color="red"
                        />
                    </div>

                    {/* Wednesday - 11:00 - Wait in the PDF it is in the 3rd column (Streda), but it seems to be red */}
                    <div className="col-start-3 row-start-5 p-1 h-28">
                        <EventCard
                            time="07:00 - 8:00"
                            type="Cvičenie"
                            title="Matematická analýza"
                            color="red"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

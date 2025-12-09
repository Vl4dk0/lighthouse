import { twMerge } from "tailwind-merge";

import { Trash2 } from "lucide-react";

interface EventCardProps {
    time: string;
    type: string;
    title: string;
    color: "blue" | "red" | "purple" | "green" | "emerald" | "sky";
    className?: string;
    onDelete?: () => void;
}

export function EventCard({ time, type, title, color, className, onDelete }: EventCardProps) {
    const colorStyles = {
        blue: "bg-blue-100/50 border-l-4 border-blue-500 text-blue-900",
        red: "bg-red-100/50 border-l-4 border-red-500 text-red-900",
        purple: "bg-purple-100/50 border-l-4 border-purple-500 text-purple-900",
        green: "bg-green-100/50 border-l-4 border-green-500 text-green-900",
        emerald: "bg-emerald-100/50 border-l-4 border-emerald-500 text-emerald-900",
        sky: "bg-sky-100/50 border-l-4 border-sky-500 text-sky-900",
    };

    return (
        <div className={twMerge(
            "rounded-md p-2 text-xs font-medium h-full flex flex-col justify-between group relative transition-colors hover:shadow-sm",
            colorStyles[color],
            className
        )}>
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-white/50 hover:bg-white text-red-500 transition-all"
                >
                    <Trash2 size={14} />
                </button>
            )}
            <div>
                <div className="flex justify-between items-start">
                    <span className="opacity-75 text-[10px] uppercase tracking-wider">{type}</span>
                </div>
                <div className="mt-1 font-bold leading-tight">{type}</div>
                <div className="leading-tight">{title}</div>
            </div>
        </div>
    );
}

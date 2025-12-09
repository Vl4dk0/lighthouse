import { twMerge } from "tailwind-merge";

interface EventCardProps {
    title: string;
    type: string;
    time: string;
    color: "blue" | "red" | "purple" | "green" | "emerald" | "sky";
    className?: string;
    fullDetails?: boolean;
}

export function EventCard({ title, type, time, color, className, fullDetails }: EventCardProps) {
    const colorStyles = {
        blue: "bg-[#71A5DE] text-white", // Light blue like Disc math
        red: "bg-[#8E3A32] text-white", // Dark red like Mat analyza
        purple: "bg-[#C667EA] text-white", // Purple like PPSP
        green: "bg-[#51B583] text-white", // Green like Započet Disco
        emerald: "bg-emerald-500 text-white", // Fallback
        sky: "bg-[#8BCDEA] text-white", // Light blue like Prog 4
    };

    return (
        <div
            className={twMerge(
                "flex flex-col rounded-md p-2 text-xs font-medium shadow-sm transition hover:brightness-110 cursor-pointer h-full justify-center",
                colorStyles[color],
                className
            )}
        >
            <div className="flex justify-between items-start">
                <span className="opacity-90">{time}</span>
            </div>
            <div className="mt-1 font-bold leading-tight">{type}</div>
            <div className="leading-tight">{title}</div>

            {fullDetails && (
                <div className="mt-2 pt-2 border-t border-white/20">
                    <div>Niles Miller</div>
                    <div>Storage</div>
                </div>
            )}
        </div>
    );
}

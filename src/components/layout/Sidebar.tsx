import Link from "next/link";
import { LayoutDashboard, BookOpen, GraduationCap, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col bg-black text-white">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-2xl font-bold tracking-wider">
                    Lighthouse <span className="ml-1 text-sm">⚓</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-2 px-3 py-4">
                <div className="px-3 py-2 text-xl font-medium text-white mb-4">
                    <span className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" />
                        Rozvrh
                    </span>
                </div>

                <div className="space-y-1">
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg bg-transparent px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                        <BookOpen className="h-5 w-5" />
                        Zapísané predmety
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                        <GraduationCap className="h-5 w-5" />
                        Odporúčané predmety
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                        <Settings className="h-5 w-5" />
                        Nastavenia
                    </Link>
                </div>
            </nav>
        </aside>
    );
}

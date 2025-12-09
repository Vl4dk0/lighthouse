import Link from "next/link";
import { LayoutGrid, BookOpen, Compass, Settings, LogOut } from "lucide-react";
import { LighthouseIcon } from "~/components/ui/LighthouseIcon";

interface SidebarProps {
  onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col bg-black text-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-2xl font-bold tracking-wider">
          Lighthouse <LighthouseIcon className="ml-1" size={16} color="white" />
        </h1>
      </div>

      <nav className="flex flex-1 flex-col justify-between px-3 py-4">
        <div className="space-y-1">
          <a
            href="#"
            className="flex items-center rounded-md bg-[#1C1C1E] px-3 py-2 text-sm font-medium text-white transition-colors"
          >
            <LayoutGrid size={18} className="mr-3" />
            Rozvrh
          </a>
          <a
            href="#"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-[#1C1C1E] hover:text-white"
          >
            <BookOpen size={18} className="mr-3" />
            Zapísané predmety
          </a>
          <a
            href="#"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-[#1C1C1E] hover:text-white"
          >
            <Compass size={18} className="mr-3" />
            Odporúčané predmety
          </a>
          <a
            href="#"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-[#1C1C1E] hover:text-white"
          >
            <Settings size={18} className="mr-3" />
            Nastavenia
          </a>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-[#1C1C1E]"
          >
            <LogOut size={18} className="mr-3" />
            Odhlásiť sa
          </button>
        </div>
      </nav>
    </aside>
  );
}

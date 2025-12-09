interface HeaderProps {
    userName?: string;
}

export function Header({ userName }: HeaderProps) {
    // Extract name from email if needed (simple logic)
    const displayName = userName ? userName.split("@")[0] : "Juraj";
    // Capitalize first letter
    const formattedName = displayName ? displayName.charAt(0).toUpperCase() + displayName.slice(1) : "Juraj";

    return (
        <header className="flex h-24 items-center justify-between border-b border-gray-200 bg-[#E8EBF0] px-8">
            <div>
                <h2 className="text-3xl font-bold text-[#2A2B47] text-indigo-900">Ahoj, {formattedName}</h2>
                <p className="text-gray-500 font-medium">Tvoj aktuálny rozvrh</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Placeholder for user avatar if needed, or just the chevron down */}
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://ui-avatars.com/api/?name=${formattedName}&background=0D8ABC&color=fff`} alt="Profile" />
                </div>
                {/* Simple Dropdown Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>

            </div>
        </header>
    );
}

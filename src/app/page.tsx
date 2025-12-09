import { Sidebar } from "~/components/layout/Sidebar";
import { Header } from "~/components/layout/Header";
import { Calendar } from "~/components/dashboard/Calendar";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full bg-[#FAFBFF] overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Calendar />
        </main>
      </div>
    </div>
  );
}

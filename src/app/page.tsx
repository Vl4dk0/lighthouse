"use client";

import { useState } from "react";
import { Sidebar } from "~/components/layout/Sidebar";
import { Header } from "~/components/layout/Header";
import { Calendar } from "~/components/dashboard/Calendar";
import { LoginForm } from "~/components/auth/LoginForm";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#FAFBFF] overflow-hidden">
      <Sidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <Header userName={userEmail} />
        <main className="flex-1 overflow-auto p-6">
          <Calendar username={userEmail} />
        </main>
      </div>
    </div>
  );
}

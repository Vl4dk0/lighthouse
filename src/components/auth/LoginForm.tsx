"use client";

import { useState } from "react";
import Image from "next/image";

interface LoginFormProps {
  onLogin: (email: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Left Side - Form */}
        <div className="w-full max-w-sm">
          <h1 className="mb-12 text-3xl font-normal text-slate-800">
            Lighthouse <span className="ml-2 text-2xl">⛯</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600"
              >
                AIS email
              </label>
              <input
                id="email"
                type="text" // Allow text just in case (e.g. login name)
                placeholder="student@uniba.sk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors outline-none focus:border-slate-400 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600"
              >
                Heslo
              </label>
              <input
                id="password"
                type="password"
                placeholder="Heslo AIS"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Zabudnuté heslo?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#1d2736] py-3 text-sm font-medium text-white transition-colors hover:bg-[#2a3649]"
            >
              Prihlásiť sa univerzitným kontom
            </button>
          </form>
        </div>

        {/* Right Side - Logo (University) */}
        {/* User said this is optional/doesn't matter, but having something balancing layout is nice. 
            I'll render just the text or a placeholder if I don't have the image. 
            Since user said "uni photo doesnt have to be there", I will just center the form if no image.
            Actually, the design shows a university logo. I'll mock it with text for now.
         */}
        <div className="hidden items-center justify-center border-l border-slate-100 ps-12 md:flex">
          <div className="flex flex-col items-center opacity-80">
            {/* FMFI UK Logo */}
            <Image
              src="/fmfiuk.jpg"
              alt="FMFI UK logo"
              width={160}
              height={160}
              className="h-40 w-40 rounded-full object-cover"
            />
            <h2 className="mt-6 text-center text-xl font-light tracking-widest text-slate-800 uppercase">
              Univerzita
              <br />
              Komenského
              <br />v Bratislave
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

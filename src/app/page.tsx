"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Correct import for App Router

export default function Home() {
  const router = useRouter(); // Correct use of useRouter()

  const gologin = () => {
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-y-10">
      <ThemeToggle />

      <div className="flex items-center justify-center w-full flex-col gap-y-3">
        {/* Changed gap-x-24 to gap-y-6 for proper vertical spacing */}
        <h3>Welcome to</h3>
        <h1>SHEUKVETE</h1>
        <Button onClick={gologin}>Login</Button>
      </div>
    </main>
  );
}

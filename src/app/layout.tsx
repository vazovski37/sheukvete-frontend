"use client";

import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AppToaster } from "@/components/ui/Toaster";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <AppToaster />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

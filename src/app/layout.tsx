"use client";

import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AppToaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, } : { children: React.ReactNode;}) {
  return (
    <html lang="en" 
    suppressHydrationWarning
    >
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

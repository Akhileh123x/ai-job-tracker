// app/layout.jsx (Updated with wrapper logic)
"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Determine if we are on an auth screen
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full bg-muted/20 antialiased flex items-center justify-center`}>
          <main className="w-full">{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-muted/30">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
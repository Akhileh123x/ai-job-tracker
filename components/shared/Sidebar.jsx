"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, PlusCircle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Applications",
    icon: Briefcase,
    href: "/applications",
  },
  {
    label: "Track New",
    icon: PlusCircle,
    href: "/applications/new",
  },
  {
    label: "AI Assistant",
    icon: Bot,
    href: "/ai-assistant", // Points perfectly to your new isolated full-page AI section
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card text-card-foreground hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="bg-primary text-primary-foreground p-1.5 rounded-md text-sm">AI</span>
          Job Tracker
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {routes.map((route) => {
          const Icon = route.icon;
          
          // 🔥 FIXED: Stricter condition check prevents parent paths from lighting up alongside subpaths!
          const isActive = route.href === "/dashboard"
            ? pathname === "/dashboard"
            : route.href === "/applications"
              ? pathname === "/applications" // Exact match on applications list page view
              : pathname.startsWith(`${route.href}`);

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-primary text-primary-foreground" // Uses your system's active black style
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-current" : "text-muted-foreground group-hover:text-foreground")} />
              {route.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Area Wrapper */}
      <div className="p-4 border-t text-[10px] text-muted-foreground text-center truncate">
        <a 
          href="https://github.com/Akhileh123x" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline transition-all"
        >
          https://github.com/Akhileh123x
        </a>
      </div>
    </aside>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileCheck, CalendarDays, ThumbsUp } from "lucide-react";

export default function StatsGrid({ data = [] }) {
  // Compute basic breakdown figures safely
  const total = data.length;

  // 🚀 FIXED: Convert app.status to lowercase safely to avoid string casing mismatches ("Applied" vs "applied")
  const applied = data.filter((app) => app.status?.toLowerCase() === "applied").length;
  const interviewing = data.filter((app) => app.status?.toLowerCase() === "interviewing").length;
  const offers = data.filter((app) => app.status?.toLowerCase() === "offered").length;

  const cards = [
    {
      title: "Total Tracked",
      value: total,
      description: "Applications in your pipeline",
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Applications",
      value: applied + interviewing, // 🚀 UPDATED: Shows all active tracks combined (Applied + Interviewing)
      description: "Awaiting primary response",
      icon: CalendarDays,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Interviews Booked",
      value: interviewing,
      description: "Live evaluation loops",
      icon: FileCheck,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Offers Secured",
      value: offers,
      description: "Success outcomes",
      icon: ThumbsUp,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
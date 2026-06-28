import Link from "next/link";
import StatsGrid from "@/components/dashboard/StatsGrid";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";

// 🚀 Force Next.js to bypass caching pipelines to ensure fresh lookups on route changes
export const dynamic = "force-dynamic";

async function getApplicationPayload() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/applications`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Dashboard server sync error: ", err);
    return [];
  }
}

export default async function DashboardPage() {
  const applications = await getApplicationPayload();
  const recentApplications = applications.slice(0, 5); // Take the 5 newest additions

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Upper header section area panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Main Workspace</h1>
          <p className="text-slate-500 text-sm">Monitor analytical data transformations for targeted jobs.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/applications/new">
            <Button size="sm" className="gap-1 bg-black text-white hover:bg-neutral-800">
              <Plus className="h-4 w-4" /> Add Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate metrics block matrix rendering cards layer */}
      <StatsGrid data={applications} />

      {/* Lower dual-split charts and contextual quick tracking log review list */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <AnalyticsCharts data={applications} />
        </div>

        <Card className="w-full h-full bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Recent Activities</CardTitle>
            <CardDescription className="text-slate-400">Latest roles tracked in system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No recent activity found.</p>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app._id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="space-y-0.5 max-w-[70%]">
                      {/* 🚀 FIXED: Changed app.company -> app.companyName and app.role -> app.jobTitle */}
                      <p className="text-sm font-semibold truncate text-slate-800">
                        {app.companyName || app.company}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {app.jobTitle || app.role}
                      </p>
                    </div>
                    <Link href={`/applications/${app._id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
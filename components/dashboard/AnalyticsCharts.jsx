import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsCharts({ data = [] }) {
  // 1. Get the actual live total of all logged documents
  const totalApplications = data.length || 0; 
  const displayTotal = totalApplications === 0 ? 1 : totalApplications;

  // 2. 🚀 FIXED: Robust lowercase lookup handling matching ("Applied" === "applied")
  const getStageCount = (statusName) => {
    return data.filter((a) => a.status?.toLowerCase() === statusName.toLowerCase()).length;
  };

  const stages = [
    { label: "Wishlist Entries", count: getStageCount("wishlist"), color: "bg-gray-400" },
    { label: "Applied / Outbox", count: getStageCount("applied"), color: "bg-blue-500" },
    { label: "Interview Funnel", count: getStageCount("interviewing"), color: "bg-amber-500" },
    { label: "Offers Extended", count: getStageCount("offered"), color: "bg-green-500" },
    { label: "Rejections / Archival", count: getStageCount("rejected"), color: "bg-rose-500" },
  ];

  return (
    <Card className="w-full bg-white border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Pipeline Breakdown</CardTitle>
        <CardDescription className="text-slate-400">Visual percentage conversion distribution throughout your pipeline.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {stages.map((stage, idx) => {
          // Compute correct dynamic percentages relative to the total entries array
          const percentage = Math.round((stage.count / displayTotal) * 100);
          
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">{stage.label}</span>
                <span className="font-bold text-slate-800">
                  {stage.count} <span className="font-normal text-xs text-slate-400">({percentage}%)</span>
                </span>
              </div>
              
              {/* Animated Progress Bar Track fill matching your system configuration */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stage.color} transition-all duration-500`} 
                  style={{ width: `${totalApplications === 0 ? 0 : percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
// app/applications/new/page.jsx
import ApplicationForm from "@/components/applications/ApplicationForm";

export const metadata = {
  title: "Track New Role | AI Job Tracker",
  description: "Log a fresh recruitment pipeline card to database ledger metrics.",
};

export default function NewApplicationPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Opportunity</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the parameters below to establish automated AI insight analytics tracing.
        </p>
      </div>
      
      {/* Reusable Core form handling input matrix */}
      <ApplicationForm isEditing={false} />
    </div>
  );
}
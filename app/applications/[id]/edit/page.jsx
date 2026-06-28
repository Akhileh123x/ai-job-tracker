import { notFound } from "next/navigation";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export const metadata = {
  title: "Modify Opportunity Data | AI Job Tracker",
};

export default async function EditApplicationPage({ params }) {
  // 1. Await params cleanly for async router parameters
  const { id } = await params;

  // 2. Prevent a crash if someone types an invalid MongoDB hex ID string in the URL
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  // 3. Connect to your database
  const { db } = await connectToDatabase();

  // 4. 🚀 FIXED: Query "jobapplications" instead of "applications"
  const applicationDoc = await db.collection("jobapplications").findOne({
    _id: new mongoose.Types.ObjectId(id),
  });

  // 5. If no application is found, render the 404 fallback page
  if (!applicationDoc) {
    notFound();
  }

  // 6. Serialize the MongoDB document data safely for the client components
  const applicationData = {
    ...applicationDoc,
    _id: applicationDoc._id.toString(),
    userId: applicationDoc.userId?.toString() || "",
    createdAt: applicationDoc.createdAt?.toISOString() || null,
    // Ensure form state bindings map correctly if database has older schemas:
    companyName: applicationDoc.companyName || applicationDoc.company || "",
    jobTitle: applicationDoc.jobTitle || applicationDoc.role || "",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Update Entry Logs</h1>
        <p className="text-sm text-slate-500">
          Revise statuses, compensation brackets, or target data parameters for{" "}
          <span className="font-semibold text-slate-800">
            {applicationData.companyName}
          </span>
          .
        </p>
      </div>

      {/* Pre-seed input targets dynamically via initialData props injection hook */}
      <ApplicationForm initialData={applicationData} isEditing={true} />
    </div>
  );
}
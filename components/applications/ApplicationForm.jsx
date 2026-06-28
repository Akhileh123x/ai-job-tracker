"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApplicationForm({ initialData = null, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🚀 Map backend schema fields perfectly (companyName, jobTitle, jobType)
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || "",
    jobTitle: initialData?.jobTitle || "",
    jobType: initialData?.jobType || "Full-time",
    status: initialData?.status || "Applied",
    salary: initialData?.salary || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = initialData?._id || initialData?.id;
    const url = isEditing ? `/api/applications/${id}` : "/api/applications";
    const method = isEditing ? "PUT" : "POST";

    // Clean data format matching server parameters explicitly
    const payload = {
      ...formData,
      salary: Number(formData.salary.toString().replace(/[^0-9]/g, "")) || 0
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // 🚀 Redirect straight back to your dynamic list view, not dashboard
        router.push("/applications");
        router.refresh(); 
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error (${res.status}): ${errorData.error || "Unauthorized"}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Network error: Failed to submit application data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 bg-white border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">{isEditing ? "Edit Application" : "Track New Application"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 text-slate-800">
          
          {/* Company Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Company Name</label>
            <Input 
              name="companyName" 
              placeholder="e.g., Google, Stripe" 
              value={formData.companyName} 
              onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
              required 
              className="text-slate-900 bg-white"
            />
          </div>

          {/* Role Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Job Title / Role</label>
            <Input 
              name="jobTitle" 
              placeholder="e.g., Full Stack Engineer" 
              value={formData.jobTitle} 
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} 
              required 
              className="text-slate-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Job Type Selection Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Job Type</label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value) => setFormData({...formData, jobType: value})}
              >
                <SelectTrigger className="w-full bg-white text-slate-900">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Selection Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Application Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="w-full bg-white text-slate-900">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offered">Offered</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Salary / Compensation (Numbers Only)</label>
            <Input 
              name="salary" 
              type="text"
              placeholder="e.g., 120000" 
              value={formData.salary} 
              onChange={(e) => setFormData({...formData, salary: e.target.value})} 
              className="text-slate-900 bg-white"
            />
          </div>

          {/* Notes Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Notes & Follow-ups</label>
            <Textarea 
              name="notes" 
              placeholder="Add details like interview dates, tech stack info..." 
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              className="min-h-[100px] resize-y text-slate-900 bg-white"
            />
          </div>

        </CardContent>
        <CardFooter className="flex justify-between gap-4 border-t border-slate-100 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/applications")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-black hover:bg-neutral-800 text-white">
            {loading ? "Saving..." : isEditing ? "Update Application" : "Save Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
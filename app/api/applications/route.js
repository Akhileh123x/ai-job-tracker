import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { JobApplication } from "@/models/JobApplication";

// POST: Handles creating a new application form submission
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // 1. Unpack incoming properties safely (handles both old form keys and new form keys)
    const companyName = body.companyName || body.company;
    const jobTitle = body.jobTitle || body.role;
    const jobType = body.jobType || "Full-time";
    const status = body.status || "Applied";
    const salary = Number(body.salary) || 0;
    const notes = body.notes || "";

    // 2. CRITICAL MATCH: Bind this to the exact user ID your UI page queries for!
    const mockUserId = "mock-valid-id";

    if (!companyName || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields: Company Name or Job Title" },
        { status: 400 }
      );
    }

    // 3. Save directly into your 'jobapplications' collection
    const newApplication = await JobApplication.create({
      userId: mockUserId,
      companyName,
      jobTitle,
      jobType,
      status,
      salary,
      notes,
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Handles safety lookups if components check via fetch
export async function GET() {
  try {
    await connectToDatabase();
    const mockUserId = "mock-valid-id";
    
    const apps = await JobApplication.find({ userId: mockUserId }).sort({ createdAt: -1 });
    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
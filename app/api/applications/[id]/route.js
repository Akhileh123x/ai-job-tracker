import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { JobApplication } from "@/models/JobApplication";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    
    // 1. Extract and validate ID parameter safely
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID format" }, { status: 400 });
    }

    const body = await request.json();

    // 2. 🚀 FIXED: Read both old and new object fields safely
    const companyName = body.companyName || body.company;
    const jobTitle = body.jobTitle || body.role;
    const jobType = body.jobType || "Full-time";
    const status = body.status || "Applied";
    const salary = Number(body.salary) || 0;
    const notes = body.notes || "";

    // Validation sanity check matching your 400 alert block triggers
    if (!companyName || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields: Company Name or Job Title" },
        { status: 400 }
      );
    }

    // 3. Update the matching document in your jobapplications collection
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      {
        companyName,
        jobTitle,
        jobType,
        status,
        salary,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return NextResponse.json({ error: "Application record not found" }, { status: 404 });
    }

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("API PUT Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
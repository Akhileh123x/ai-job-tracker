"use server";

import { connectToDatabase } from "../lib/mongodb";
import { JobApplication } from "../models/JobApplication";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getApplications(userId, search = "", status = "") {
  await connectToDatabase();
  let query = { userId };
  
  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { jobTitle: { $regex: search, $options: "i" } }
    ];
  }
  if (status && status !== "All") {
    query.status = status;
  }

  const apps = await JobApplication.find(query).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(apps));
}

export async function createApplication(data, userId) {
  await connectToDatabase();
  const newApp = await JobApplication.create({ ...data, userId });
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return JSON.parse(JSON.stringify(newApp));
}

export async function updateApplication(id, data) {
  await connectToDatabase();
  const updated = await JobApplication.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return JSON.parse(JSON.stringify(updated));
}

export async function deleteApplication(id) {
  await connectToDatabase();
  await JobApplication.findByIdAndDelete(id);
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

export async function getApplicationById(id) {
  await connectToDatabase();
  const app = await JobApplication.findById(id);
  return app ? JSON.parse(JSON.stringify(app)) : null;
}

export async function handleServerLogout() {
  // 1. Properly await the async cookies instance and delete the token directly
  const cookieStore = await cookies();
  cookieStore.delete("better-auth.session_token");

  // 2. Perform the server redirect to your login page
  // Note: Keep this outside of try/catch blocks as redirect() intentionally throws an internal Next.js error
  redirect("/login");
}
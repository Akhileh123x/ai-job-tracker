"use server";

import { connectToDatabase } from "../lib/mongodb";
import { User } from "../models/User";
import bcrpyt from "bcryptjs"; 

export async function registerUser(formData) {
  await connectToDatabase();
  const { name, email, password } = formData;
  
  const existing = await User.findOne({ email });
  if (existing) return { error: "User already exists" };

  const hashedPassword = await bcrpyt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  
  return { success: true, userId: user._id.toString() };
}
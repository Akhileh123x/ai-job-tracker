import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { messages, extractedContext } = await request.json();
    
    // Connect to database to fetch tracking items context dynamically
    const { db } = await connectToDatabase();
    const activeJobs = await db.collection("jobapplications")
      .find({ userId: "mock-valid-id" })
      .toArray();

    // 🔥 STRIP OUT THE FIRST STATIC FRONTEND GREETING MESSAGE TO KEEP ALIGNMENT BALANCED
    const actualConversation = messages.filter((_, index) => index !== 0);

    // Map history to match strict turn constraints (user/model)
    const formattedHistory = actualConversation.map(msg => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Send context parameters directly via systemInstruction configurations
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: `You are an elite AI Career Advisor inside a job tracker application.
        Candidate Extracted Resume Data: ${extractedContext || "No resume uploaded yet."}
        Active User Tracked Jobs Cluster: ${JSON.stringify(activeJobs)}
        
        Provide tailored suggestions and answer questions accurately based on this information. Keep responses clean and professional.`
      }
    });

    return NextResponse.json({ reply: response.text }, { status: 200 });
  } catch (error) {
    console.error("Chat engine runtime fault:", error);
    return NextResponse.json({ error: "Failed to generate text content" }, { status: 500 });
  }
}
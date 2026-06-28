import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No document file uploaded" }, { status: 400 });
    }

    // 1. Convert the browser multipart file stream into a Node standard buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 2. Format the buffer payload into Gemini's native inline multi-modal structure
    const filePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: "application/pdf"
      }
    };

    // 3. Process data seamlessly using the updated production engine model string
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        filePart,
        `You are an expert technical resume data parser. Extract the following details from this uploaded PDF resume file:
        1. Core Skills (as a single line comma-separated list)
        2. Experience summary statement
        3. Top Strengths matching their history
        
        Ensure your output strictly follows this structure without adding conversational text around it:
        Skills: [comma separated list]
        Experience: [experience summary]
        Top Strengths: [strengths separated by commas]`
      ],
    });

    return NextResponse.json({ data: response.text.trim() }, { status: 200 });
  } catch (error) {
    console.error("Native Gemini parser error:", error);
    return NextResponse.json({ error: "Failed to extract text data natively" }, { status: 500 });
  }
}
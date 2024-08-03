import { db } from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt, tone, phoneNumber, purpose, voice, lengthOfCall } = await request.json();

    const docRef = db.collection("calls").doc();

    const newDoc = {
      id: docRef.id,
      prompt: prompt,
      tone: tone,
      phoneNumber: phoneNumber,
      purpose: purpose,
      voice: voice,
      lengthOfCall: lengthOfCall,
      createdAt: new Date().toISOString(),
      completionStatus: "pending",
      recordingURL: null
    };

    await docRef.set(newDoc);

    return NextResponse.json({ message: "Document added successfully", document: newDoc }, { status: 201 });
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

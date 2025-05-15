import { NextResponse } from "next/server";
import { mockScanResult } from "@/utils/mockData";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // At this point, buffer contains the file contents (you could scan it, save it, etc.)

    return NextResponse.json(mockScanResult);
  } catch (err) {
    console.error("File scan error:", err);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}

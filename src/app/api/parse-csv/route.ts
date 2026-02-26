// app/api/parse-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseShazamCSVRobust } from "@/lib/csv-parser";
import { withRateLimit } from "@/lib/security/withRateLimit";

async function handler(request: NextRequest) {
  try {
    const { csvData } = await request.json();

    if (!csvData || typeof csvData !== "string") {
      return NextResponse.json(
        { error: "No CSV data provided" },
        { status: 400 },
      );
    }

    const tracks = parseShazamCSVRobust(csvData);

    return NextResponse.json({
      tracks,
      parsedCount: tracks.length,
    });
  } catch (error) {
    console.error("CSV parsing error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to parse CSV file",
      },
      { status: 400 },
    );
  }
}

export const POST = withRateLimit(handler, "upload");

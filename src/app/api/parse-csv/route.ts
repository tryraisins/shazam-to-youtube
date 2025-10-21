// app/api/parse-csv/route.ts
import { NextResponse } from 'next/server';
import { parseShazamCSVRobust } from '@/lib/csv-parser';

export async function POST(request: Request) {
  try {
    const { csvData } = await request.json();
    
    if (!csvData || typeof csvData !== 'string') {
      return NextResponse.json(
        { error: 'No CSV data provided' },
        { status: 400 }
      );
    }

    const tracks = parseShazamCSVRobust(csvData);
    
    return NextResponse.json({ 
      tracks,
      parsedCount: tracks.length,
    });
    
  } catch (error) {
    console.error('CSV parsing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse CSV file' },
      { status: 400 }
    );
  }
}
// lib/csv-parser.ts
import { parse } from 'csv-parse/sync';

export interface ShazamTrack {
  title: string;
  artist: string;
  album?: string;
}

// Define the expected structure of your Shazam CSV records
interface ShazamCSVRecord {
  Index?: string;
  TagTime?: string;
  Title?: string;
  Artist?: string;
  URL?: string;
  TrackKey?: string;
  // Allow for any other properties that might exist
  [key: string]: unknown;
}

export const parseShazamCSV = (csvData: string): ShazamTrack[] => {
  try {
    // Clean the CSV data - remove the "Shazam Library" header line
    const cleanedCSVData = csvData
      .split('\n')
      .filter(line => !line.includes('Shazam Library')) // Remove the header line
      .join('\n')
      .trim();

    if (!cleanedCSVData) {
      throw new Error('No valid data found after cleaning CSV');
    }

    // Explicitly type the parsed records with explicit column names
    const records: ShazamCSVRecord[] = parse(cleanedCSVData, {
      columns: ['Index', 'TagTime', 'Title', 'Artist', 'URL', 'TrackKey'], // Explicit column names
      skip_empty_lines: true,
      trim: true,
      skip_records_with_error: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    console.log(`Parsed ${records.length} raw records from CSV`);

    const tracks: ShazamTrack[] = [];

    for (const record of records) {
      try {
        // Skip the first record if it's empty or invalid
        if (!record.Title && !record.Artist) {
          continue;
        }

        const title = record.Title;
        const artist = record.Artist;

        // Type guard to ensure we have strings
        if (typeof title !== 'string' || typeof artist !== 'string') {
          console.warn('Skipping record with invalid title or artist type:', record);
          continue;
        }

        const trimmedTitle = title.trim();
        const trimmedArtist = artist.trim();

        if (!trimmedTitle || !trimmedArtist) {
          console.warn('Skipping record with empty title or artist after trimming:', record);
          continue;
        }

        // Skip if it's just column headers
        if (trimmedTitle === 'Title' && trimmedArtist === 'Artist') {
          continue;
        }

        tracks.push({
          title: trimmedTitle,
          artist: trimmedArtist,
          // Album is not available in your Shazam export
        });
      } catch (recordError) {
        console.warn('Error processing individual record:', recordError, record);
        continue;
      }
    }

    if (tracks.length === 0) {
      throw new Error('No valid tracks found in CSV file after parsing');
    }

    console.log(`Successfully parsed ${tracks.length} tracks from CSV`);
    return tracks;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`CSV parsing failed: ${error.message}`);
    }
    throw new Error('CSV parsing failed: Unknown parsing error');
  }
};

// Alternative approach that handles the CSV more manually
export const parseShazamCSVManual = (csvData: string): ShazamTrack[] => {
  try {
    // Split by lines and clean up
    const lines = csvData
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.includes('Shazam Library')) // Remove header
      .filter(line => !line.startsWith('Index,TagTime,Title,Artist,URL,TrackKey')); // Remove column header if present

    if (lines.length === 0) {
      throw new Error('No valid data lines found in CSV');
    }

    const tracks: ShazamTrack[] = [];

    for (const line of lines) {
      try {
        // Use a simpler CSV parsing approach for this specific format
        const columns = parseLine(line);
        
        if (columns.length >= 4) { // We need at least Index, TagTime, Title, Artist
          const title = columns[2]?.replace(/^"|"$/g, '').trim(); // Remove quotes if present
          const artist = columns[3]?.replace(/^"|"$/g, '').trim(); // Remove quotes if present

          if (title && artist && title !== 'Title' && artist !== 'Artist') {
            tracks.push({
              title,
              artist,
            });
          }
        }
      } catch (lineError) {
        console.warn('Error processing line:', lineError, line);
        continue;
      }
    }

    if (tracks.length === 0) {
      throw new Error('No valid tracks found in CSV file');
    }

    return tracks;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Manual CSV parsing failed: ${error.message}`);
    }
    throw new Error('Manual CSV parsing failed: Unknown error');
  }
};

// Helper function to parse a single CSV line
function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Push the last field
  return result;
}

// Try multiple parsing methods
export const parseShazamCSVRobust = (csvData: string): ShazamTrack[] => {
  // First try the standard parser
  try {
    return parseShazamCSV(csvData);
  } catch (error) {
    console.log('Standard parser failed, trying manual parser:', error);
    
    // Fall back to manual parser
    try {
      return parseShazamCSVManual(csvData);
    } catch (manualError) {
      throw new Error(`All parsing methods failed. Last error: ${manualError instanceof Error ? manualError.message : 'Unknown error'}`);
    }
  }
};
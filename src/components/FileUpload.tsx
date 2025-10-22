'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShazamTrack } from '@/lib/csv-parser';
import { CheckCircle, UploadCloud, X } from 'lucide-react';

interface FileUploadProps {
  onTracksParsed: (tracks: ShazamTrack[]) => void;
  onParsingStateChange: (isParsing: boolean) => void; // New prop
}

export default function FileUpload({
  onTracksParsed,
  onParsingStateChange, // Get new prop
}: FileUploadProps) {
  const [isParsing, setIsParsing] = useState(false); // Renamed for clarity
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsParsing(true);
      onParsingStateChange(true); // Notify parent: START
      setFileName(file.name);

      try {
        const text = await file.text();

        // Send to API for parsing
        const response = await fetch('/api/parse-csv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ csvData: text }),
        });

        if (response.ok) {
          const { tracks, parsedCount, totalCount } = await response.json();

          // Validate that we got proper track data
          if (Array.isArray(tracks)) {
            onTracksParsed(tracks); // Send tracks to parent

            // Show parsing stats if available
            if (parsedCount !== undefined && totalCount !== undefined) {
              console.log(
                `Parsed ${parsedCount} out of ${totalCount} tracks successfully`
              );
            }
          } else {
            throw new Error('Invalid track data received from server');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse CSV');
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert(
          `Error processing file: ${
            error instanceof Error ? error.message : 'Unknown error'
          }. Please make sure it's a valid Shazam CSV export.`
        );
        setFileName(null);
        onTracksParsed([]); // Clear tracks on error
      } finally {
        setIsParsing(false);
        onParsingStateChange(false); // Notify parent: END
      }
    },
    [onTracksParsed, onParsingStateChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
  });

  const handleReset = () => {
    setFileName(null);
    onTracksParsed([]);
  };

  return (
    <div className="w-full">
      {/* Show success message only when parsing is done AND we have a filename */}
      {fileName && !isParsing ? (
        <div className="border-2 border-green-500/30 bg-green-500/10 rounded-lg p-6 text-center relative">
          <button
            onClick={handleReset}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-green-300 font-medium">File uploaded successfully!</p>
          <p className="text-sm text-green-400 mt-1">{fileName}</p>
          <p className="text-xs text-gray-400 mt-2">
            Ready to create YouTube playlist
          </p>
        </div>
      ) : (
        // Show dropzone or parsing state
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-gray-600 hover:border-gray-500 bg-white/5 hover:bg-white/10'
          } ${isParsing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={isParsing} />

          {isParsing ? (
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-400 mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-300">Processing CSV file...</p>
              <p className="text-xs text-gray-500 mt-1">
                {fileName || 'This may take a moment'}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-3">
                <UploadCloud className="w-12 h-12 text-gray-500" />
              </div>
              <p className="text-gray-300 mb-2">
                {isDragActive
                  ? 'Drop the CSV file here...'
                  : 'Drag & drop your Shazam CSV file, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Must be a .csv file exported from Shazam
              </p>
              <div className="bg-gray-900/50 rounded-lg p-3 text-left">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Expected format:
                </p>
                <p className="text-xs text-gray-500">
                  Columns: Title, Artist, Album (optional)
                </p>
                <p className="text-xs text-gray-500">
                  Example: &quot;Little Dark Age,MGMT&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
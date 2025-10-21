'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShazamTrack } from '@/lib/csv-parser'; // Fixed import path

interface FileUploadProps {
  onTracksParsed: (tracks: ShazamTrack[]) => void;
}

export default function FileUpload({ onTracksParsed }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
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
          onTracksParsed(tracks);
          
          // Show parsing stats if available
          if (parsedCount !== undefined && totalCount !== undefined) {
            console.log(`Parsed ${parsedCount} out of ${totalCount} tracks successfully`);
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
      alert(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure it's a valid Shazam CSV export.`);
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  }, [onTracksParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false,
  });

  const handleReset = () => {
    setFileName(null);
    onTracksParsed([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upload Shazam CSV</h2>
        {fileName && (
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Reset
          </button>
        )}
      </div>
      
      {fileName ? (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-green-700 font-medium">File uploaded successfully!</p>
          <p className="text-sm text-green-600 mt-1">{fileName}</p>
          <p className="text-xs text-green-500 mt-2">
            Ready to create YouTube playlist
          </p>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={isProcessing} />
          
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Processing CSV file...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                {isDragActive
                  ? 'Drop the CSV file here...'
                  : 'Drag & drop your Shazam CSV file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Export your Shazam history as CSV and upload it here
              </p>
              <div className="bg-gray-100 rounded-lg p-3 text-left">
                <p className="text-xs text-gray-600 font-medium mb-1">Expected CSV format:</p>
                <p className="text-xs text-gray-500">Columns: Title, Artist, Album (optional)</p>
                <p className="text-xs text-gray-500">Example: &quot;Little Dark Age,MGMT&quot;</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
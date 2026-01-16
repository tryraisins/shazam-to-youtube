'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShazamTrack } from '@/lib/csv-parser';
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import gsap from 'gsap';

interface FileUploadProps {
  onTracksParsed: (tracks: ShazamTrack[]) => void;
  onParsingStateChange: (isParsing: boolean) => void;
}

export default function FileUpload({
  onTracksParsed,
  onParsingStateChange,
}: FileUploadProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Animation on mount
  useEffect(() => {
    if (dropzoneRef.current && !fileName) {
      gsap.fromTo(
        dropzoneRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  }, [fileName]);

  // Success animation
  useEffect(() => {
    if (successRef.current && fileName && !isParsing) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
      );
    }
  }, [fileName, isParsing]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsParsing(true);
      onParsingStateChange(true);
      setFileName(file.name);

      try {
        const text = await file.text();

        const response = await fetch('/api/parse-csv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ csvData: text }),
        });

        if (response.ok) {
          const { tracks, parsedCount, totalCount } = await response.json();

          if (Array.isArray(tracks)) {
            onTracksParsed(tracks);

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
          `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'
          }. Please make sure it's a valid Shazam CSV export.`
        );
        setFileName(null);
        onTracksParsed([]);
      } finally {
        setIsParsing(false);
        onParsingStateChange(false);
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
    if (dropzoneRef.current) {
      gsap.to(dropzoneRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setFileName(null);
          onTracksParsed([]);
        },
      });
    } else {
      setFileName(null);
      onTracksParsed([]);
    }
  };

  return (
    <div className="w-full">
      {fileName && !isParsing ? (
        // Success state
        <div
          ref={successRef}
          className="glass-card p-8 text-center relative overflow-hidden"
        >
          {/* Decorative gradient background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.3) 0%, transparent 60%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-all duration-300 cursor-pointer group"
          >
            <XMarkIcon className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
          </button>

          {/* Success icon with glow */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute w-20 h-20 rounded-full bg-ocean-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center shadow-neon-ocean">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3
            className="text-xl font-bold text-[var(--text-primary)] mb-2"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            File Uploaded Successfully!
          </h3>

          <div className="flex items-center justify-center gap-2 mb-3">
            <DocumentTextIcon className="w-5 h-5 text-ocean-500" />
            <span className="text-[var(--text-secondary)] font-medium">
              {fileName}
            </span>
          </div>

          <p className="text-sm text-[var(--text-muted)]">
            Ready to create your YouTube playlist
          </p>
        </div>
      ) : (
        // Dropzone state
        <div
          ref={dropzoneRef}
          {...getRootProps()}
          className={`glass-card p-10 text-center relative overflow-hidden transition-all duration-500 cursor-pointer ${isDragActive ? 'ring-2 ring-coral-500/50' : ''
            } ${isParsing ? 'opacity-70 cursor-wait' : ''}`}
        >
          <input {...getInputProps()} disabled={isParsing} />

          {/* Animated border gradient on drag */}
          {isDragActive && (
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255, 107, 69, 0.2) 0%, rgba(245, 158, 11, 0.2) 50%, rgba(20, 184, 166, 0.2) 100%)',
                animation: 'shimmer 1.5s linear infinite',
                backgroundSize: '200% 100%',
              }}
            />
          )}

          {isParsing ? (
            // Loading state
            <div className="flex flex-col items-center relative z-10">
              {/* Vinyl record loading animation */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 vinyl-record animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-coral-500 to-amber-500" />
                </div>
              </div>

              <p
                className="text-[var(--text-primary)] font-semibold mb-2"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Processing Your Music...
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {fileName || 'Analyzing your Shazam data'}
              </p>

              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-[var(--surface)] rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-coral-500 via-amber-500 to-ocean-500 shimmer"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ) : (
            // Ready state
            <div className="relative z-10">
              {/* Upload icon with glow effect */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div
                  className={`absolute w-24 h-24 rounded-full transition-all duration-500 ${isDragActive ? 'scale-110 bg-coral-500/20' : 'scale-100 bg-coral-500/10'
                    }`}
                />
                <div
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isDragActive
                      ? 'bg-gradient-to-br from-coral-500 to-amber-500 shadow-neon-coral'
                      : 'bg-[var(--surface-elevated)]'
                    }`}
                >
                  <ArrowUpTrayIcon
                    className={`w-10 h-10 transition-colors duration-500 ${isDragActive ? 'text-white' : 'text-coral-500'
                      }`}
                  />
                </div>
              </div>

              <h3
                className="text-xl font-bold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {isDragActive ? 'Drop it like it\'s hot!' : 'Drop Your Music File'}
              </h3>

              <p className="text-[var(--text-secondary)] mb-6">
                {isDragActive
                  ? 'Release to upload your Shazam CSV'
                  : 'Drag & drop your Shazam CSV file here, or click to browse'}
              </p>

              {/* File format info */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                <div className="w-2 h-2 rounded-full bg-coral-500" />
                <span className="text-sm text-[var(--text-muted)]">
                  Accepts .csv files from Shazam
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
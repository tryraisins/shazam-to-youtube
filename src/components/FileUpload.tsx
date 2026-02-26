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

  useEffect(() => {
    if (dropzoneRef.current && !fileName) {
      gsap.fromTo(
        dropzoneRef.current,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' }
      );
    }
  }, [fileName]);

  useEffect(() => {
    if (successRef.current && fileName && !isParsing) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.95, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvData: text }),
        });

        if (response.ok) {
          const { tracks } = await response.json();
          if (Array.isArray(tracks)) {
            onTracksParsed(tracks);
          } else {
            throw new Error('Invalid track data received from server');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse CSV');
        }
      } catch (error) {
        alert(
          `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure it's a valid Shazam CSV export.`
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
    accept: { 'text/csv': ['.csv'], 'text/plain': ['.csv'], 'application/vnd.ms-excel': ['.csv'] },
    multiple: false,
  });

  const handleReset = () => {
    if (dropzoneRef.current) {
      gsap.to(dropzoneRef.current, {
        scale: 0.98, opacity: 0, duration: 0.2,
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
        <div ref={successRef} className="glass-card p-8 text-center relative border-l-4 border-l-secondary overflow-hidden">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 bg-surface hover:bg-surface-elevated transition-colors duration-300 group"
          >
            <XMarkIcon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
          </button>

          <div className="relative inline-flex items-center justify-center mb-6 mt-2">
            <div className="absolute w-20 h-20 rounded-full bg-secondary/20 animate-pulse-slow" />
            <div className="relative w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center border border-secondary shadow-[0_0_20px_var(--secondary)]">
              <CheckCircleIcon className="w-8 h-8 text-secondary" />
            </div>
          </div>

          <h3 className="text-xl font-display text-text-primary mb-2">
            Geometry Acquired
          </h3>

          <div className="flex items-center justify-center gap-2 mb-4">
            <DocumentTextIcon className="w-5 h-5 text-secondary" />
            <span className="text-text-secondary font-medium tracking-wide">
              {fileName}
            </span>
          </div>

          <p className="text-sm text-text-muted">
            Ready for sequence generation
          </p>
        </div>
      ) : (
        <div
          ref={dropzoneRef}
          {...getRootProps()}
          className={`glass-card p-10 text-center relative overflow-hidden transition-all duration-500 cursor-pointer ${isDragActive ? 'border-primary bg-surface-elevated/50' : ''} ${isParsing ? 'opacity-70 cursor-wait pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} disabled={isParsing} />

          {isParsing ? (
            <div className="flex flex-col items-center relative z-10 py-8">
              <div className="relative w-16 h-16 mb-8">
                <div className="absolute inset-0 border-[3px] border-t-primary border-r-secondary border-b-accent border-l-transparent rounded-full animate-spin-slow" style={{ animationDuration: '1.5s' }} />
                <div className="absolute inset-2 border-[2px] border-dashed border-text-muted rounded-full animate-spin-slow" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
              </div>

              <p className="text-text-primary font-display mb-2 text-lg">
                Analyzing Frequencies...
              </p>

              <div className="w-32 h-[1px] bg-border mt-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-primary animate-pulse-slow" style={{ width: '100%' }} />
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="relative inline-flex items-center justify-center mb-8">
                <div className={`absolute w-full h-full pb-4 border-b border-primary transition-all duration-500 ${isDragActive ? 'scale-x-110 opacity-100' : 'scale-x-50 opacity-0'}`} />
                <div className={`relative w-20 h-20 rounded-sm flex items-center justify-center transition-all duration-500 bg-surface border ${isDragActive ? 'border-primary text-primary shadow-[0_0_30px_var(--primary)]' : 'border-border text-text-muted'}`}>
                  <ArrowUpTrayIcon className="w-8 h-8" />
                </div>
              </div>

              <h3 className="text-2xl font-display text-text-primary mb-4 tracking-tight">
                {isDragActive ? 'Release Sequence' : 'Initialize Data'}
              </h3>

              <p className="text-text-secondary mb-8 font-light">
                {isDragActive
                  ? 'Drop CSV to commence'
                  : 'Drag & drop your Shazam CSV here, or click to browse'}
              </p>

              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background border border-border text-xs uppercase tracking-widest text-text-muted font-display">
                <div className="w-1.5 h-1.5 bg-primary" />
                Accepts .csv
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
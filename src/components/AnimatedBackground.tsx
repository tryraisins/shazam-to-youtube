'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
      {/* Underlying Geometric Grid */}
      <div className="absolute inset-0 bg-geometry opacity-50" />

      {/* Abstract radial light for depth */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-primary blur-[120px] mix-blend-soft-light" />
      </div>

      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary blur-[150px] mix-blend-soft-light opacity-20 animate-pulse-slow" />

      {/* Subtle geometric shapes mapped to background */}
      <div className="absolute top-20 right-[10%] w-64 h-64 border-[1px] border-primary opacity-20 rounded-full animate-spin-slow" style={{ borderStyle: 'dashed' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 border-[1px] border-secondary opacity-10 animate-float" />

      {/* Persistent noise for texture */}
      <div className="noise-overlay" />
    </div>
  );
}
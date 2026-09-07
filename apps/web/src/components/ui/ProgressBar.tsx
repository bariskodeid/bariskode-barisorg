export function ProgressBar({ percentage }: { percentage: number }) {
  const clamped = Math.min(100, Math.max(0, percentage))

  return (
    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full bg-white transition-all"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

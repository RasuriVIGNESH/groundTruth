export default function MapLegend() {
  return (
    <div className="bg-[var(--color-paper-raised)] border border-[var(--color-line)] p-4 rounded-sm shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border border-[var(--color-line)]" style={{ backgroundColor: 'var(--color-rise-tint)' }}></div>
        <span className="text-body-sm text-[var(--color-ink)]">Projected Rise</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border border-[var(--color-line)]" style={{ backgroundColor: 'var(--color-fall-tint)' }}></div>
        <span className="text-body-sm text-[var(--color-ink)]">Projected Fall</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border border-[var(--color-line)] bg-[var(--color-line)] opacity-60"></div>
        <span className="text-body-sm text-[var(--color-ink)]">No Data / Neutral</span>
      </div>
    </div>
  );
}

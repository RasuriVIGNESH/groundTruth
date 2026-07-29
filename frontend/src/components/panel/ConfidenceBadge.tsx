interface ConfidenceBadgeProps {
  score: number;
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const percentage = Math.round(score * 100);
  
  return (
    <div className="inline-flex items-center px-2 py-1 bg-[var(--color-marigold)] text-[var(--color-paper)] rounded-[8px] text-data-sm shadow-sm" title="Confidence Score">
      {percentage}% confidence
    </div>
  );
}

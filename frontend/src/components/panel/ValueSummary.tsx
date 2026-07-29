import { formatCurrency } from '../../utils/formatCurrency';
import DirectionGlyph from '../shared/DirectionGlyph';
import ConfidenceBadge from './ConfidenceBadge';
import { RegionDetail } from '../../api/types';

export default function ValueSummary({ detail }: { detail: RegionDetail }) {
  return (
    <div className="py-6 border-b border-[var(--color-line)] flex flex-col gap-6">
      <div>
        <p className="text-body-sm text-[var(--color-ink-60)] mb-1">Government market value</p>
        <div className="flex items-baseline gap-2">
          <span className="text-data-lg text-[var(--color-ink)]">
            {formatCurrency(detail.currentValue, '')}
          </span>
          <span className="text-data-sm text-[var(--color-ink-60)]">
            {detail.valueUnit}
          </span>
        </div>
        <p className="text-data-sm text-[var(--color-ink-30)] mt-1">
          Last updated: {detail.lastUpdated}
        </p>
      </div>

      {detail.projectedRange && (
        <div className="bg-[var(--color-paper)] p-4 border border-[var(--color-line)] rounded-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-body-sm text-[var(--color-ink-60)]">Projected range</p>
            {detail.confidenceScore !== null && (
              <ConfidenceBadge score={detail.confidenceScore} />
            )}
          </div>
          <div className="flex items-center gap-3">
            <DirectionGlyph direction={detail.direction} />
            <span className="text-data-md" style={{ color: detail.direction === 'rise' ? 'var(--color-rise)' : (detail.direction === 'fall' ? 'var(--color-fall)' : 'var(--color-ink)') }}>
              {formatCurrency(detail.projectedRange[0], '')} – {formatCurrency(detail.projectedRange[1], '')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

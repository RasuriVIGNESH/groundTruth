import { useEffect, useState } from 'react';
import { useRegionDetail } from '../../hooks/useRegionDetail';
import { useRegions } from '../../hooks/useRegions';
import { useSelectedState } from '../../hooks/useSelectedState';
import LedgerPanelTab from './LedgerPanelTab';
import ValueSummary from './ValueSummary';
import ExplanationTrail from './ExplanationTrail';
import EmptyProjectionState from './EmptyProjectionState';

interface LedgerPanelProps {
  regionId: string | null;
  onClose: () => void;
}

export default function LedgerPanel({ regionId, onClose }: LedgerPanelProps) {
  const [selectedState] = useSelectedState();
  const { data: regions } = useRegions(selectedState);
  
  // Optimistically get the name from the regions list
  const selectedRegionSummary = regions?.find(r => r.id === regionId);
  const { data: detail, isError, isLoading } = useRegionDetail(regionId);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (regionId) {
      // Small delay to let the tab appear before sliding open, matching the design spec
      const t = setTimeout(() => setIsOpen(true), 80);
      return () => clearTimeout(t);
    } else {
      setIsOpen(false);
    }
  }, [regionId]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 220); // wait for animation before unmounting
  };

  if (!regionId && !isOpen) return null;

  return (
    <div 
      className="absolute top-0 right-0 h-full w-full md:w-[420px] bg-[var(--color-paper-raised)] border-l border-[var(--color-line)] shadow-lg z-[500]"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {selectedRegionSummary && !isOpen && (
        <LedgerPanelTab regionName={selectedRegionSummary.name} onClick={() => setIsOpen(true)} />
      )}

      <div className="h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start sticky top-0 bg-[var(--color-paper-raised)] z-10 border-b border-[var(--color-line)]">
          <div>
            <h2 className="text-display-md text-[var(--color-ink)] mb-1">
              {detail ? detail.name : selectedRegionSummary?.name || 'Loading...'}
            </h2>
            <p className="text-body-sm text-[var(--color-ink-60)]">
              {detail ? `${detail.mandal}, ${detail.district}` : '...'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 text-[var(--color-ink-60)] hover:text-[var(--color-ink)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-marigold)] rounded-sm"
            aria-label="Close panel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 flex-grow">
          {isError ? (
            <div className="py-4 border-l-2 border-[var(--color-fall)] pl-4 mt-4">
              <p className="text-body text-[var(--color-ink)]">Record unavailable. Check your connection and try again.</p>
            </div>
          ) : isLoading || !detail ? (
            <div className="py-8 text-center text-body text-[var(--color-ink-60)]">
              Retrieving record...
            </div>
          ) : (
            <>
              <ValueSummary detail={detail} />
              
              {detail.projection?.contributingArticles ? (
                <ExplanationTrail articles={detail.projection.contributingArticles} />
              ) : (
                <EmptyProjectionState />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

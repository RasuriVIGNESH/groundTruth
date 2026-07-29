interface LedgerPanelTabProps {
  regionName: string;
  onClick: () => void;
}

export default function LedgerPanelTab({ regionName, onClick }: LedgerPanelTabProps) {
  return (
    <button 
      onClick={onClick}
      className="absolute right-full top-16 -mr-[1px] bg-[var(--color-paper-raised)] border border-[var(--color-line)] border-r-0 px-2 py-4 rounded-l-sm shadow-sm cursor-pointer z-[100] transform origin-right hover:bg-[var(--color-paper)] focus-visible:outline-2 focus-visible:outline-[var(--color-marigold)]"
      style={{ writingMode: 'vertical-rl' }}
    >
      <span className="text-display-md text-[var(--color-ink)] transform rotate-180 whitespace-nowrap">
        {regionName}
      </span>
    </button>
  );
}

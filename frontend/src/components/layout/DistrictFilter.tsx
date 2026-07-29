interface DistrictFilterProps {
  value: string | null;
  onChange: (district: string | null) => void;
  availableDistricts: string[];
}

export default function DistrictFilter({ value, onChange, availableDistricts }: DistrictFilterProps) {
  return (
    <div className="flex items-center ml-4 border-l border-[var(--color-line)] pl-4">
      <select
        className="text-body-sm bg-transparent border-none outline-none cursor-pointer text-[var(--color-ink-60)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-marigold)]"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Show all districts</option>
        {availableDistricts.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}

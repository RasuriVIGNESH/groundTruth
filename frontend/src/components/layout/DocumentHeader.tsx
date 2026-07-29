import { STATES } from '../../config/states';
import { useRegions } from '../../hooks/useRegions';
import { useSelectedState } from '../../hooks/useSelectedState';
import { useSearchParams } from 'react-router-dom';
import StateSelector from './StateSelector';
import DistrictFilter from './DistrictFilter';
import { useMemo } from 'react';

export default function DocumentHeader() {
  const [selectedState, setSelectedState] = useSelectedState();
  const [searchParams, setSearchParams] = useSearchParams();
  const district = searchParams.get('district');

  const { data: regions } = useRegions(selectedState);
  
  const availableDistricts = useMemo(() => {
    if (!regions) return [];
    const districts = new Set(regions.map(r => r.district));
    return Array.from(districts).sort();
  }, [regions]);

  const setDistrict = (newDistrict: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newDistrict) {
        next.set('district', newDistrict);
      } else {
        next.delete('district');
      }
      return next;
    }, { replace: true });
  };

  return (
      <header className="layout-header shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img
              src="/logo.svg"
              alt="Ground Truth Logo"
              className="w-8 h-8 object-contain rounded-sm"
          />
          <h1 className="text-body font-semibold text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-display)' }}>
            Ground Truth
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <StateSelector
              value={selectedState}
              onChange={setSelectedState}
              states={STATES}
          />
          <DistrictFilter
              value={district}
              onChange={setDistrict}
              availableDistricts={availableDistricts}
          />
        </div>
      </header>
  );
}

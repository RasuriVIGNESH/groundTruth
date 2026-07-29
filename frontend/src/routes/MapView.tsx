import { Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import DocumentHeader from '../components/layout/DocumentHeader';
import DisclaimerFooter from '../components/layout/DisclaimerFooter';
import LedgerPanel from '../components/panel/LedgerPanel';
import Skeleton from '../components/shared/Skeleton';
import { useSelectedState } from '../hooks/useSelectedState';
import { useSelectedRegion } from '../hooks/useSelectedRegion';
import { useRegions } from '../hooks/useRegions';

// Lazy load the heavy map component
const RegionMap = lazy(() => import('../components/map/RegionMap'));

export default function MapView() {
  const [selectedState] = useSelectedState();
  const [selectedRegionId, setSelectedRegionId] = useSelectedRegion();
  const [searchParams] = useSearchParams();
  const district = searchParams.get('district');
  
  const { data: regions, isLoading, isError } = useRegions(selectedState, district);

  return (
    <div className="layout-container">
      <DocumentHeader />
      
      <main className="layout-main relative bg-[var(--color-paper-raised)]">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Skeleton />
          </div>
        )}
        
        {isError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-paper-raised)]">
            <p className="text-body text-[var(--color-ink)]">Failed to load region data.</p>
          </div>
        )}

        <Suspense fallback={<Skeleton />}>
          {regions && (
            <RegionMap 
              regions={regions} 
              selectedState={selectedState}
              selectedRegionId={selectedRegionId} 
              onSelectRegion={setSelectedRegionId} 
            />
          )}
        </Suspense>

        <LedgerPanel 
          regionId={selectedRegionId} 
          onClose={() => setSelectedRegionId(null)} 
        />
      </main>
      
      <DisclaimerFooter />
    </div>
  );
}

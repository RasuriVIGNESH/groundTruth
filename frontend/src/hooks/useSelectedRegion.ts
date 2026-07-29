import { useSearchParams } from 'react-router-dom';

export function useSelectedRegion() {
  const [searchParams, setSearchParams] = useSearchParams();
  const regionId = searchParams.get('regionId');

  const setSelectedRegion = (newId: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newId) {
          next.set('regionId', newId);
        } else {
          next.delete('regionId');
        }
        return next;
      },
      { replace: true }
    );
  };

  return [regionId, setSelectedRegion] as const;
}

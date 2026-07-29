import { useSearchParams } from 'react-router-dom';

export function useSelectedState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get('state') || 'telangana';

  const setSelectedState = (newState: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('state', newState);
        next.delete('regionId'); // Reset region when state changes
        next.delete('district'); // Reset district when state changes
        return next;
      },
      { replace: true }
    );
  };

  return [state, setSelectedState] as const;
}

import { useQuery } from '@tanstack/react-query';
import { regionService } from '../services/regionService.ts';
import { RegionSummary } from '../services/types.ts';

export function useRegions(state: string, district?: string | null) {
    return useQuery<RegionSummary[]>({
        queryKey: ['regions', state, district],
        queryFn: () => regionService.getRegions(state, district),
        staleTime: 5 * 60 * 1000,
    });
}
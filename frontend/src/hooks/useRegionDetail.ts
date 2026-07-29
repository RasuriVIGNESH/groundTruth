import { useQuery } from '@tanstack/react-query';
import { regionService } from '../services/regionService.ts';
import { RegionDetail } from '../services/types.ts';

export function useRegionDetail(regionId: string | null) {
    return useQuery<RegionDetail>({
        queryKey: ['region', regionId],
        queryFn: () => {
            if (!regionId) throw new Error('No region selected');
            return regionService.getRegionById(regionId);
        },
        enabled: !!regionId,
        staleTime: 5 * 60 * 1000,
    });
}
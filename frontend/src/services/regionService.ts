import { httpClient } from './httpClient';
import { BackendRegionDetail, BackendRegionSummary } from './backendTypes';
import { ContributingArticle, RegionDetail, RegionSummary } from './types';

function deriveDirection(
    baseValue: number,
    low: number | null,
    high: number | null
): 'rise' | 'fall' | 'neutral' {
    if (low == null || high == null) return 'neutral';
    const midpoint = (low + high) / 2;
    if (midpoint > baseValue) return 'rise';
    if (midpoint < baseValue) return 'fall';
    return 'neutral';
}

function toRegionSummary(row: BackendRegionSummary): RegionSummary {
    return {
        id: row.id,
        name: row.name,
        district: row.district,
        state: row.state,
        currentValue: row.baseValue,
        valueUnit: row.baseValueUnit,
        projectedRange:
            row.projectedValueLow != null && row.projectedValueHigh != null
                ? [row.projectedValueLow, row.projectedValueHigh]
                : null,
        direction: deriveDirection(row.baseValue, row.projectedValueLow, row.projectedValueHigh),
        confidenceScore: row.confidenceScore,
        geometry: row.geometry,
    };
}

function toContributingArticle(a: any): ContributingArticle {
    return {
        id: a.id,
        sourceName: a.source,
        headline: a.title,
        publishedDate: a.publishedDate,
        projectType: a.projectType,
        impactMagnitude:
            Math.abs(a.impactMagnitude) >= 0.66 ? 'high' : Math.abs(a.impactMagnitude) >= 0.33 ? 'medium' : 'low',
        url: a.url,
    };
}

function toRegionDetail(row: BackendRegionDetail): RegionDetail {
    return {
        id: row.id,
        name: row.name,
        mandal: row.mandal,
        district: row.district,
        state: row.state,
        currentValue: row.baseValue,
        valueUnit: row.baseValueUnit,
        projectedRange: row.projection
            ? [row.projection.projectedValueLow, row.projection.projectedValueHigh]
            : null,
        direction: row.projection
            ? deriveDirection(row.baseValue, row.projection.projectedValueLow, row.projection.projectedValueHigh)
            : 'neutral',
        confidenceScore: row.projection?.confidenceScore ?? null,
        geometry: row.geometry,
        lastUpdated: row.projection?.calculatedDate ?? '',
        projection: row.projection
            ? { contributingArticles: row.projection.contributingArticles.map(toContributingArticle) }
            : null,
    };
}

export const regionService = {
    async getRegions(state: string, district?: string | null, minConfidence?: number | null): Promise<RegionSummary[]> {
        const rows = await httpClient.get<BackendRegionSummary[]>('/regions', {
            state,
            district,
            minConfidence,
        });
        return rows.map(toRegionSummary);
    },

    async getRegionById(id: string): Promise<RegionDetail> {
        const row = await httpClient.get<BackendRegionDetail>(`/regions/${id}`);
        return toRegionDetail(row);
    },
};
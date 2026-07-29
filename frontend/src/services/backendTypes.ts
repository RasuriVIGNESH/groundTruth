export interface BackendRegionSummary {
    id: string;
    name: string;
    mandal: string;
    district: string;
    state: string;
    geometry: any;
    baseValue: number;
    baseValueUnit: string;
    projectedValueLow: number | null;
    projectedValueHigh: number | null;
    confidenceScore: number | null;
    lastUpdated: string | null;
}

export interface BackendContributingArticle {
    id: string;
    title: string;
    source: string;
    url: string;
    publishedDate: string;
    projectType: string;
    impactMagnitude: number;
}

export interface BackendProjection {
    projectedValueLow: number;
    projectedValueHigh: number;
    confidenceScore: number;
    calculatedDate: string;
    contributingArticles: BackendContributingArticle[];
}

export interface BackendRegionDetail {
    id: string;
    name: string;
    mandal: string;
    district: string;
    state: string;
    geometry: any;
    baseValue: number;
    baseValueUnit: string;
    projection: BackendProjection | null;
}

export interface BackendLatestNews {
    id: string;
    title: string;
    source: string;
    url: string;
    publishedDate: string;
    projectType: string;
    impactMagnitude: number;
    confidence: number;
    regionName: string;
}
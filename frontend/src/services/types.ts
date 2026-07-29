export interface RegionSummary {
    id: string;
    name: string;
    district: string;
    state: string;
    currentValue: number;
    valueUnit: string;
    projectedRange: [number, number] | null;
    direction: 'rise' | 'fall' | 'neutral';
    confidenceScore: number | null;
    geometry: any;
}

export interface ContributingArticle {
    id: string;
    sourceName: string;
    headline: string;
    publishedDate: string;
    projectType: string;
    impactMagnitude: 'high' | 'medium' | 'low';
    url: string;
}

export interface RegionDetail extends RegionSummary {
    mandal: string;
    lastUpdated: string;
    projection: {
        contributingArticles: ContributingArticle[];
    } | null;
}
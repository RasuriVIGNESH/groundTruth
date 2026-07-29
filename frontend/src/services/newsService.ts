import { httpClient } from './httpClient';
import { BackendLatestNews } from './backendTypes';

export interface LatestNewsItem {
    id: string;
    headline: string;
    sourceName: string;
    url: string;
    publishedDate: string;
    projectType: string;
    regionName: string;
}

function toLatestNewsItem(row: BackendLatestNews): LatestNewsItem {
    return {
        id: row.id,
        headline: row.title,
        sourceName: row.source,
        url: row.url,
        publishedDate: row.publishedDate,
        projectType: row.projectType,
        regionName: row.regionName,
    };
}

export const newsService = {
    async getLatestNews(page = 0, size = 20): Promise<LatestNewsItem[]> {
        const rows = await httpClient.get<BackendLatestNews[]>('/news/latest', { page, size });
        return rows.map(toLatestNewsItem);
    },
};
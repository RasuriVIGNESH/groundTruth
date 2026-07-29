const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export interface ApiErrorBody {
    timestamp: string;
    status: number;
    errorCode: string;
    message: string;
    path: string;
    traceId: string;
}

export class ApiError extends Error {
    constructor(public status: number, public errorCode: string, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let body: ApiErrorBody | null = null;
        try {
            body = await response.json();
        } catch {
            // body wasn't valid JSON, fall through to a generic error
        }
        throw new ApiError(
            response.status,
            body?.errorCode ?? 'UNKNOWN_ERROR',
            body?.message ?? `Request failed with status ${response.status}`
        );
    }
    // 204 No Content etc. — nothing to parse
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined | null>) {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }
    return url.toString();
}

export const httpClient = {
    get<T>(path: string, params?: Record<string, string | number | undefined | null>): Promise<T> {
        return fetch(buildUrl(path, params), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => handleResponse<T>(res));
    },

    post<T>(path: string, body?: unknown): Promise<T> {
        return fetch(buildUrl(path), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }).then((res) => handleResponse<T>(res));
    },

    put<T>(path: string, body?: unknown): Promise<T> {
        return fetch(buildUrl(path), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }).then((res) => handleResponse<T>(res));
    },

    delete<T>(path: string): Promise<T> {
        return fetch(buildUrl(path), { method: 'DELETE' }).then((res) => handleResponse<T>(res));
    },
};
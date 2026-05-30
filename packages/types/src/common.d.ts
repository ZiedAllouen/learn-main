export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
}

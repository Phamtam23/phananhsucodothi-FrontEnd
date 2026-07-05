export interface Pagination {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PageResponse<T> {
    content: T[];
    pagination: Pagination;
}
import apiClient from "./apiClient";
import type { ApiResponse } from "../types/ApiResponse";
import type { PageResponse } from "../types/Page";
import type { ThongBaoResponse } from "../types/ThongBao";

export const GetThongBaoService = async (
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<PageResponse<ThongBaoResponse>>> => {
    const res = await apiClient.get(`/thong-bao?page=${page}&size=${size}`);
    return res.data;
};

export const GetUnreadCountService = async (): Promise<ApiResponse<number>> => {
    const res = await apiClient.get(`/thong-bao/unread-count`);
    return res.data;
};

export const MarkAsReadService = async (maThongBao: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.put(`/thong-bao/${maThongBao}/read`);
    return res.data;
};

export const MarkAllAsReadService = async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.put(`/thong-bao/read-all`);
    return res.data;
};

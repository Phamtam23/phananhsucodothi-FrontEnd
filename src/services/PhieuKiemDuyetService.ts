import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { PageResponse } from './../types/Page';
import type { CreatePhieuKiemDuyetRequest, PhieuKiemDuyetResponse } from "../types/PhieuKiemDuyet";
export interface KiemDuyetFilter {
    page?: number;
    size?: number;
    tuNgay?: string;
    denNgay?: string;
}
export const CreatePhieuKiemDuyetService = async (request: CreatePhieuKiemDuyetRequest):Promise<ApiResponse<PhieuKiemDuyetResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.PHIEUKIEMDUYET.CREATE, request);
    return res.data;
}

export const GetPhieuKiemDuyetBySuCoIdService = async (id:number|string):Promise<ApiResponse<PhieuKiemDuyetResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUKIEMDUYET.GET_BY_SUCO_ID(id));
    return res.data;
}

export const GetPhieuKiemDuyetByIdService = async (id:number|string):Promise<ApiResponse<PhieuKiemDuyetResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUKIEMDUYET.GET_BY_ID(id));
    return res.data;
}

export const GetPhieuKiemDuyetByNhanVienService = async (
    filter: KiemDuyetFilter
): Promise<ApiResponse<PageResponse<PhieuKiemDuyetResponse>>> => {
    const params = new URLSearchParams();
    params.append("page", String(filter.page ?? 0));
    params.append("size", String(filter.size ?? 10));
    if (filter.tuNgay)  params.append("tuNgay", filter.tuNgay);
    if (filter.denNgay) params.append("denNgay", filter.denNgay);

    const res = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PHIEUKIEMDUYET.GET_BY_NHANVIEN()}?${params.toString()}`
    );
    return res.data;
};
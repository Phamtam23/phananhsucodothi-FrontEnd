
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { PageResponse } from './../types/Page';
import type {CreateChiTietPhanCongRequest, UpdateChiTietPhanCongRequest,ChiTietPhanCongResponse,ChiTietPhanCongLSResponse } from "../types/ChiTietPhanCong";

export const CreateChiTietPhanCongService = async (request: CreateChiTietPhanCongRequest):Promise<ApiResponse<ChiTietPhanCongResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.CHITIEPHANCONG.CREATE, request);
    return res.data;
}

export const UpdateChiTietPhanCongService = async (request: UpdateChiTietPhanCongRequest):Promise<ApiResponse<ChiTietPhanCongResponse>> => {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.CHITIEPHANCONG.UPDATE, request);
    return res.data;
}

export const GetChiTietPhanCongByPhanCongIdService = async (id:number|string):Promise<ApiResponse<ChiTietPhanCongResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.CHITIEPHANCONG.GET_BY_PHANCONG_ID(id));
    return res.data;
}

export const GetChiTietPhanCongByIdService = async (id:number|string):Promise<ApiResponse<ChiTietPhanCongResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.CHITIEPHANCONG.GET_BY_ID(id));
    return res.data;
}

export const GetChiTietPhanCongByNhanVienIdService = async (
    page: number = 0,
    size: number = 20,
    keyword?: string,
    tuNgay?: string,
    denNgay?: string
): Promise<ApiResponse<PageResponse<ChiTietPhanCongLSResponse>>> => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", String(size));
    if (keyword) params.append("keyword", keyword);
    if (tuNgay)  params.append("tuNgay", tuNgay);
    if (denNgay) params.append("denNgay", denNgay);

    const res = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CHITIEPHANCONG.GET_BY_NHANVIEN_ID()}?${params.toString()}`
    );
    return res.data;
};

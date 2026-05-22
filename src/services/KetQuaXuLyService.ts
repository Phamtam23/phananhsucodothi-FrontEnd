import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { CreateKetQuaXuLyRequest,KetQuaXuLySummaryResponse,KetQuaXuLyDetailResponse,UpdateKetQuaXuLyRequest } from "../types/KetQuaXuLy";

const CreateKetQuaXuLyService = async (request: CreateKetQuaXuLyRequest):Promise<ApiResponse<KetQuaXuLySummaryResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.KETQUAXULY.CREATE, request);
    return res.data;
}

const GetKetQuaXuLyByIdService = async (id:number|string):Promise<ApiResponse<KetQuaXuLyDetailResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.KETQUAXULY.GET_BY_ID(id));
    return res.data;
}

const UpdateKetQuaXuLyService = async (id: number | string, request: UpdateKetQuaXuLyRequest): Promise<ApiResponse<KetQuaXuLyDetailResponse>> => {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.KETQUAXULY.UPDATE, { ...request, maKetQuaXuLy: id });
    return res.data;
}

const GetKetQuaXuLyByChiTietPhanCongIdService = async (id:number|string):Promise<ApiResponse<KetQuaXuLySummaryResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.KETQUAXULY.GET_BY_CHITIETPHANCONG_ID(id));
    return res.data;
}

export const DuyetKetQuaXuLyService = async (maKetQua: string, isApproved: boolean, lyDoTuChoi?: string): Promise<ApiResponse<KetQuaXuLyDetailResponse>> => {
    const params = new URLSearchParams({ isApproved: String(isApproved) });
    if (lyDoTuChoi) {
        params.append("lyDoTuChoi", lyDoTuChoi);
    }
    const res = await apiClient.put(`${API_CONFIG.ENDPOINTS.KETQUAXULY.DUYET(maKetQua)}?${params.toString()}`);
    return res.data;
}

export {
    CreateKetQuaXuLyService,
    GetKetQuaXuLyByIdService,
    UpdateKetQuaXuLyService,
    GetKetQuaXuLyByChiTietPhanCongIdService,
};
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { PhieuDanhGiaRequest, PhieuDanhGiaResponse } from "../types/PhieuDanhGia";

export const CreatePhieuDanhGiaService = async (request: PhieuDanhGiaRequest):Promise<ApiResponse<PhieuDanhGiaResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.DANHGIA.CREATE, request);
    return res.data;
}

export const GetPhieuDanhGiaByKetQuaXuLyIdService = async (id:number|string):Promise<ApiResponse<PhieuDanhGiaResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.DANHGIA.GET_BY_KETQUAXULY_ID(id));
    return res.data;
}
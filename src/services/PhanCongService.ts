
import type { PhieuPhanCongSCResponse,CreatePhieuPhanCongRequest  } from "../types/PhieuPhanCong";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";

export const GetAllPhanCongBySuCoIdService = async (id:number|string):Promise<ApiResponse<PhieuPhanCongSCResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHANCONG.GET_BY_SUCO_ID(String(id)));
    return res.data;
}

export const GetPhanCongByIdService = async (id:number|string):Promise<ApiResponse<PhieuPhanCongSCResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHANCONG.GET_BY_ID(id));
    return res.data;
}

export const CreatePhanCongService = async (request: CreatePhieuPhanCongRequest):Promise<ApiResponse<PhieuPhanCongSCResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.PHANCONG.CREATE, request);
    return res.data;
}

export const GetAllPhanCongByDonViIdService = async (id:number|string):Promise<ApiResponse<PhieuPhanCongSCResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHANCONG.GET_BY_DONVI_ID(id));
    return res.data;
}

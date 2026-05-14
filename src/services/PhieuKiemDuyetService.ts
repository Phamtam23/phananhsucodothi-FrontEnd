import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { CreatePhieuKiemDuyetRequest, PhieuKiemDuyetResponse } from "../types/PhieuKiemDuyet";

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
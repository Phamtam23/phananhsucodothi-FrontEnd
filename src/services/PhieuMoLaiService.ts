
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type {CreatePhieuMoLaiRequest, PhieuMoLaiResponse,UpdatePhieuMoLai } from "../types/PhieuMoLai";

export const CreatePhieuMoLaiService = async (request: CreatePhieuMoLaiRequest):Promise<ApiResponse<PhieuMoLaiResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.PHIEUMOLAI.CREATE, request);
    return res.data;
}

export const GetPhieuMoLaiByPhanCongIdService = async (id:number|string):Promise<ApiResponse<PhieuMoLaiResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUMOLAI.GET_BY_PHANCONG_ID(id));
    return res.data;
}

export const UpdatePhieuMoLaiService = async (id: number | string, request: UpdatePhieuMoLai): Promise<ApiResponse<PhieuMoLaiResponse>> => {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.PHIEUMOLAI.UPDATE, { ...request, maPhieuMoLai: id });
    return res.data;
}

export const GetPhieuMoLaiByIdService = async (id:number|string):Promise<ApiResponse<PhieuMoLaiResponse>> =>{
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUMOLAI.GET_BY_ID(id));
    return res.data;
}

export const GetAllPhieuMoLaiByDonViService = async (page: number = 0, size: number = 10): Promise<ApiResponse<any>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUMOLAI.GET_ALL_BY_DONVI(page, size));
    return res.data;
}

export const DuyetPhieuMoLaiService = async (maPhieu: string, isApproved: boolean, lyDoTuChoi?: string): Promise<ApiResponse<PhieuMoLaiResponse>> => {
    const params = new URLSearchParams({ isApproved: String(isApproved) });
    if (lyDoTuChoi) {
        params.append("lyDoTuChoi", lyDoTuChoi);
    }
    const res = await apiClient.put(`${API_CONFIG.ENDPOINTS.PHIEUMOLAI.DUYET(maPhieu)}?${params.toString()}`);
    return res.data;
}
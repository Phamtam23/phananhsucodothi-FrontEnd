
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type {CreatePhieuMoLaiRequest, PhieuMoLaiResponse,UpdatePhieuMoLai } from "../types/PhieuMoLai";

export const CreatePhieuMoLaiService = async (request: CreatePhieuMoLaiRequest):Promise<ApiResponse<PhieuMoLaiResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.PHIEUMOLAI.CREATE, request);
    return res.data;
}

export const GetPhieuMoLaiByChiTietPhanCongIdService = async (id:number|string):Promise<ApiResponse<PhieuMoLaiResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUMOLAI.GET_BY_CHITIETPHANCONG_ID(id));
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
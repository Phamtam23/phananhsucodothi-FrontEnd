import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type {PhieuDanhGiaRequest,PhieuDanhGiaResponse} from "../types/PhieuDanhGia"

export const CreatePhieuDanhGiaService = async (requestPhieuDanhGia: PhieuDanhGiaRequest):Promise<ApiResponse<PhieuDanhGiaResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.DANHGIA.CREATE, requestPhieuDanhGia );
    return res.data;
}

export const GetALLByKetQuaXuLy = async (maKetQuaXuLy:string):Promise<ApiResponse<PhieuDanhGiaResponse>> =>{
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.DANHGIA.GET_BY_KETQUAXULY_ID(maKetQuaXuLy))
    return res.data
}
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";

import type { PhieuPhanLoaiRequest, PhieuPhanLoaiResponse } from "../types/PhieuPhanLoai";

export const CreatePhieuPhanLoaiService = async (requestCreatePhieuPhanLoai: PhieuPhanLoaiRequest): Promise<ApiResponse<PhieuPhanLoaiResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.PHIEUPHANLOAI.CREATE, requestCreatePhieuPhanLoai);
    return res.data;
}

export const GetPhieuPhanLoaiBySuCoIdService = async (id: number | string): Promise<ApiResponse<PhieuPhanLoaiResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHIEUPHANLOAI.GET_BY_SUCO_ID(id));
    return res.data;
}

export const DeletePhieuPhanLoaiService = async (maSuCo: string, maLoai: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PHIEUPHANLOAI.DELETE(maSuCo, maLoai));
}


import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import type { NhanVienDonViResponse } from "../types/NhanVienDonVi";
import apiClient from "./apiClient";

export const GetNhanVienDonViByDonViPhanCongService = async (): Promise<ApiResponse<NhanVienDonViResponse[]>> => {
    const res = await apiClient.get<ApiResponse<NhanVienDonViResponse[]>>(API_CONFIG.ENDPOINTS.NHANVIENDONVI.GET_ALL_BY_DONVI_PHANCONG());
    return res.data;
}

export const GetNhanVienDonViByDonViService = async (maDonVi: string): Promise<ApiResponse<NhanVienDonViResponse[]>> => {   
    const res = await apiClient.get<ApiResponse<NhanVienDonViResponse[]>>(API_CONFIG.ENDPOINTS.NHANVIENDONVI.GET_ALL_BY_DONVI(maDonVi));
    return res.data;
}

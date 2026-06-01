
import type { PhieuPhanCongSCResponse,CreatePhieuPhanCongRequest,PhieuPhanCongFilterRequest,PhieuPhanCongLSResponse  } from "../types/PhieuPhanCong";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { PageResponse } from './../types/Page';
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

export const GetAllPhanCongByDonViIdService = async (page: number = 0, size: number = 10):Promise<ApiResponse<any>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.PHANCONG.GET_BY_DONVI(page, size));
    return res.data;
}

export const UpdatePhanCongService = async (id: number | string, request: any):Promise<ApiResponse<any>> => {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.PHANCONG.UPDATE(id), request);
    return res.data;
}

export const GetAllByNhanVienService = async (
    data: PhieuPhanCongFilterRequest
): Promise<ApiResponse<PageResponse<PhieuPhanCongLSResponse>>> => {
    const params = new URLSearchParams();
    params.append("page", String(data.page ?? 0));
    params.append("size", String(data.size ?? 10));
    if (data.tuNgay)  params.append("tuNgay", data.tuNgay);
    if (data.denNgay) params.append("denNgay", data.denNgay);
    if (data.maDonVi) params.append("maDonVi", data.maDonVi);
    if (data.maLoai)  params.append("maLoai", data.maLoai);

    const res = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PHANCONG.GET_BY_NHANVIEN()}?${params.toString()}`
    );
    return res.data;
};
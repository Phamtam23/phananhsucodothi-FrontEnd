import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { PhieuChiDaoResponse,CreateChiDaoRequest,UpdateChiDaoRequest } from "../types/PhieuChiDao";

export const getChiDaoByChiTietPhanCongId = async (id: number | string): Promise<PhieuChiDaoResponse[]> => {
  const response = await apiClient.get<ApiResponse<PhieuChiDaoResponse[]>>(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.GET_ALL_BY_CHITIETPHANCONG_ID(id)
  );
  return response.data.data;
}

export const createChiDao = async (data: CreateChiDaoRequest): Promise<PhieuChiDaoResponse> => {
  const response = await apiClient.post<ApiResponse<PhieuChiDaoResponse>>(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.CREATE,    
    data
    );
    return response.data.data;
}

export const updateChiDao = async (data: UpdateChiDaoRequest): Promise<PhieuChiDaoResponse> => {
  const response = await apiClient.put<ApiResponse<PhieuChiDaoResponse>>(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.UPDATE,    
    data
    );
    return response.data.data;
}

export const deleteChiDao = async (id: number | string): Promise<void> => {
  await apiClient.delete(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.DELETE(id)
  );
}
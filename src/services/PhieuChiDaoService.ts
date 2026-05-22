import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { PhieuChiDaoResponse,CreateChiDaoRequest,UpdateChiDaoRequest } from "../types/PhieuChiDao";

export const GetPhieuChiDaoByPhanCongIdService = async (id: number | string): Promise<ApiResponse<PhieuChiDaoResponse[]>> => {
  const response = await apiClient.get<ApiResponse<PhieuChiDaoResponse[]>>(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.GET_ALL_BY_CHITIETPHANCONG_ID(id)
  );
  return response.data;
}

export const CreatePhieuChiDaoService = async (data: CreateChiDaoRequest): Promise<ApiResponse<PhieuChiDaoResponse>> => {
  const response = await apiClient.post<ApiResponse<PhieuChiDaoResponse>>(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.CREATE,    
    data
    );
    return response.data;
}

export const UpdatePhieuChiDaoService = async (data: UpdateChiDaoRequest): Promise<ApiResponse<PhieuChiDaoResponse>> => {
  const response = await apiClient.put<ApiResponse<PhieuChiDaoResponse>>(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.UPDATE,    
    data
    );
    return response.data;
}

export const DeletePhieuChiDaoService = async (id: number | string): Promise<void> => {
  await apiClient.delete(
    API_CONFIG.ENDPOINTS.PHIEUCHIDAO.DELETE(id)
  );
}
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { LoaiRequest, LoaiResponse } from "../types/Loai";

export const CreateLoaiService = async (requestCreateLoai: LoaiRequest): Promise<ApiResponse<LoaiResponse>> => {
  const res = await apiClient.post(
    API_CONFIG.ENDPOINTS.LOAI.CREATE,
    null,                                                           
    { params: { tenLoai: requestCreateLoai.tenLoaiSuCo } }        
  );
  return res.data;
};
export const GetAllLoaiService = async ():Promise<ApiResponse<LoaiResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.LOAI.GET_ALL);
    return res.data;
}

export const GetLoaiByIdService = async (id:number|string):Promise<ApiResponse<LoaiResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.LOAI.GET_BY_ID(id));
    return res.data;
}

export const UpdateLoaiService = async (requestUpdateLoai: LoaiRequest): Promise<ApiResponse<LoaiResponse>> => {
  const res = await apiClient.put(
    `${API_CONFIG.ENDPOINTS.LOAI.UPDATE}/${requestUpdateLoai.maLoai}`,  
    null,                                                                  
    { params: { tenLoai: requestUpdateLoai.tenLoaiSuCo } }               
  );
  return res.data;
};

export const DeleteLoaiService = async (id: number | string): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete(API_CONFIG.ENDPOINTS.LOAI.DELETE(id));
  return res.data;
};
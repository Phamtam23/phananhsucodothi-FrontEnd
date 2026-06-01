import apiClient from "./apiClient";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import type { ThongKeHeThongResponse,ThongKeDonViResponse } from "../types/ThongKe";


export const GetThongKeHeThongService = async (nam?: number, thang?: number): Promise<ApiResponse<ThongKeHeThongResponse>> => {
  const params = new URLSearchParams();
  if (nam) params.append("nam", nam.toString());
  if (thang) params.append("thang", thang.toString());
  
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await apiClient.get(`${API_CONFIG.ENDPOINTS.THONGKE.HE_THONG}${queryString}`);
  return res.data;
};

export const GetThongKeDonViService = async (nam: number): Promise<ApiResponse<ThongKeDonViResponse>> => {
  const res = await apiClient.get(`${API_CONFIG.ENDPOINTS.THONGKE.DONVI()}?nam=${nam}`);
  return res.data;
};


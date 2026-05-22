import apiClient from "./apiClient";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import type { ThongKeHeThongResponse } from "../types/ThongKe";

export const GetThongKeHeThongService = async (): Promise<ApiResponse<ThongKeHeThongResponse>> => {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.THONGKE.HE_THONG);
  return res.data;
};

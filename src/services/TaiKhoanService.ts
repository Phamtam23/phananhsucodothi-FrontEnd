import apiClient from "./apiClient";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import type { TaiKhoanResponse, CreateTaiKhoanRequest, UpdateTaiKhoanRequest } from "../types/TaiKhoan";

export const GetAllTaiKhoanService = async (): Promise<ApiResponse<TaiKhoanResponse[]>> => {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.TAIKHOAN.GET_ALL);
  return res.data;
};

export const GetTaiKhoanByIdService = async (id: string): Promise<ApiResponse<TaiKhoanResponse>> => {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.TAIKHOAN.GET_BY_ID(id));
  return res.data;
};

export const CreateTaiKhoanService = async (request: CreateTaiKhoanRequest): Promise<ApiResponse<TaiKhoanResponse>> => {
  const res = await apiClient.post(API_CONFIG.ENDPOINTS.TAIKHOAN.CREATE, request);
  return res.data;
};

export const UpdateTaiKhoanService = async (id: string, request: UpdateTaiKhoanRequest): Promise<ApiResponse<TaiKhoanResponse>> => {
  const res = await apiClient.put(API_CONFIG.ENDPOINTS.TAIKHOAN.UPDATE(id), request);
  return res.data;
};

export const KhoaTaiKhoanService = async (id: string): Promise<ApiResponse<TaiKhoanResponse>> => {
  const res = await apiClient.put(API_CONFIG.ENDPOINTS.TAIKHOAN.KHOA(id));
  return res.data;
};

export const MoKhoaTaiKhoanService = async (id: string): Promise<ApiResponse<TaiKhoanResponse>> => {
  const res = await apiClient.put(API_CONFIG.ENDPOINTS.TAIKHOAN.MO_KHOA(id));
  return res.data;
};

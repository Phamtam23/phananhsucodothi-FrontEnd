import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { DonViXuLyResponse, CreateDonViXuLyRequest, UpdateDonViXuLyRequest } from "../types/DonViXuLy";

export const GetAllDonViXuLyService = async (): Promise<ApiResponse<DonViXuLyResponse[]>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.DONVIXULY.GET_ALL);
    return res.data;
};

export const CreateDonViXuLyService = async (request: CreateDonViXuLyRequest): Promise<ApiResponse<DonViXuLyResponse>> => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.DONVIXULY.CREATE, request);
    return res.data;
};

export const UpdateDonViXuLyService = async (id: number | string, request: UpdateDonViXuLyRequest): Promise<ApiResponse<DonViXuLyResponse>> => {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.DONVIXULY.UPDATE(id), request);
    return res.data;
};

export const GetDonViXuLyByIdService = async (id: number | string): Promise<ApiResponse<DonViXuLyResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.DONVIXULY.GET_BY_ID(id));
    return res.data;
};
import type { PageResponse } from './../types/Page';
import type { SucoSumaryResponse, SucoResponse,SucoDetailResponse } from "../types/Suco";
import type { CreateSucoRequest } from "../types/Suco";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";

export const CreateSucoService = async (requestCreateSuco: CreateSucoRequest):Promise<ApiResponse<SucoResponse>> => {

    const res = await apiClient.post(API_CONFIG.ENDPOINTS.SUCO.CREATE, requestCreateSuco );
    return res.data;
}

export const GetALLSuCoService = async (page: number,size: number):Promise<ApiResponse<PageResponse<SucoSumaryResponse>>> => {

    const res = await apiClient.get(API_CONFIG.ENDPOINTS.SUCO.GET_ALL(),{
          params: {
            page,
            size,
        },
    });
    return res.data;
}

export const GetALLByNguoiDanSuCoService = async (page:number,size:number):Promise<ApiResponse<PageResponse<SucoSumaryResponse>>> => {

    const res = await apiClient.get(API_CONFIG.ENDPOINTS.SUCO.GET_ALL_BY_NGUOI_DAN(),{
         params: {
                page,
                size
            }
    });
    return res.data;
}

export const GetSuCoByIdService = async (id:number|string):Promise<ApiResponse<SucoDetailResponse>> => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.SUCO.GET_BY_ID(id));
    return res.data;
}

export const GetSuCoByTrangThaiService = async (trangThai:string,page:number,size:number):Promise<ApiResponse<PageResponse<SucoSumaryResponse>>> => {

    const res = await apiClient.get(API_CONFIG.ENDPOINTS.SUCO.GET_ALL_BY_TRANGTHAI(trangThai),{
            params: {
                page,
                size
            }
    });
    return res.data;
}
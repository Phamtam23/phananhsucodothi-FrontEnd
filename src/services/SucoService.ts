import type { SucoResponse } from "../types/Suco";
import type { CreateSucoRequest } from "../types/Suco";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";

export const CreateSucoService = async (requestCreateSuco: CreateSucoRequest):Promise<ApiResponse<SucoResponse>> => {

    const res = await apiClient.post(API_CONFIG.ENDPOINTS.SUCO.CREATE, requestCreateSuco );
    return res.data;
}

export const GetALL
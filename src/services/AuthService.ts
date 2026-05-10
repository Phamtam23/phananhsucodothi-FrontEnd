import type { AuthResponse,requestLogin,RegisterRequest } from "../types/Auth";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";

export const LoginService = async (requestLogin: requestLogin):Promise<ApiResponse<AuthResponse>> => {
    
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN,  requestLogin );

    return res.data
}

export const RegisterService = async (requestRegister: RegisterRequest):Promise<ApiResponse<AuthResponse>> => {
    
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, { body: requestRegister });
    return res.data;
}

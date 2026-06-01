import type { AuthResponse,requestLogin,RegisterRequest } from "../types/Auth";
import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";
import type { ProfileResponse } from "../types/Auth";
import type { UpdateProfileRequest } from "../types/Auth";
export const LoginService = async (requestLogin: requestLogin):Promise<ApiResponse<AuthResponse>> => {
    
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN,  requestLogin );

    return res.data
}

export const RegisterService = async (requestRegister: RegisterRequest):Promise<ApiResponse<AuthResponse>> => {
    
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, requestRegister );
    return res.data;
}


export const GetProfileService = async ():Promise<ApiResponse<ProfileResponse>> => {
    
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return res.data;
}

export const UpdateProfileService = async (update:UpdateProfileRequest):Promise<ApiResponse<String>> => {
    
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, update);
    return res.data;
}
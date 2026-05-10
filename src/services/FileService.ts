import { API_CONFIG } from "../constants/app.constants";
import type { ApiResponse } from "../types/ApiResponse";
import apiClient from "./apiClient";

const FileService = {
    uploadFile: async (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append("file", file); 
        const res = await apiClient.post(API_CONFIG.ENDPOINTS.FILE.UPLOAD, { body: formData });
        return res.data;
    }

}
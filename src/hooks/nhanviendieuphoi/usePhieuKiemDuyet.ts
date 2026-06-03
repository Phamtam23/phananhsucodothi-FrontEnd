import {CreatePhieuKiemDuyetService} from "../../services/PhieuKiemDuyetService"
import { useState } from "react";
import type { CreatePhieuKiemDuyetRequest } from "../../types/PhieuKiemDuyet";
import { TrangThaiKiemDuyet } from "../../types/PhieuKiemDuyet";
export const usePhieuKiemDuyet =() =>{
   
    const createPhieuKiemDuyet = async (request: CreatePhieuKiemDuyetRequest) => {
        try {
            const res = await CreatePhieuKiemDuyetService(request);
            return res.data;
        } catch (error) {
            console.error("Error creating Phieu Kiem Duyet:", error);
            throw error;
        }
    };

    return {
        createPhieuKiemDuyet,
    }

}
import { useEffect, useState } from "react";
import { GetSuCoByIdService } from './../../services/SucoService';
import type { SucoDetailResponse } from './../../types/Suco';
export const useDetailSuco = (maSuCo:string) =>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suco, setSuco] = useState<SucoDetailResponse | null>(null);
    const fetchSucoDetail = async (id:number|string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetSuCoByIdService(id);
            setSuco(res.data);
        } catch (err) {
            setError("Không thể tải chi tiết sự cố");
        } finally {
            setLoading(false);
        }   
    }
    
    useEffect(() => {
        if (maSuCo) {
            fetchSucoDetail(maSuCo);
        } 
    },[maSuCo])
    
    return {
        loading,
        error,
        suco
    }
}
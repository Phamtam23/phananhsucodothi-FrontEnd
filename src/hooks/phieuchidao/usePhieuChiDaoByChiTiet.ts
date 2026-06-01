import { useState, useCallback } from "react";
import apiClient from "../../services/apiClient";
import { API_CONFIG } from "../../constants/app.constants";

export const usePhieuChiDaoByChiTiet = () => {
    const [chiDaoData, setChiDaoData] = useState<any[]>([]);
    const [chiDaoLoading, setChiDaoLoading] = useState(false);

    const fetchChiDao = useCallback(async (maChiTietPhanCong: string) => {
        setChiDaoLoading(true);
        try {
            const res = await apiClient.get(
                API_CONFIG.ENDPOINTS.PHIEUCHIDAO.GET_ALL_BY_CHITIETPHANCONG_ID(maChiTietPhanCong)
            );
            const raw = res.data?.data;
            if (raw && Array.isArray(raw.content)) {
                setChiDaoData(raw.content);
            } else if (Array.isArray(raw)) {
                setChiDaoData(raw);
            } else {
                setChiDaoData([]);
            }
        } catch {
            setChiDaoData([]);
        } finally {
            setChiDaoLoading(false);
        }
    }, []);

    return { chiDaoData, chiDaoLoading, fetchChiDao };
};

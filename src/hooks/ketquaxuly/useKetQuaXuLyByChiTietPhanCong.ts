import { useState, useCallback } from "react";
import { GetKetQuaXuLyByChiTietPhanCongIdService } from "../../services/KetQuaXuLyService";
import type { KetQuaXuLySummaryResponse } from "../../types/KetQuaXuLy";

export const useKetQuaXuLyByChiTietPhanCong = () => {
    const [ketQuaList, setKetQuaList] = useState<KetQuaXuLySummaryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchKetQua = useCallback(async (maChiTietPhanCong: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetKetQuaXuLyByChiTietPhanCongIdService(maChiTietPhanCong);
            if (response.status === 200) {
                // If backend returns PageResponse or List, handle it
                const data: any = response.data;
                setKetQuaList(Array.isArray(data) ? data : (data?.content || []));
            } else {
                setError(response.message || "Lỗi lấy danh sách kết quả");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Lỗi lấy danh sách kết quả");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        ketQuaList,
        loading,
        error,
        fetchKetQua
    };
};

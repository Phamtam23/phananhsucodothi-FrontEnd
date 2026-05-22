import { useState, useCallback, useEffect } from "react";
import { API_CONFIG } from "../../constants/app.constants";
import apiClient from "../../services/apiClient";
import type { ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import type { PageResponse } from "../../types/Page";

export const useChiTietPhanCongNhanVien = (page: number = 0, size: number = 20) => {
    const [data, setData] = useState<PageResponse<ChiTietPhanCongResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(
                `${API_CONFIG.ENDPOINTS.CHITIEPHANCONG.CREATE}/nhan-vien?page=${page}&size=${size}`
            );
            setData(res.data?.data ?? null);
            console.log("Fetched ChiTietPhanCongNhanVien:", res.data?.data);
        } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu phân công");
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

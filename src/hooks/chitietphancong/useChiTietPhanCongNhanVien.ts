import { GetChiTietPhanCongByNhanVienIdService } from './../../services/ChiTietPhanCongService';
import { useState, useCallback, useEffect } from "react";
import type { ChiTietPhanCongLSResponse } from "../../types/ChiTietPhanCong";
import type { PageResponse } from "../../types/Page";

export const useChiTietPhanCongNhanVien = (page: number = 0, size: number = 20, keyword?: string,tuNgay?: string,denNgay?: string) => {
    const [data, setData] = useState<PageResponse<ChiTietPhanCongLSResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
                       const res = await GetChiTietPhanCongByNhanVienIdService(page, size, keyword, tuNgay, denNgay)
              setData(res.data ?? null);
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

import { useState, useCallback, useEffect } from "react";
import { GetAllPhieuMoLaiByDonViService } from "../../services/PhieuMoLaiService";
import type { PhieuMoLaiResponse } from "../../types/PhieuMoLai";
import type { PageResponse } from "../../types/Page";

export const usePhieuMoLaiDonVi = (page: number = 0, size: number = 10) => {
    const [data, setData] = useState<PageResponse<PhieuMoLaiResponse> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllPhieuMoLaiByDonViService(page, size);
            if (response.data) {
                setData(response.data as PageResponse<PhieuMoLaiResponse>);
            } else {
                setError(response.message || "Có lỗi xảy ra");
            }
        } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu yêu cầu mở lại");
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};

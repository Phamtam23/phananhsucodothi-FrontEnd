import { useState, useCallback, useEffect } from "react";
import type { PhieuKiemDuyetResponse } from "../../types/PhieuKiemDuyet";
import type { PageResponse } from "../../types/Page";
import { GetPhieuKiemDuyetByNhanVienService } from "../../services/PhieuKiemDuyetService";
export interface KiemDuyetFilter {
    page?: number;
    size?: number;
    tuNgay?: string;
    denNgay?: string;
}

export const usePhieuKiemDuyetNhanVien = (filter: KiemDuyetFilter) =>{
    const [data, setData] = useState<PageResponse<PhieuKiemDuyetResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


     const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetPhieuKiemDuyetByNhanVienService(filter);
            setData(res.data ?? null);
        } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu kiểm duyệt");
        } finally {
            setLoading(false);
        }
    }, [filter.page, filter.size, filter.tuNgay, filter.denNgay]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
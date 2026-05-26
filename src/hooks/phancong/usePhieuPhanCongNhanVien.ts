import { useState, useCallback, useEffect } from "react";
import type { PhieuPhanCongLSResponse, PhieuPhanCongFilterRequest } from "../../types/PhieuPhanCong";
import type { PageResponse } from "../../types/Page";
import { GetAllByNhanVienService } from "../../services/PhanCongService";

export const usePhieuPhanCongNhanVien = (filter: PhieuPhanCongFilterRequest) => {
    const [data, setData] = useState<PageResponse<PhieuPhanCongLSResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback (async() =>{
        setLoading(true);
        setError(null);
        try{
        const res = await GetAllByNhanVienService(filter);
        setData(res.data ?? null);
       } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu phân công");
        } finally {
            setLoading(false);
            }
        }, [filter.page, filter.size, filter.tuNgay, filter.denNgay, filter.maDonVi, filter.maLoai]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

     return { data, loading, error, refetch: fetchData };
        }


    




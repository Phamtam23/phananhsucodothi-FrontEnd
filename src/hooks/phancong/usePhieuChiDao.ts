import { useState, useCallback } from "react";
import { 
    CreatePhieuChiDaoService,
    GetPhieuChiDaoByPhanCongIdService 
} from "../../services/PhieuChiDaoService";
import type { 
    PhieuChiDaoResponse, 
    CreateChiDaoRequest 
} from "../../types/PhieuChiDao";

export const usePhieuChiDao = () => {
    const [chiDaoList, setChiDaoList] = useState<PhieuChiDaoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchByChiTietPhanCongId = useCallback(async (maChiTietPhanCong: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetPhieuChiDaoByPhanCongIdService(maChiTietPhanCong);
            if (response.status === 200) {
                const data: any = response.data;
                setChiDaoList(Array.isArray(data) ? data : (data?.content || []));
            } else {
                setError(response.message || "Lỗi lấy danh sách chỉ đạo");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Lỗi lấy danh sách chỉ đạo");
        } finally {
            setLoading(false);
        }
    }, []);

    const createChiDao = async (request: CreateChiDaoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await CreatePhieuChiDaoService(request);
            if (response.status === 201 || response.status === 200) {
                setChiDaoList(prev => [...prev, response.data]);
                return response.data;
            } else {
                throw new Error(response.message || "Lỗi tạo chỉ đạo");
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi tạo chỉ đạo";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        chiDaoList,
        loading,
        error,
        fetchByChiTietPhanCongId,
        createChiDao
    };
};

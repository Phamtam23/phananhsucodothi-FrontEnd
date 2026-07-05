import { useState, useCallback } from "react";
import {
    CreateChiTietPhanCongService,
    UpdateChiTietPhanCongService,
    GetChiTietPhanCongByPhanCongIdService
} from "../../services/ChiTietPhanCongService";
import type {
    ChiTietPhanCongResponse,
    CreateChiTietPhanCongRequest,
    UpdateChiTietPhanCongRequest
} from "../../types/ChiTietPhanCong";

export const useChiTietPhanCong = () => {
    const [chiTiet, setChiTiet] = useState<ChiTietPhanCongResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchByPhanCongId = useCallback(async (maPhieuPhanCong: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetChiTietPhanCongByPhanCongIdService(maPhieuPhanCong);
            if (response.status === 200 && response.data && response.data.length > 0) {
                // Giả định mỗi phiếu phân công chỉ có 1 chi tiết chính (nhân sự chịu trách nhiệm chính)
                setChiTiet(response.data[0]);
            } else {
                setChiTiet(null);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Lỗi khi lấy chi tiết phân công");
            setChiTiet(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const createChiTiet = async (request: CreateChiTietPhanCongRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await CreateChiTietPhanCongService(request);
            if (response.status === 201 || response.status === 200) {
                setChiTiet(response.data);
                return response.data;
            } else {
                throw new Error(response.message || "Lỗi tạo chi tiết phân công");
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi tạo chi tiết phân công";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const updateChiTiet = async (request: UpdateChiTietPhanCongRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await UpdateChiTietPhanCongService(request);
            if (response.status === 200) {
                setChiTiet(response.data);
                return response.data;
            } else {
                throw new Error(response.message || "Lỗi cập nhật chi tiết phân công");
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi cập nhật chi tiết phân công";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        chiTiet,
        loading,
        error,
        fetchByPhanCongId,
        createChiTiet,
        updateChiTiet
    };
};

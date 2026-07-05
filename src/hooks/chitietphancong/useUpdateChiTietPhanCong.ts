import { useState } from "react";
import apiClient from "../../services/apiClient";
import { API_CONFIG } from "../../constants/app.constants";
import type { TrangThaiChiTietPhanCong } from "../../types/ChiTietPhanCong";

export const useUpdateChiTietPhanCong = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTrangThai = async (maChiTietPhanCong: string, trangThai: TrangThaiChiTietPhanCong) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.put(
                `${API_CONFIG.ENDPOINTS.CHITIEPHANCONG.UPDATE}/${maChiTietPhanCong}`,
                { trangThai }
            );
            return res.data?.data ?? null;
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi cập nhật trạng thái";
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateTrangThai, loading, error };
};

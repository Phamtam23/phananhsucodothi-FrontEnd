import { useState } from "react";
import { DuyetPhieuMoLaiService } from "../../services/PhieuMoLaiService";
import type { PhieuMoLaiResponse } from "../../types/PhieuMoLai";

export const useDuyetPhieuMoLai = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const duyetPhieuMoLai = async (maPhieuMoLai: string, isApproved: boolean, lyDoTuChoi?: string): Promise<PhieuMoLaiResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await DuyetPhieuMoLaiService(maPhieuMoLai, isApproved, lyDoTuChoi);
            if (response.status === 200) {
                return response.data;
            } else {
                setError(response.message || "Lỗi khi cập nhật trạng thái phiếu mở lại");
                return null;
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi kết nối server";
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        duyetPhieuMoLai,
        loading,
        error
    };
};

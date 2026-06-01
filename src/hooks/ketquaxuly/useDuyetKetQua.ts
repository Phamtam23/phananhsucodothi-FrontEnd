import { useState } from "react";
import { DuyetKetQuaXuLyService } from "../../services/KetQuaXuLyService";
import type { KetQuaXuLyDetailResponse } from "../../types/KetQuaXuLy";

export const useDuyetKetQua = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const duyetKetQua = async (maKetQua: string, isApproved: boolean, lyDoTuChoi?: string): Promise<KetQuaXuLyDetailResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await DuyetKetQuaXuLyService(maKetQua, isApproved, lyDoTuChoi);
            if (response.status === 200) {
                return response.data;
            } else {
                setError(response.message || "Lỗi khi cập nhật trạng thái kết quả");
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
        duyetKetQua,
        loading,
        error
    };
};

import { useState } from "react";
import { UpdatePhanCongService } from "../../services/PhanCongService";
import type { UpdatePhieuPhanCongRequest } from "../../types/PhieuPhanCong";

export const useUpdatePhieuPhanCong = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updatePhieuPhanCong = async (maPhieu: string, request: UpdatePhieuPhanCongRequest) => {
        setLoading(true);
        setError(null);
        try {
            const res = await UpdatePhanCongService(maPhieu, request);
            if (res.status === 200 || res.status === 201) {
                return res.data;
            } else {
                throw new Error(res.message || "Cập nhật thất bại");
            }
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi cập nhật");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updatePhieuPhanCong,
        loading,
        error,
    };
};

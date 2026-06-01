import { useState } from "react";
import { CreateKetQuaXuLyService } from "../../services/KetQuaXuLyService";
import type { CreateKetQuaXuLyRequest } from "../../types/KetQuaXuLy";

export const useTaoKetQua = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const taoKetQua = async (request: CreateKetQuaXuLyRequest) => {
        setLoading(true);
        setError(null);
        try {
            const res = await CreateKetQuaXuLyService(request);
            if (res.status === 200 || res.status === 201) {
                return res.data;
            }
            setError(res.message || "Nộp kết quả thất bại");
            return null;
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi kết nối server";
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { taoKetQua, loading, error };
};

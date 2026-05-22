import { useState, useCallback, useEffect } from "react";
import { GetPhanCongByIdService } from "../../services/PhanCongService";
import { GetSuCoByIdService } from "../../services/SucoService";
import type { PhieuPhanCongSCResponse } from "../../types/PhieuPhanCong";
import type { SucoDetailResponse } from "../../types/Suco";

export interface PhieuPhanCongDetail extends PhieuPhanCongSCResponse {
    suCoDetail?: SucoDetailResponse;
}

export const usePhieuPhanCongDetail = (maPhieuPhanCong: string | undefined) => {
    const [detail, setDetail] = useState<PhieuPhanCongDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetail = useCallback(async () => {
        if (!maPhieuPhanCong) return;
        
        setLoading(true);
        setError(null);
        try {
            const phanCongRes = await GetPhanCongByIdService(maPhieuPhanCong);
            if (phanCongRes.status === 200 && phanCongRes.data) {
                const phanCongData = phanCongRes.data;
                let suCoDetail: SucoDetailResponse | undefined;
                
                try {
                    const suCoRes = await GetSuCoByIdService(phanCongData.maSuCo);
                    if (suCoRes.status === 200 && suCoRes.data) {
                        suCoDetail = suCoRes.data;
                    }
                } catch (e) {
                    console.error("Failed to fetch SuCo Detail", e);
                }

                setDetail({
                    ...phanCongData,
                    suCoDetail
                });
            } else {
                setError(phanCongRes.message || "Không thể tải chi tiết phân công");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Lỗi tải chi tiết");
        } finally {
            setLoading(false);
        }
    }, [maPhieuPhanCong]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    return { detail, loading, error, refetch: fetchDetail };
};

import { useState, useEffect, useCallback } from "react";
import type { PhieuPhanCongResponse } from "../../types/PhieuPhanCong";
import { GetAllPhanCongByDonViIdService } from "../../services/PhanCongService";
import { GetSuCoByIdService } from "../../services/SucoService";
import type { PageResponse } from "../../types/Page";
import type { SucoDetailResponse } from "../../types/Suco";

export interface PhieuPhanCongWithSuCo extends PhieuPhanCongResponse {
    suCoDetail?: SucoDetailResponse;
}

export const usePhieuPhanCongDonVi = (page: number = 0, size: number = 10) => {
    const [data, setData] = useState<PageResponse<PhieuPhanCongWithSuCo> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllPhanCongByDonViIdService(page, size);
            console.log("PhanCong Response:", response);
            if (response.data) {
                const pageData = response.data as PageResponse<PhieuPhanCongResponse>;
                
                // Fetch SuCo details for each PhieuPhanCong
                const contentWithSuCo = await Promise.all(
                    pageData.content.map(async (phieu) => {
                        try {
                            const suCoRes = await GetSuCoByIdService(phieu.maSuCo);
                            return {
                                ...phieu,
                                suCoDetail: suCoRes.data
                            } as PhieuPhanCongWithSuCo;
                        } catch (e) {
                            return phieu as PhieuPhanCongWithSuCo;
                        }
                    })
                );

                setData({
                    ...pageData,
                    content: contentWithSuCo
                });
            } else {
                setError(response.message || "Có lỗi xảy ra");
            }
        } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};

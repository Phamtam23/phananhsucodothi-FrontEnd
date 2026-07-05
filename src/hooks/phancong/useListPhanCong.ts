    import { useEffect, useState } from "react";
    import { GetAllPhanCongBySuCoIdService } from "../../services/PhanCongService";
    import type { PhieuPhanCongSCResponse } from "../../types/PhieuPhanCong";

    export const useListPhanCong = (maSuCo:String) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [phanCongList, setPhanCongList] =
        useState<PhieuPhanCongSCResponse[]>([])    

        const fetchPhanCongList = async () => {
            setLoading(true);
            setError(null); 
            try {
                const res = await GetAllPhanCongBySuCoIdService(String(maSuCo));
                setPhanCongList(res.data);
            } catch (err) {
                setError("Failed to fetch phân công list");
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchPhanCongList();
        }, [maSuCo]);

        return {
            loading,
            error,
            phanCongList
        };
    };
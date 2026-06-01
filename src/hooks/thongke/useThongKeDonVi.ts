import { useState, useEffect,useCallback } from "react";
import { GetThongKeDonViService } from "../../services/ThongKeService";
import type { ThongKeDonViResponse } from "../../types/ThongKe";

export const useThongKeDonVi = (nam: number) => {
    const [data, setData] = useState<ThongKeDonViResponse | null>(null);    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData =useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetThongKeDonViService(nam);
            if (res.status === 200) {
                setData(res.data);
            }
            else {
                setError(res.message || "Lỗi không xác định");
            }
        }
        catch (err) {
            setError((err as Error).message || "Lỗi không xác định");
        }

        finally {
            setLoading(false);
        }
    }, [nam]);

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}

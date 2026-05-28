import { useState, useCallback } from "react";
import { GetThongKeHeThongService } from "../../services/ThongKeService";
import type { ThongKeHeThongResponse } from "../../types/ThongKe";

export const useThongKe = () => {
  const [thongKe, setThongKe] = useState<ThongKeHeThongResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layThongKe = useCallback(async (nam?: number, thang?: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetThongKeHeThongService(nam, thang);
      if (res.status === 200) setThongKe(res.data);
    } catch (err: any) {
      setError(err.message || "Lỗi lấy thống kê");
    } finally {
      setLoading(false);
    }
  }, []);

  return { thongKe, loading, error, layThongKe };
};

import { useState, useCallback, useEffect } from "react";
import type { PageResponse } from "../../types/Page";
import type { ThongBaoResponse } from "../../types/ThongBao";
import { GetThongBaoService, MarkAsReadService, MarkAllAsReadService, GetUnreadCountService } from "../../services/ThongBaoService";

export const useThongBao = (initialPage: number = 0, size: number = 10) => {
    const [data, setData] = useState<PageResponse<ThongBaoResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const [resData, resCount] = await Promise.all([
                GetThongBaoService(page, size),
                GetUnreadCountService()
            ]);
            setData(resData.data ?? null);
            setUnreadCount(resCount.data ?? 0);
        } catch (err: any) {
            setError(err.message || "Không thể tải dữ liệu thông báo");
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const markAsRead = async (maThongBao: string) => {
        try {
            await MarkAsReadService(maThongBao);
            await fetchData();
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã đọc", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await MarkAllAsReadService();
            await fetchData();
        } catch (err) {
            console.error("Lỗi khi đánh dấu tất cả đã đọc", err);
        }
    };

    return { 
        data, 
        loading, 
        error, 
        page, 
        setPage, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        refetch: fetchData 
    };
};

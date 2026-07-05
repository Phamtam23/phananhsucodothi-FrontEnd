import { GetALLByNguoiDanSuCoService } from './../../services/SucoService';
import type { SucoSumaryResponse } from './../../types/Suco';
import { useEffect, useState } from "react";

export const useLichSuSuCo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [sucoList, setSucoList] = useState<SucoSumaryResponse[]>([]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
    });
    const fetchSucoList = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetALLByNguoiDanSuCoService(page, 10);
            setSucoList(res.data.content);
            setPagination(res.data.pagination);
        } catch (err) {
            setError("Không thể tải danh sách sự cố");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() =>{
        fetchSucoList();
    },[])

    return {
        loading,
        error,
        sucoList,
        pagination,
        setPage,
        page
    }
}
import { GetALLSuCoService } from './../../services/SucoService';
import type { SucoSumaryResponse } from './../../types/Suco';
import { useEffect, useState } from "react";

export const useDanhSachSuco = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            const res = await GetALLSuCoService(pagination.page, pagination.size);
            setSucoList(res.data.content);
            setPagination(res.data.pagination);
        }
        catch (err) {
            setError("Không thể tải danh sách sự cố");
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchSucoList();
    }, [pagination.page])

return {
        loading,
        error,
        sucoList,
        pagination,
        setPage: (newPage: number) => setPagination(prev => ({ ...prev, page: newPage }))
    }

}


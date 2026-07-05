import { useState, useEffect } from "react";
import { GetAllLoaiService } from "../../services/LoaiService";
import type { LoaiResponse } from "../../types/Loai";

export const useListLoai = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loaiList, setLoaiList] = useState<LoaiResponse[]>([]);

    const fetchLoaiList = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetAllLoaiService();
            setLoaiList(res.data);
        }
        catch (err) {

            setError("Failed to fetch loại list");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoaiList();
    }, []);

    return {
        loading,
        error,
        loaiList
    };

}
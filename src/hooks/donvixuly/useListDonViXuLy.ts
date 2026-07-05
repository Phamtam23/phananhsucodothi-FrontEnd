import { useEffect, useState } from "react";
import type { DonViXuLyResponse } from './../../types/DonViXuLy';
import {GetAllDonViXuLyService}  from "../../services/DonViXuLy";
export const useListDonViXuLy = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [donViXuLyList, setDonViXuLyList] = useState<DonViXuLyResponse[]>([]);

    const fetchDonViXuLyList = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetAllDonViXuLyService();
            setDonViXuLyList(res.data);
        } catch (err) {
            setError("Failed to fetch Don Vi Xu Ly list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonViXuLyList();
    }, []);

    return { loading, error, donViXuLyList };
};
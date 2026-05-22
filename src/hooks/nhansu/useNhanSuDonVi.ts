import { useState, useEffect, useCallback } from "react";
import { GetNhanVienDonViByDonViPhanCongService } from "../../services/NhanVienDonViService";
import type { NhanVienDonViResponse } from "../../types/NhanVienDonVi";

export const useNhanSuDonVi = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const [nhanSuList, setNhanSuList] = useState<NhanVienDonViResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNhanSu = useCallback(async () => {

    try {
        const response = await GetNhanVienDonViByDonViPhanCongService();

         setNhanSuList(response.data);

    } catch (err) {
        console.log(err);
    }
}, []);

    useEffect(() => {
        fetchNhanSu();
    }, [fetchNhanSu]);

    return {
        nhanSuList,
        loading,
        error,
        refetch: fetchNhanSu
    };
};

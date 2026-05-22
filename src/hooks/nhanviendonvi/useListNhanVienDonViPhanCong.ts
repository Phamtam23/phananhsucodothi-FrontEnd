import { useEffect, useState } from "react";
import { GetNhanVienDonViByDonViPhanCongService } from "../../services/NhanVienDonViService";
import type { NhanVienDonViResponse } from "../../types/NhanVienDonVi";

export const useListNhanVienDonVi = (maDonVi: string) => {
    const [listNhanVienDonVi, setListNhanVienDonVi] = useState<NhanVienDonViResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchNhanVienDonVi = async () => {
            if (!maDonVi) return;
            setLoading(true); 
            try {
                const res = await GetNhanVienDonViByDonViPhanCongService(maDonVi);
                if (res.status === 200) {
                    setListNhanVienDonVi(res.data);

                } else {
                    setError(res.message || "Lỗi khi lấy danh sách nhân viên đơn vị");
                }
            } catch (err) {
                setError("Lỗi khi kết nối đến server");

            } finally {
                setLoading(false);
            }
        };
        fetchNhanVienDonVi();
    }, [maDonVi]);

    return { listNhanVienDonVi, loading, error };
}
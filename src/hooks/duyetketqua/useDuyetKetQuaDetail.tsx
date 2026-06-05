import { useState, useEffect, useCallback, useMemo } from "react";
import { GetChiTietPhanCongByPhanCongIdService } from "../../services/ChiTietPhanCongService";
import { GetKetQuaXuLyByChiTietPhanCongIdService, DuyetKetQuaXuLyService } from "../../services/KetQuaXuLyService";
import type { ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import type { KetQuaXuLyDetailResponse } from "../../types/KetQuaXuLy";


export interface ChiTietVoiKetQua extends ChiTietPhanCongResponse {
    danhSachKetQua: KetQuaXuLyDetailResponse[];
}

export const useDuyetKetQuaDetail = (maPhieuPhanCong: string) => {
    const [danhSachCTPC, setDanhSachCTPC] = useState<ChiTietVoiKetQua[]>([]);
    const [loading, setLoading] = useState(true);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [lyDoTuChoi, setLyDoTuChoi] = useState("");

    const fechData = useCallback(async () => {
        setLoading(true);

        try {
            const chiTietPhanCong = await GetChiTietPhanCongByPhanCongIdService(maPhieuPhanCong);
            if(chiTietPhanCong.status === 200) {
                  const fullData = await Promise.all(
                    chiTietPhanCong.data.map(async (ct) => {
                        try {
                            const kqRes = await GetKetQuaXuLyByChiTietPhanCongIdService(ct.maChiTietPhanCong);
                            return { ...ct, danhSachKetQua: kqRes.data || [] };
                        } catch {
                            return { ...ct, danhSachKetQua: [] };
                        }
                    })
                );
                setDanhSachCTPC(fullData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [maPhieuPhanCong]);

     useEffect(() => { fechData(); }, [fechData]);

     const duyetKetQua = async (maKetQua: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn duyệt kết quả này?")) return;
        setDangXuLy(true);
        try {
            await DuyetKetQuaXuLyService(maKetQua, true);
            alert("Đã duyệt kết quả!");
            await fechData();
        }
        catch (error) {
            console.error("Error approving result:", error);
            alert("Có lỗi xảy ra khi duyệt kết quả. Vui lòng thử lại.");
        }
    }

    const tuChoiKetQua = async (maKetQua: string) => {
        if (!lyDoTuChoi.trim()) { alert("Vui lòng nhập lý do từ chối"); return; }
        if (!window.confirm("Bạn có chắc chắn muốn từ chối kết quả này?")) return;
        setDangXuLy(true);
        try {
            await DuyetKetQuaXuLyService(maKetQua, false, lyDoTuChoi);
            alert("Đã từ chối kết quả!");
            setLyDoTuChoi("");
            await fechData();
        }
        catch (error) {
            console.error("Error rejecting result:", error);
            alert("Có lỗi xảy ra khi từ chối kết quả. Vui lòng thử lại.");
        }
    }

    return {
        danhSachCTPC, loading, dangXuLy,
        lyDoTuChoi, setLyDoTuChoi,
        duyetKetQua, tuChoiKetQua,
       
    }
}
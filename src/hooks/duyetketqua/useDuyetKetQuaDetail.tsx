import { useState, useEffect, useCallback, useMemo } from "react";
import { GetChiTietPhanCongByPhanCongIdService } from "../../services/ChiTietPhanCongService";
import { GetKetQuaXuLyByChiTietPhanCongIdService, DuyetKetQuaXuLyService } from "../../services/KetQuaXuLyService";
import type { ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import type { KetQuaXuLyDetailResponse } from "../../types/KetQuaXuLy";


export interface ChiTietVoiKetQua extends ChiTietPhanCongResponse {
    danhSachKetQua: KetQuaXuLyDetailResponse[];
}

export const useDuyetKetQuaDetail = (maPhieuPhanCong: string) => {
    const [danhSach, setDanhSach] = useState<ChiTietVoiKetQua[]>([]);
    const [dangTai, setDangTai] = useState(true);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [maKetQuaTuChoi, setMaKetQuaTuChoi] = useState<string | null>(null);
    const [lyDoTuChoi, setLyDoTuChoi] = useState("");

    const fechData = useCallback(async () => {
        setDangTai(true);

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
                setDanhSach(fullData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setDangTai(false);
        }
    }, [maPhieuPhanCong]);

    const danhSachTheoChiTiet = useMemo(() => {
    const map = new Map<string, ChiTietVoiKetQua[]>();

        danhSach.forEach((item) => {
            const key = item.maChiTietPhanCong;

            if (!map.has(key)) {
                map.set(key, []);
            }

            map.get(key)?.push(item);
        });

        return map;
    }, [danhSach]);

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
            setMaKetQuaTuChoi(null);
            setLyDoTuChoi("");
            await fechData();
        }
        catch (error) {
            console.error("Error rejecting result:", error);
            alert("Có lỗi xảy ra khi từ chối kết quả. Vui lòng thử lại.");
        }
    }

    return {
        danhSach, dangTai, dangXuLy,
        maKetQuaTuChoi, setMaKetQuaTuChoi,
        lyDoTuChoi, setLyDoTuChoi,
        duyetKetQua, tuChoiKetQua,
        danhSachTheoChiTiet
    }
}
import { useState, useMemo } from "react";
import type { ChiTietVoiKetQua } from "../../../hooks/duyetketqua/useDuyetKetQuaDetail";
import KetQuaSelectList from "./Ketquaselectlist";
import KetQuaDetailPanel from "./KetQuaDetailPanel";
import DuyetForm from "./DuyetForm";
import "./DuyetKetQuaSidebar.scss";
export interface DuyetKetQuaSidebarProps {
    danhSach: ChiTietVoiKetQua[];
    dangXuLy: boolean;
    lyDoTuChoi: string;
    setLyDoTuChoi: (v: string) => void;
    duyetKetQua: (ma: string) => void;
    tuChoiKetQua: (ma: string) => void;
}
const  DuyetKetQuaSidebar = ({ danhSach, dangXuLy, lyDoTuChoi, setLyDoTuChoi, duyetKetQua, tuChoiKetQua }: DuyetKetQuaSidebarProps) => {


    const danhSachKQTheoChiTiet = useMemo(() => {
        const map = new Map<string, ChiTietVoiKetQua>();

        danhSach.forEach((item) =>{
            const existing = map.get(item.maChiTietPhanCong);
            if (existing) {
                existing.danhSachKetQua =[...existing.danhSachKetQua, ...item.danhSachKetQua];
            } else {
                map.set(item.maChiTietPhanCong, item);
            }
            
        })
        return map;
    
    },[danhSach]);

    const defaultSelected = useMemo(() =>{
        for (const chiTiet of danhSach.values()) {
            const found = chiTiet.danhSachKetQua.find((kq) => kq.trangThai === "CHO_DUYET");
            if (found) {
                return found.maKetQuaXuLy;
            }
        }
    }, [danhSachKQTheoChiTiet]);

    const [selectedKetQua, setSelectedKetQua] = useState<string | null>(defaultSelected ?? null);

    const allKetQua = useMemo(() => {
        const all: Array<{ ketQua: any; stt: number; maChiTiet: string }> = [];
        danhSachKQTheoChiTiet.forEach((chiTiet, maChiTiet) => {
             chiTiet.danhSachKetQua.forEach((kq, idx) => {
                all.push({ ketQua: kq, stt: idx + 1, maChiTiet });
            });
        });
        return all;
    }, [danhSachKQTheoChiTiet]);

    const selectedEntry = allKetQua.find((entry) => entry.ketQua.maKetQuaXuLy === selectedKetQua);

    const handleSelectKetQua = (maKetQua: string) => {
        setSelectedKetQua(maKetQua);
        setLyDoTuChoi("");
    }

    const toTalKetQua = allKetQua.length;
    const soLanDuyet = allKetQua.filter((entry) => entry.ketQua.trangThai === "DUYET").length;

    return (
           <div className="dkq-sidebar">
              <div className="dkq-sidebar-card">
                   <div className="dkq-sidebar-card-header">
                       <h3>PHÊ DUYỆT KẾT QUẢ</h3>
                    <div className="dkq-sidebar-card-meta">
                        <span>{toTalKetQua} lần nộp</span>
                        {soLanDuyet > 0 && (
                            <span className="kq-badge kq-badge--duyet">{soLanDuyet} đã duyệt</span>
                        )}
                    </div>
                   </div>
          
                 <KetQuaSelectList
                    danhSachKQTheoChiTiet={danhSachKQTheoChiTiet}
                    selectedKetQua={selectedKetQua}
                    onSelectKetQua={handleSelectKetQua}
                />
            </div>

            {selectedEntry && (
                <div className="dkq-sidebar-card">
                <h3>CHI TIẾT LẦN NỘP {selectedEntry.stt}</h3>
 
                <KetQuaDetailPanel
                        ketQua={selectedEntry.ketQua}
                        stt={selectedEntry.stt}
                    />
                     {selectedEntry.ketQua.trangThai === "CHO_DUYET" && (
                        <DuyetForm
                            maKetQua={selectedEntry.ketQua.maKetQuaXuLy}
                            lyDo={lyDoTuChoi}
                            setLyDo={setLyDoTuChoi}
                            dangXuLy={dangXuLy}
                            onDuyet={duyetKetQua}
                            onTuChoi={tuChoiKetQua}
                        />

                    
                    )}
                </div>
                    )}
           </div>
    )

}

export default DuyetKetQuaSidebar;
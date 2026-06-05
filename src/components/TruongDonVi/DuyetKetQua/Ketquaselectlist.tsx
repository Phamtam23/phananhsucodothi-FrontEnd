import { getLabelTrangThaiKetQua, getColorTrangThaiKetQua } from "../../../utils/StatusUtils";
import type { ChiTietVoiKetQua } from "../../../hooks/duyetketqua/useDuyetKetQuaDetail";
import DanhSachChiDao from "../../ChiDao/DanhSachChiDao";
import {formatDateTime} from "../../../utils/Format";
interface KetQuaSelectListProps {
    danhSachKQTheoChiTiet: Map<string, ChiTietVoiKetQua>;
    selectedKetQua: string | null;
    onSelectKetQua: (maKetQua: string) => void;
}

const KetQuaSelectList = ({ danhSachKQTheoChiTiet, selectedKetQua, onSelectKetQua }: KetQuaSelectListProps) => {
    const chiTietKetQuaList = Array.from(danhSachKQTheoChiTiet.values());
    const nhieuNhanVien = chiTietKetQuaList.length > 1;
    const maChiTietPhanCong = chiTietKetQuaList.length > 0 ? chiTietKetQuaList[0].maChiTietPhanCong : null;
    return (
        <>
        <div className ="chidao-sidebar-header">
            <DanhSachChiDao chiTietPhanCong={maChiTietPhanCong ?? ""} />
        </div>
        <div className="kq-select-list">
            {chiTietKetQuaList.map((chiTiet) => (
                <div key={chiTiet.maChiTietPhanCong} className="kq-select-group">

                    {nhieuNhanVien && (
                        <div className="kq-select-group-header">
                            <span className="kq-select-group-name">
                                {chiTiet.nhanVienXuLy.hoTen ?? chiTiet.maChiTietPhanCong}
                            </span>
                            <span className="kq-select-group-count">
                                {chiTiet.danhSachKetQua.length} lần nộp
                            </span>
                        </div>
                    )}

                    {chiTiet.danhSachKetQua.length === 0 ? (
                        <p className="kq-select-empty">Chưa có kết quả nào.</p>
                    ) : (
                        chiTiet.danhSachKetQua.map((ketQua, idx) => {
                            const isSelected = selectedKetQua === ketQua.maKetQuaXuLy;
                            const trangThaiLabel = getLabelTrangThaiKetQua(ketQua.trangThai);
                            const trangThaiColor = getColorTrangThaiKetQua(ketQua.trangThai);
                            return (
                                <button
                                    key={ketQua.maKetQuaXuLy}
                                    className={`kq-select-btn${isSelected ? " kq-select-btn--active" : ""}`}
                                    onClick={() => onSelectKetQua(ketQua.maKetQuaXuLy)}
                                >
                                    <span className={`kq-select-num${isSelected ? " kq-select-num--active" : ""}`}>
                                        {idx + 1}
                                    </span>
                                    <span className="kq-select-meta">
                                        <span className="kq-select-label">Lần nộp {idx + 1}</span>
                                        <span className="kq-select-date">{formatDateTime(ketQua.thoiGianNop) ?? "—"}</span>
                                    </span>
                                    <span className={`kq-badge ${trangThaiColor}`}>
                                        {trangThaiLabel ?? ketQua.trangThai}
                                    </span>
                                </button>
                            );
                        })
                    )}

                </div>
            ))}
        </div>
        </>
    );
};

export default KetQuaSelectList;
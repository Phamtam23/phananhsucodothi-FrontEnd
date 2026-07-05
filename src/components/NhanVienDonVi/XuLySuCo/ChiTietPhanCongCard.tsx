import type {ChiTietPhanCongLSResponse} from "../../../types/ChiTietPhanCong";
import {TrangThaiChiTietPhanCong} from "../../../types/ChiTietPhanCong";
import {formatDateTime} from "../../../utils/Format";
import {MapPin, FileText, BookOpen, CheckCircle} from "@phosphor-icons/react";
import NoiDungChiDaoList from "./NoiDungChiDaoList";
import {useNavigate} from "react-router-dom";
import NopKetQuaForm from "./NopKetQuaForm";
import {useState} from "react";
interface ChiTietPhanCongCardProps {
    phieuChiTietPhanCongs : ChiTietPhanCongLSResponse[];
}

const getBadge = (trangThai: TrangThaiChiTietPhanCong) => {
        if (trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY) return <span className="trang-thai-badge dang">Đang xử lý</span>;
        if (trangThai === TrangThaiChiTietPhanCong.CHO_DUYET) return <span className="trang-thai-badge" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>Chờ duyệt</span>;
        if (trangThai === TrangThaiChiTietPhanCong.TU_CHOI) return <span className="trang-thai-badge" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>Từ chối</span>;
        return <span className="trang-thai-badge xong">Hoàn thành</span>;
    };


const ChiTietPhanCongCard = ({ phieuChiTietPhanCongs }: ChiTietPhanCongCardProps) => {
    const [phieuChiDaoHienThi, setPhieuChiDaoHienThi] = useState<string | null>(null);
    const [phieuNopKetQua, setPhieuNopKetQua] = useState<string | null>(null);
    const navigate = useNavigate();

    const xemChiTiet = ( maPhanCong: string, maChiTietPhanCong: string, loai: string) => {
        navigate(`/nhanvienxuly/chi-tiet/${maPhanCong}/${maChiTietPhanCong}/${loai}`);
    }
    return (
        <>
            <div className="trang-xu-ly-grid">
                {phieuChiTietPhanCongs.length === 0 ? (
                    <div className="trang-xu-ly-empty">Không có công việc nào trong mục này.</div>
                ) : phieuChiTietPhanCongs.map(phieu => {
                    const thoiGian = phieu.thoiGianTao ? formatDateTime(phieu.thoiGianTao) : "";
                    return (
                        <div key={phieu.maChiTietPhanCong} className="trang-xu-ly-card">
                            <div className="trang-xu-ly-card-header">
                                <div className="trang-xu-ly-card-tags">
                                    <span className="trang-xu-ly-card-tag">PHÂN CÔNG</span>
                                    <span className="trang-xu-ly-card-id">#{phieu.maChiTietPhanCong}</span>
                                </div>
                                <span className="trang-xu-ly-card-time">{thoiGian}</span>
                            </div>

                            <h3 className="trang-xu-ly-card-title">{phieu.tieuDe}</h3>

                            <div className="trang-xu-ly-card-meta">
                                <div className="trang-xu-ly-card-meta-row">
                                    <MapPin size={13} />
                                    <span>{phieu.diaDiem}</span>
                                </div>
                                <div className="trang-xu-ly-card-meta-row">
                                    <FileText size={13} />
                                    <span>Trạng thái: {getBadge(phieu.trangThai)}</span>
                                </div>
                            </div>

                            <div className="nut-hanh-dong">
                                <button className="nut-xem-chi-dao" onClick={() => setPhieuChiDaoHienThi(phieu.maChiTietPhanCong)}>
                                    <BookOpen size={13} /> Xem chỉ đạo
                                </button>
                                {(phieu.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY || phieu.trangThai === TrangThaiChiTietPhanCong.TU_CHOI) && (
                                    <>
                                   <button className="nut-nop-ket-qua" onClick={() => setPhieuNopKetQua(phieu.maChiTietPhanCong)}>
                                        <CheckCircle size={13} /> Nộp kết quả
                                    </button>
                                
                                    </>
                                  
                                )}
                                   <button
                    className="nut-nop-ket-qua"
                    onClick={() => xemChiTiet(
                        phieu.phieuPhanCong.maPhieuPhanCong,
                        phieu.maChiTietPhanCong,
                        phieu.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY ? "NOP_KET_QUA" : "XEM_LICH_SU"
                    )}
                >
                    <CheckCircle size={13} />
                   Xem chi tiết
                </button>
                            
                            </div>
                        </div>
                    );
                })}
            </div>

            {phieuChiDaoHienThi && (
                <NoiDungChiDaoList
                    maChiTietPhanCong={phieuChiDaoHienThi}
                    onClose={() => setPhieuChiDaoHienThi(null)}
                />
            )}

            {phieuNopKetQua && (
                <NopKetQuaForm
                    maChiTietPhanCong={phieuNopKetQua}
                    onClose={() => setPhieuNopKetQua(null)}
                />
            )}
        </>
    );
};
export default ChiTietPhanCongCard;
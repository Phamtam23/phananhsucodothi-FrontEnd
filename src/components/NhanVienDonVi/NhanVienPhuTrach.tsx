import { User } from "lucide-react";
import type {ChiTietVoiKetQua} from "../../hooks/duyetketqua/useDuyetKetQuaDetail"

const NhanVienPhuTrach = ({ chiTiet }: { chiTiet: ChiTietVoiKetQua })  => {
    const nhanVienPhuTrach = chiTiet.nhanVienXuLy;

    if(!nhanVienPhuTrach) return null;

   return (
        <div className="dkq-card dkq-staff-card">
            <div className="dkq-card-header">
                <span className="dkq-section-label">NHÂN SỰ PHỤ TRÁCH</span>
            </div>
            <div className="dkq-staff-info-box">
                <div className="dkq-staff-avatar">
                    {nhanVienPhuTrach.anhDaiDien
                        ? <img src={nhanVienPhuTrach.anhDaiDien} alt="avatar" />
                        : <User size={24} />
                    }
                </div>
                <div className="dkq-staff-details">
                    <span className="staff-role">NHÂN VIÊN ĐƠN VỊ</span>
                    <h4 className="staff-name">{nhanVienPhuTrach.hoTen}</h4>
                    <span className="staff-team">Mã nhân viên: {nhanVienPhuTrach.maNhanVien}</span>
                </div>
            </div>
        </div>
    );
}

export default NhanVienPhuTrach;

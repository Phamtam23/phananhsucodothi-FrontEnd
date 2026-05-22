import "./DanhSachPhieuMoLai.scss";
import { useState } from "react";
import type { PhieuMoLaiResponse } from "../../types/PhieuMoLai";
import { GetPhieuMoLaiByPhanCongIdService } from "../../services/PhieuMoLaiService";

type Props = {
    maPhanCong: string;
};

const DanhSachPhieuMoLai = ({ maPhanCong }: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<PhieuMoLaiResponse[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await GetPhieuMoLaiByPhanCongIdService(maPhanCong);
            setData(res.data);
        } catch (err) {
            setError("Không thể tải danh sách phiếu mở lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="danh-sach-phieu-mo-lai">
            <button className="btn-tai-lai" onClick={fetchData} disabled={loading}> 
                {loading ? "Đang tải..." : "Xem lịch sử yêu cầu mở lại"}
            </button>
            {error && <p className="loi-he-thong">{error}</p>}
            
            {data.length > 0 && (
                <ul className="danh-sach-noi-dung">
                    {data.map((item) => (
                        <li 
                            key={item.maPhieuMoLai} 
                            onClick={() => setOpenId(openId === item.maPhieuMoLai ? null : item.maPhieuMoLai)}
                            className={`item-phieu-mo-lai ${openId === item.maPhieuMoLai ? 'dang-mo' : ''}`}
                        >
                            <div className="item-header">
                                <span className="ma-so">Mã phiếu: #{item.maPhieuMoLai}</span>
                                <span className={`trang-thai-pill trang-thai--${item.trangThaiMoLai.toLowerCase()}`}>
                                    {item.trangThaiMoLai === "CHO_PHAN_HOI" ? "Chờ phản hồi" :
                                     item.trangThaiMoLai === "DA_DUYET" ? "Đã duyệt" : "Từ chối"}
                                </span>
                            </div>
                            <p className="ngay-tao">Ngày yêu cầu: {new Date(item.thoiGianTao).toLocaleDateString('vi-VN')}</p>
                            
                            {openId === item.maPhieuMoLai && (
                                <div className="chi-tiet-ly-do">
                                    <strong>Lý do của người dân:</strong>
                                    <p className="noi-dung-ly-do">{item.lyDo}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DanhSachPhieuMoLai;

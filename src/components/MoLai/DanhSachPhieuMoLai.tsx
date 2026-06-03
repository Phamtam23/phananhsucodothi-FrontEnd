import "./DanhSachPhieuMoLai.scss";
import { useEffect, useState } from "react";
import type { PhieuMoLaiResponse } from "../../types/PhieuMoLai";
import { GetPhieuMoLaiByPhanCongIdService } from "../../services/PhieuMoLaiService";

type Props = {
    maPhanCong: string;
    maKetQuaXuLy: string;
};

const DanhSachPhieuMoLai = ({ maPhanCong, maKetQuaXuLy }: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<PhieuMoLaiResponse | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await GetPhieuMoLaiByPhanCongIdService(maPhanCong);
            console.log("Phiếu mở lại đã tải:", res.data);
            setData(res.data);
        } catch (err) {
            setError("Không thể tải danh sách phiếu mở lại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (maPhanCong) {
            fetchData();
        }
    }, [maPhanCong]);

    if (loading) return <div className="loading-phieu-mo-lai">Đang tải lịch sử mở lại...</div>;
    if (error) return null; // hide error if fails or no history

    const isMatch = data && String(data.maKetQuaXuLy) === String(maKetQuaXuLy);

    if (!isMatch) return null;

    return (
        <div className="danh-sach-phieu-mo-lai">
            {data && (
                <ul className="danh-sach-noi-dung">
                    <li 
                        key={data.maPhieuMoLai} 
                        onClick={() => setOpenId(openId === data.maPhieuMoLai ? null : data.maPhieuMoLai)}
                        className={`item-phieu-mo-lai ${openId === data.maPhieuMoLai ? 'dang-mo' : ''}`}
                    >
                        <div className="item-header">
                            <span className="ma-so">Mã phiếu mở lại: #{data.maPhieuMoLai}</span>
                            <span className={`trang-thai-pill trang-thai--${data.trangThaiMoLai.toLowerCase()}`}>
                                {data.trangThaiMoLai === "CHO_PHAN_HOI" ? "Chờ phản hồi" :
                                 data.trangThaiMoLai === "CHAP_NHAN" ? "Đã duyệt" : "Từ chối"}
                            </span>
                        </div>
                        <p className="ngay-tao">Ngày yêu cầu: {new Date(data.thoiGianTao).toLocaleDateString('vi-VN')}</p>
                        
                        {openId === data.maPhieuMoLai && (
                            <div className="chi-tiet-ly-do">
                                <strong>Lý do của người dân:</strong>
                                <p className="noi-dung-ly-do">{data.lyDo}</p>
                            </div>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default DanhSachPhieuMoLai;

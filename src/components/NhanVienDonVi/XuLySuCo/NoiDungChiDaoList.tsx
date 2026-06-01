import {useEffect} from "react";
import {usePhieuChiDaoByChiTiet} from "../../../hooks/phieuchidao/usePhieuChiDaoByChiTiet";
interface NoiDungChiDaoListProps {
    maChiTietPhanCong: string;
    onClose?: () => void;
}
const NoiDungChiDaoList = ({ maChiTietPhanCong, onClose }: NoiDungChiDaoListProps) => {
    const { chiDaoData, chiDaoLoading, fetchChiDao } = usePhieuChiDaoByChiTiet();

    useEffect(() => {
        if (maChiTietPhanCong) {
            fetchChiDao(maChiTietPhanCong);
        }
    }, [maChiTietPhanCong, fetchChiDao]);

    return (
        <div className="modal-chi-dao-nen" onClick={onClose}>
            <div className="modal-chi-dao-hop" onClick={e => e.stopPropagation()}>
                <h2> Nội dung chỉ đạo</h2>
                {chiDaoLoading ? (
                    <p style={{ color: "#9ca3af", textAlign: "center" }}>Đang tải...</p>
                ) : chiDaoData.length === 0 ? (
                    <div className="khong-co-chi-dao">Chưa có chỉ đạo nào cho công việc này.</div>
                ) : (
                    chiDaoData.map((cd: any, idx: number) => (
                        <div key={idx} className="chi-dao-item">
                            <div className="chi-dao-item-noi-dung">{cd.noiDung}</div>
                            <div className="chi-dao-item-ngay"> {cd.ngayChiDao || cd.thoiGianTao || ""}</div>
                        </div>
                    ))
                )}
                <button className="nut-dong-modal" onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};
export default NoiDungChiDaoList;
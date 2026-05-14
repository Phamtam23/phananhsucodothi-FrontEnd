import "./DetailSuco.scss";
import { useDetailSuco } from "../../../hooks/suco/useDetailSuco";
const detailSuco = () => {
    const { loading, error, suco, phanCongList } = useDetailSuco();
    return (
        <div>
            <div className="suCoDetail">
                {suco && (
                    <div>
                        <h2>Chi tiết sự cố</h2>
                        <p><strong>Nội dung:</strong> {suco.noiDung}</p>
                        <p><strong>Địa điểm:</strong> {suco.diaDiem}</p>
                        <p><strong>Thời gian tạo:</strong> {new Date(suco.thoiGianTao).toLocaleString()}</p>
                        <p><strong>Trạng thái:</strong> {suco.trangThai}</p>
                        <h3>Danh sách phân công</h3>
                         </div>
                )}
            </div>
            <div className="phanCongList">
                {phanCongList.length > 0 ? (
                    <ul>
                        {phanCongList.map((phanCong) => (
                            <li key={phanCong.maPhieuPhanCong}>
                                <p><strong>Người phụ trách:</strong> {phanCong.donViXuLy.tenDonVi}</p>
                                <p><strong>Thời gian phân công:</strong> {new Date(phanCong.thoiGianTao).toLocaleString()}</p>
                            </li>
                            // {phanCong.ketQuaXuLy && () => (
                            //     <div>
                            //         <p><strong>Kết quả xử lý:</strong> {phanCong.ketQuaXuLy.noiDung}</p>
                            //         <p><strong>Thời gian kết quả:</strong> {new Date(phanCong.ketQuaXuLy.thoiGianTao).toLocaleString()}</p>
                            //     </div>
                            // )}
                        ))}
                    </ul>
                ) : (
                    <p>Không có phân công nào</p>
                )}
            </div>
        </div>
    )
}   

export default detailSuco;
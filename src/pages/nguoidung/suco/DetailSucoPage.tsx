import "./DetailSucoPage.scss";
import { useParams } from "react-router-dom";
import DetailSuCo from "../../../components/Suco/DetailSuCo";
import DanhSachPhanCong from "../../../components/PhanCong/DanhSachPhanCong";

const DetailSucoPage = () => {
    const { maSuCo } = useParams<{ maSuCo: string }>();

    return (
        <div className="trang-chi-tiet-su-co">
            <div className="bo-cuc-chi-tiet">
                <main className="cot-chinh">
                    <DetailSuCo maSuCo={maSuCo ?? ""} />

                    <div className="khung-don-vi-xu-ly">
                        <div className="tieu-de-section">
                            <i className="ti ti-briefcase" />
                            <h2>Đơn vị Xử lý</h2>
                        </div>
                        <DanhSachPhanCong maSuCo={maSuCo ?? ""} />
                    </div>
                </main>

                <aside className="cot-phu">
                    <div className="khung-cam-ket">
                        <p className="noi-dung-cam-ket">
                            Mọi thông tin phản hồi của quý khách sẽ được giữ bí mật và chỉ sử dụng để nâng cao chất lượng phục vụ công chúng.
                        </p>
                        <div className="chan-cam-ket">
                            <i className="ti ti-shield" />
                            <span>Cam kết bảo mật 100%</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DetailSucoPage;
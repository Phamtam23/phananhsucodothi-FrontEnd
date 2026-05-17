import {} from "../../services/PhieuMoLaiService";
import "./ListPhieuMoLai.scss";
import {useState} from "react";
import type{ PhieuMoLaiResponse } from "../../types/PhieuMoLai";
import {GetPhieuMoLaiByPhanCongIdService} from "../../services/PhieuMoLaiService";  

type Props = {
    maPhanCong: string;
};

const ListPhieuMoLai = ({maPhanCong}: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<PhieuMoLaiResponse[]>([]);
    const [openId, setOpenId] =useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await GetPhieuMoLaiByPhanCongIdService(maPhanCong);
            setData(res.data);
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="list-phieu-mo-lai">
            <button onClick={fetchData} disabled={loading}> 
                {loading ? "Loading..." : "Load Phiếu Mở Lại"}
            </button>
            {error && <p className="error">{error}</p>}
            <ul>
                {data.map((item) => (
                    <li key={item.maPhieuMoLai} onClick={() => setOpenId(item.maPhieuMoLai)}>
                        <p>Mã phiếu mở lại: {item.maPhieuMoLai}</p>
                        <p>Ngày tạo: {new Date(item.thoiGianTao).toLocaleDateString()}</p>
                        <p>Trạng thái: {item.trangThaiMoLai}</p>
                        {openId === item.maPhieuMoLai && (
                            <div className="details">
                                <p>Lý do mở lại: {item.lyDo}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListPhieuMoLai;
import type { KetQuaXuLyDetailResponse } from "../../../types/KetQuaXuLy";
 import  {API_CONFIG} from "../../../constants/app.constants"
interface Props {
    ketQua: KetQuaXuLyDetailResponse;
    stt: number;
}

const KetQuaDetailPanel = ({ ketQua, stt }: Props) => (
    <div className="kq-detail-panel">
        <div className="kq-detail-row">
            <span>Lần nộp</span>
            <strong>#{stt}</strong>
        </div>
        <div className="kq-detail-row">
            <span>Thời gian nộp</span>
            <strong>{ketQua.thoiGianNop ?? "—"}</strong>
        </div>
        {ketQua.noiDungThucHien && (
            <div className="kq-detail-row kq-detail-row--block">
                <span>Mô tả</span>
                <p>{ketQua.noiDungThucHien}</p>
            </div>
        )}
        {ketQua.medias && ketQua.medias.length > 0 && (
            <div className="kq-detail-images">
                {ketQua.medias.map((item, i: number) => (
                    <a key={i} href={API_CONFIG.BASE_URL+ item.url} target="_blank" rel="noopener noreferrer">
                        <img src={API_CONFIG.BASE_URL+item.url} alt={`Ảnh ${i + 1}`} className="kq-detail-thumb" />
                    </a>
                ))}
            </div>
        )}
        {ketQua.trangThai === "TU_CHOI" && ketQua.lyDoTuChoi && (
            <div className="kq-detail-reject">
                <span>Lý do từ chối</span>
                <p>{ketQua.lyDoTuChoi}</p>
            </div>
        )}
    </div>
);
 
export default KetQuaDetailPanel;
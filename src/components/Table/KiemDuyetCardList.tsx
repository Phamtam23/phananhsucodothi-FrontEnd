import { MapPin, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import type { SucoSumaryResponse } from "../../types/Suco";
import { API_CONFIG } from "../../constants/app.constants";
import { timeAgo } from "../../utils/Format";
import { TrangThaiKiemDuyet } from "../../types/PhieuKiemDuyet";
import "./KiemDuyetCardList.scss";

type Props = {
  data: SucoSumaryResponse[];
  onRowClick: (item: SucoSumaryResponse) => void;
  onKiemDuyet?: (maSuCo:string ,trangThai: TrangThaiKiemDuyet ,lyDo : string ) => void;
  onRequireMoreInfo?: (item: SucoSumaryResponse) => void;
  loai?: "KIEM_DUYET" | "PHAN_CONG";
};

const getReliability = (diemSpam: number | undefined) => {
  const spam = diemSpam ?? 0;
  const score = Math.max(0, 100 - spam);

  if (score >= 80) return { score, colorClass: "high" };
  if (score >= 50) return { score, colorClass: "medium" };
  return { score, colorClass: "low" };
};

const getStatusDetails = (trangThai: string) => {
  switch (trangThai) {
    case "CHO_TIEP_NHAN":
      return { label: "Chờ duyệt", className: "status-cho-duyet" };
    case "DA_TIEP_NHAN":
      return { label: "Chờ phân công", className: "status-cho-phan-cong" };
    case "TU_CHOI":
      return { label: "Từ chối", className: "status-tu-choi" };
    case "BO_SUNG":
      return { label: "Cần bổ sung", className: "status-bo-sung" };
    case "DANG_XU_LY":
      return { label: "Đang xử lý", className: "status-dang-xu-ly" };
    case "DA_XU_LY_XONG":
      return { label: "Đã xử lý xong", className: "status-da-xu-ly" };
    case "DA_DONG":
      return { label: "Đã đóng", className: "status-da-dong" };
    default:
      return { label: trangThai, className: "status-default" };
  }
};

const getPriorityDetails = (uuTien: string) => {
  switch (uuTien) {
    case "KHAN_CAP":
      return { label: "Khẩn cấp", className: "prio-khan-cap" };
    case "CAO":
      return { label: "Ưu tiên cao", className: "prio-cao" };
    case "TRUNG_BINH":
      return { label: "Trung bình", className: "prio-trung-binh" };
    case "THAP":
      return { label: "Thấp", className: "prio-thap" };
    default:
      return { label: uuTien, className: "prio-default" };
  }
};

const KiemDuyetCardList = ({ data, onRowClick, onKiemDuyet, loai }: Props) => {
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const startReject = (maSuCo: string) => {
    setRejectTargetId(maSuCo);
    setRejectReason("");
  };

  const cancelReject = () => {
    setRejectTargetId(null);
    setRejectReason("");
  };

  const submitReject = (item: SucoSumaryResponse) => {
    if (!onKiemDuyet) return;
    onKiemDuyet(item.maSuCo, TrangThaiKiemDuyet.TU_CHOI, rejectReason.trim());
    cancelReject();
  };

  return (
    <div className="kd-card-list">
      {data.map((item) => {
        const rel = getReliability(item.diemSpam);
        const status = getStatusDetails(item.trangThai);
        const priority = getPriorityDetails(item.doUuTien);
        return (
          <div
            key={item.maSuCo}
            className={`kd-list-card severity ${priority.className}`}
            onClick={() => onRowClick(item)}
          >
            {/* Top Image & Overlays */}
            <div className="card-img-wrap">
              <div className="card-id-overlay">#{item.maSuCo}</div>
              <div className={`card-status-overlay ${status.className}`}>
                {status.label}
              </div>
              {item.thumbnail ? (
                <img
                  src={API_CONFIG.BASE_URL + item.thumbnail}
                  alt="Thumbnail"
                />
              ) : (
                <div className="card-img-placeholder">Không có ảnh</div>
              )}
            </div>

            {/* Bottom Content Container */}
            <div className="card-info-container">
              {/* Priority & Time Ago */}
              <div className="card-meta-row">
                <span className={`badge-priority ${priority.className}`}>
                  {priority.label}
                </span>
                <span className="time-elapsed">
                  <Clock size={14} />
                  {timeAgo(item.thoiGianTao)}
                </span>
              </div>

              {/* Title */}
              <h3 className="card-title" title={item.tieuDe || item.noiDung}>
                {item.tieuDe || item.noiDung || "Không có tiêu đề"}
              </h3>

              {/* Location */}
              <div className="card-address">
                <MapPin size={16} />
                <span>{item.diaDiem || "Chưa xác định"}</span>
              </div>

              {/* Reliability Progress Bar */}
              <div className="confidence-bar-section">
                <span className="confidence-label">Độ tin cậy AI:</span>
                <div className="bar-bg">
                  <div
                    className={`bar-fill bg-${rel.colorClass}`}
                    style={{ width: `${rel.score}%` }}
                  />
                </div>
                <span className={`bar-text text-${rel.colorClass}`}>{rel.score}%</span>
              </div>      

              <div className="card-actions">
                {item.trangThai === "CHO_TIEP_NHAN" && loai === "KIEM_DUYET" && (
                  <>
                    <div className="actions-primary-row">
                      <button
                        className="btn-approve"
                        onClick={(e) => {
                          e.stopPropagation();
                          onKiemDuyet?.(item.maSuCo, TrangThaiKiemDuyet.DUYET, "");
                        }}
                      >
                        <CheckCircle2 size={16} /> Duyệt
                      </button>

                      <button
                        className="btn-reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          startReject(item.maSuCo);
                        }}
                      >
                        <XCircle size={16} /> Từ chối
                      </button>
                    </div>
                    <button
                      className="btn-detail-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onKiemDuyet?.(item.maSuCo, TrangThaiKiemDuyet.BO_SUNG, "");
                      }}
                    >
                      Yêu cầu bổ sung
                    </button>

                    {rejectTargetId === item.maSuCo && (
                      <div className="reject-reason-panel">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Nhập lý do từ chối..."
                          className="reject-reason-input"
                        />
                        <div className="reject-actions-row">
                          <button
                            className="btn-reject-confirm"
                            disabled={!rejectReason.trim()}
                            onClick={(e) => {
                              e.stopPropagation();
                              submitReject(item);
                            }}
                          >
                            Xác nhận từ chối
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelReject();
                            }}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KiemDuyetCardList;

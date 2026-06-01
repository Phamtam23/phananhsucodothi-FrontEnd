import { MapPin, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import type { SucoSumaryResponse } from "../../types/Suco";
import { API_CONFIG } from "../../constants/app.constants";
import { formatDate, formatTime } from "../../utils/Format";
import "./KiemDuyetCardList.scss";

type Props = {
  data: SucoSumaryResponse[];
  onRowClick: (item: SucoSumaryResponse) => void;
  onApprove?: (item: SucoSumaryResponse) => void;
  onReject?: (item: SucoSumaryResponse) => void;
};

const getReliability = (diemSpam: number | undefined) => {
  const spam = diemSpam ?? 0;
  const score = Math.max(0, 100 - spam);

  if (score >= 80) return { score, colorClass: "high" };
  if (score >= 50) return { score, colorClass: "medium" };
  return { score, colorClass: "low" };
};

// A helper for severity (just mimicking the UI for now, you can adjust based on real data)
const getSeverityInfo = (item: SucoSumaryResponse) => {
    // Random or mock logic if real severity doesn't exist on SucoSumaryResponse
    const score = 100 - (item.diemSpam ?? 0);
    if (score < 50) return { label: "Mức độ: Cao", className: "high", icon: <AlertTriangle /> };
    if (score < 80) return { label: "Mức độ: Trung bình", className: "medium", icon: <Info /> };
    return { label: "Mức độ: Thấp", className: "low", icon: <Info /> };
}

const KiemDuyetCardList = ({ data, onRowClick, onApprove, onReject }: Props) => {
  return (
    <div className="kd-card-list">
      {data.map((item) => {
        const rel = getReliability(item.diemSpam);
        const severity = getSeverityInfo(item);
        
        return (
          <div 
            key={item.maSuCo} 
            className={`kd-list-card severity-${severity.className}`}
            onClick={() => onRowClick(item)}
          >
            {/* Left Image */}
            <div className="card-img-wrap">
              <div className="card-id-overlay">ID: #{item.maSuCo.slice(0, 8).toUpperCase()}</div>
              {item.thumbnail ? (
                <img
                  src={API_CONFIG.BASE_URL + item.thumbnail}
                  alt="Thumbnail"
                />
              ) : (
                <div className="card-img-placeholder">Không có ảnh</div>
              )}
            </div>

            {/* Middle Content */}
            <div className="card-content-wrap">
              <div className="card-info-top">
                <h3>{item.tieuDe || item.noiDung || "Không có nội dung"}</h3>
                <div className="card-address">
                  <MapPin />
                  <span>{item.diaDiem || "Chưa xác định"}</span>
                </div>
              </div>

              <div className="card-badges">
                <span className="badge-category">HẠ TẦNG GIAO THÔNG</span>
                
                <span className={`badge-severity ${severity.className}`}>
                  {severity.icon}
                  {severity.label}
                </span>
              </div>
            </div>

            {/* Right Side Stats & Actions */}
            <div className="card-actions-wrap">
              <div className="card-stats-row">
                <div className="stat-block">
                  <span className="stat-label">ĐỘ TIN CẬY</span>
                  <div className="confidence-bar">
                    <div className="bar-bg">
                      <div 
                        className={`bar-fill bg-${rel.colorClass}`} 
                        style={{ width: `${rel.score}%` }} 
                      />
                    </div>
                    <span className={`bar-text text-${rel.colorClass}`}>{rel.score}%</span>
                  </div>
                  {rel.score < 50 && (
                    <span className="spam-warning-text">{item.lyDoSpam}</span>
                  )}
                </div>

                <div className="stat-block">
                  <span className="stat-label">NGÀY GỬI</span>
                  <span className="stat-value">
                    {formatDate(item.thoiGianTao)}, {formatTime(item.thoiGianTao)}
                  </span>
                </div>
              </div>

              <div className="card-buttons-row">
                <button className="btn-detail" onClick={(e) => { e.stopPropagation(); onRowClick(item); }}>
                  Xem chi tiết
                </button>
                <button 
                  className="btn-reject" 
                  title="Từ chối"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject?.(item);
                  }}
                >
                  <X size={18} />
                </button>
                <button 
                  className="btn-approve"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove?.(item);
                  }}
                >
                  <CheckCircle2 size={16} /> Duyệt
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KiemDuyetCardList;

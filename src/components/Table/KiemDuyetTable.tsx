import { MapPin } from "lucide-react"
import type { SucoSumaryResponse } from "../../types/Suco";

import { API_CONFIG } from "../../constants/app.constants";

import { formatDate, formatTime } from "../../utils/Format";

type Props = {
  data: SucoSumaryResponse[];
  onRowClick: (item: SucoSumaryResponse) => void;
};

const getReliability = (diemSpam: number | undefined) => {
  const spam = diemSpam ?? 0;

  const score = Math.max(0, 100 - spam);

  
  if (score >= 80) {
    return {
      score,
      text: "Tin cậy tuyệt đối",
      color: "green",
      bg: "#10b981",
    };
  }

  if (score >= 50) {
    return {
      score,
      text: "Tin cậy cao",
      color: "orange",
      bg: "#f59e0b",
    };
  }

  return {
    score,
    text: "Spam khả nghi",
    color: "red",
    bg: "#ef4444",
  };
};

const KiemDuyetTable = ({ data, onRowClick }:Props) => {
     return (
    <table className="kd-table">
      <thead>
        <tr>
          <th>Tiêu đề</th>
          <th>Địa điểm</th>
          <th>Độ tin cậy</th>
          <th>Lý do spam</th>
          <th>Ngày tạo</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => {
          const rel = getReliability(item.diemSpam);

          return (
            <tr
              key={item.maSuCo}
              onClick={() => onRowClick(item)}
              style={{ cursor: "pointer" }}
            >
              {/* TITLE */}
              <td>
                <div className="kd-content-cell">

                  {item.thumbnail ? (
                    <img
                      src={
                        API_CONFIG.BASE_URL +
                        item.thumbnail
                      }
                      alt="Thumbnail"
                      className="kd-thumbnail"
                    />
                  ) : (
                    <div
                      className="kd-thumbnail"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#9ca3af",
                          fontSize: "10px",
                        }}
                      >
                        No img
                      </span>
                    </div>
                  )}

                  <div className="kd-text">
                    <p>
                      {item.tieuDe ||
                        item.noiDung ||
                        "Không có nội dung"}
                    </p>
                  </div>
                </div>
              </td>

              {/* ADDRESS */}
              <td>
                <div className="kd-address-cell">
                  <MapPin />
                  <span>
                      {item.diaDiem
                  ? item.diaDiem.length > 20
                    ? item.diaDiem.slice(0, 20) + "..."
                    : item.diaDiem
                  : "Chưa xác định"}
                  </span>
                </div>
              </td>

              {/* RELIABILITY */}
              <td>
                <div className="kd-reliability-cell">
                  <div className="kd-progress-wrap">

                    <div className="kd-progress-bg">
                      <div
                        className="kd-progress-fill"
                        style={{
                          width: `${rel.score}%`,
                          backgroundColor: rel.bg,
                        }}
                      />
                    </div>

                    <span
                      className={`kd-progress-text ${rel.color}`}
                    >
                      {rel.score}
                    </span>
                  </div>
                </div>
              </td>

              {/* SPAM REASON */}
              <td>
                <div className="kd-reliability-cell">
                  <span>
                    {item.lyDoSpam ||
                      "Không có"}
                  </span>
                </div>
              </td>

              {/* DATE */}
              <td>
                <div className="kd-date-cell">

                  <div className="kd-date">
                    {formatDate(
                      item.thoiGianTao
                    )}
                  </div>

                  <div className="kd-time">
                    {formatTime(
                      item.thoiGianTao
                    )}
                  </div>

                </div>
              </td>

              {/* ACTIONS */}
              <td>
                <div className="kd-actions-cell">
                  <button
                    className="kd-btn kd-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(item);
                    }}
                  >
                    Duyệt
                  </button>
                  <button
                    className="kd-btn kd-btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(item);
                    }}
                  >
                    Từ chối
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}


export default KiemDuyetTable;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ListFilter, MoreHorizontal, CheckCircle2 } from "lucide-react";
import "./KiemDuyetPage.scss";
import { GetALLSuCoService, GetSuCoByTrangThaiService } from "../../../services/SucoService";
import type { SucoSumaryResponse } from "../../../types/Suco";
import type { PageResponse } from "../../../types/Page";
// import {BASE_URL} from "../../../constants/app.constants";

const PAGE_SIZE = 10;

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TrangThaiFilter = "tat_ca" | "CHO_TIEP_NHAN" | "DA_TIEP_NHAN" | "TU_CHOI";

const TRANG_THAI_FILTERS: { value: TrangThaiFilter; label: string }[] = [
  { value: "tat_ca", label: "Tất cả trạng thái" },
  { value: "CHO_TIEP_NHAN", label: "Chờ tiếp nhận" },
  { value: "DA_TIEP_NHAN", label: "Đã tiếp nhận" },
  { value: "TU_CHOI", label: "Từ chối" },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const formatDate = (iso?: string) => {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (iso?: string) => {
  if (!iso) return "--";
  return new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getReliability = (diemSpam: number | undefined) => {
  const spam = diemSpam ?? 0;
  const score = Math.max(0, 100 - spam);

  if (score >= 80) return { score, text: "Tin cậy tuyệt đối", color: "green", bg: "#10b981" };
  if (score >= 50) return { score, text: "Tin cậy cao", color: "orange", bg: "#f59e0b" };
  return { score, text: "Spam khả nghi", color: "red", bg: "#ef4444" };
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const KiemDuyetPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<SucoSumaryResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const [activeFilter, setActiveFilter] = useState<TrangThaiFilter>("tat_ca");

  const [searchCode, setSearchCode] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let res;
        if (activeFilter === "tat_ca") {
          res = await GetALLSuCoService(currentPage, PAGE_SIZE);
        } else {
          res = await GetSuCoByTrangThaiService(activeFilter, currentPage, PAGE_SIZE);
        }

        if (cancelled) return;

        const page: PageResponse<SucoSumaryResponse> = res.data;
        setData(page.content ?? []);
        setTotalElements(page.pagination?.totalElements ?? 0);
        setTotalPages(page.pagination?.totalPages ?? 1);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.response?.data?.message || e?.message || "Không thể tải dữ liệu");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [currentPage, activeFilter]);

  const handleRowClick = (maSuCo: string) => {
    navigate(`/nhanvien/kiem-duyet/${maSuCo}`);
  };

  const filteredData = data.filter(item => {
    const codeMatch = !searchCode || (item.maSuCo && item.maSuCo.toLowerCase().includes(searchCode.toLowerCase()));
    const locMatch = !searchLocation || (item.diaDiem && item.diaDiem.toLowerCase().includes(searchLocation.toLowerCase()));
    return codeMatch && locMatch;
  });

  return (
    <div className="kd-page">
      {/* Summary Cards */}
      <div className="kd-summary-cards">
        <div className="kd-card">
          <div className="kd-card-content">
            <span className="kd-card-title">Tổng sự cố</span>
            <div className="kd-card-value">
              1,284
              <span className="kd-badge-tag">+12%</span>
            </div>
          </div>
        </div>

        <div className="kd-card">
          <div className="kd-card-content">
            <span className="kd-card-title">Chờ duyệt</span>
            <div className="kd-card-value">42</div>
          </div>
          <div className="kd-card-icon orange">
            <MoreHorizontal size={24} />
          </div>
        </div>

        <div className="kd-card">
          <div className="kd-card-content">
            <span className="kd-card-title">Đã xử lý</span>
            <div className="kd-card-value">1,120</div>
          </div>
          <div className="kd-card-icon black">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="kd-table-wrapper">
        {/* Filter Bar */}
        <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
          <div className="kd-filter-bar">
            <div className="kd-filter-input-wrap">
              <Search />
              <input
                placeholder="Mã sự cố..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>

            <div className="kd-filter-input-wrap">
              <MapPin />
              <input
                placeholder="Vị trí/Quận..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <div className="kd-filter-input-wrap">
              <Calendar />
              <input
                placeholder="Khoảng ngày..."
                readOnly
              />
            </div>

            <div className="kd-filter-input-wrap">
              <ListFilter />
              <select
                className="kd-filter-select"
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value as TrangThaiFilter);
                  setCurrentPage(0);
                }}
              >
                {TRANG_THAI_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="kd-state-box">
            <div className="kd-spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="kd-state-box error">
            <p>{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="kd-state-box">
            <p>Không có sự cố nào.</p>
          </div>
        ) : (
          <table className="kd-table">
            <thead>
              <tr>
                <th>Mã sự cố</th>
                <th>Tiêu đề</th>
                <th>Địa điểm</th>
                <th>Độ tin cậy</th>
                <th>Người dân</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const rel = getReliability(item.diemSpam);
                return (
                  <tr key={item.maSuCo} onClick={() => handleRowClick(item.maSuCo)} style={{ cursor: 'pointer' }}>
                    <td className="kd-id-cell">
                      {item.maSuCo?.startsWith('SC-') || item.maSuCo?.startsWith('#') ? item.maSuCo : `#SC-${item.maSuCo || '---'}`}
                    </td>

                    <td>
                      <div className="kd-content-cell">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt="Thumbnail" className="kd-thumbnail" />
                        ) : (
                          <div className="kd-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#9ca3af', fontSize: '10px' }}>No img</span>
                          </div>
                        )}
                        <div className="kd-text">
                          <p>{item.tieuDe || item.noiDung || "Không có nội dung"}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="kd-address-cell">
                        <MapPin />
                        <span>{item.diaDiem || "Chưa xác định"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="kd-reliability-cell">
                        <div className="kd-progress-wrap">
                          <div className="kd-progress-bg">
                            <div className="kd-progress-fill" style={{ width: `${rel.score}%`, backgroundColor: rel.bg }}></div>
                          </div>
                          <span className={`kd-progress-text ${rel.color}`}>
                            {rel.score}% - {item.lyDoSpam}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="kd-citizen-cell">
                        <div className="kd-avatar">
                          {getInitials(item.maNguoiDan)}
                        </div>
                        <span className="kd-name">{item.maNguoiDan || "Ẩn danh"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="kd-date-cell">
                        <div className="kd-date">{formatDate(item.thoiGianTao)}</div>
                        <div className="kd-time">{formatTime(item.thoiGianTao)}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="kd-table-footer">
            <span className="kd-showing-text">
              Hiển thị {filteredData.length > 0 ? currentPage * PAGE_SIZE + 1 : 0} - {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)} trong số {totalElements} sự cố
            </span>

            {totalPages > 1 && (
              <div className="kd-pagination">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  &lt;
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i;
                  if (currentPage > 2 && totalPages > 5) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum >= totalPages) pageNum = totalPages - (5 - i);
                  }
                  return (
                    <button
                      key={pageNum}
                      className={currentPage === pageNum ? "active" : ""}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 3 && (
                  <>
                    <button disabled>...</button>
                    <button onClick={() => setCurrentPage(totalPages - 1)}>{totalPages}</button>
                  </>
                )}

                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KiemDuyetPage;
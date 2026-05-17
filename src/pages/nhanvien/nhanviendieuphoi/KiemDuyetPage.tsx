import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KiemDuyetPage.scss";

import {
  GetALLSuCoService,
  GetSuCoByTrangThaiService,
} from "../../../services/SucoService";

import type { SucoSumaryResponse } from "../../../types/Suco";
import type { PageResponse } from "../../../types/Page";
// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TrangThaiFilter =
  | "tat_ca"
  | "CHO_TIEP_NHAN"
  | "DA_TIEP_NHAN"
  | "TU_CHOI";

const TRANG_THAI_FILTERS: TrangThaiFilter[] = [
  "tat_ca",
  "CHO_TIEP_NHAN",
  "DA_TIEP_NHAN",
  "TU_CHOI",
];

const trangThaiLabel: Record<string, string> = {
  tat_ca: "Tất cả",
  CHO_TIEP_NHAN: "Chờ tiếp nhận",
  DA_TIEP_NHAN: "Đã tiếp nhận",
  TU_CHOI: "Từ chối",
};

const trangThaiBadgeClass: Record<string, string> = {
  CHO_TIEP_NHAN: "kd-badge--cho-duyet",
  DA_TIEP_NHAN: "kd-badge--da-duyet",
  TU_CHOI: "kd-badge--tu-choi",
};

const PAGE_SIZE = 10;

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

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const KiemDuyetPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<SucoSumaryResponse[]>([]);

  const [totalElements, setTotalElements] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(0);

  const [activeFilter, setActiveFilter] =
    useState<TrangThaiFilter>("tat_ca");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // Load data
  // ─────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let page: PageResponse<SucoSumaryResponse>;

        // ─────────────────────────────
        // Tất cả
        // ─────────────────────────────

        if (activeFilter === "tat_ca") {
          const res = await GetALLSuCoService(
            currentPage,
            PAGE_SIZE
          );

          if (cancelled) return;

          page = res.data;
        }

        // ─────────────────────────────
        // Theo trạng thái
        // ─────────────────────────────

        else {
          const res =
            await GetSuCoByTrangThaiService(
              activeFilter,
              currentPage,
              PAGE_SIZE
            );

          if (cancelled) return;

          page = res.data;
        }

        // ─────────────────────────────
        // Update state
        // ─────────────────────────────

        setData(page.content ?? []);

        setTotalElements(
          page.pagination?.totalElements ?? 0
        );

        setTotalPages(
          page.pagination?.totalPages ?? 1
        );
      } catch (e: any) {
        if (cancelled) return;

        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Không thể tải dữ liệu"
        );
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
  }, [activeFilter, currentPage]);

  // ─────────────────────────────────────────────
  // Change filter
  // ─────────────────────────────────────────────

  const handleFilterChange = (
    filter: TrangThaiFilter
  ) => {
    if (filter === activeFilter) return;

    setCurrentPage(0);

    setActiveFilter(filter);
  };

  // ─────────────────────────────────────────────
  // Navigate detail
  // ─────────────────────────────────────────────

  const handleRowClick = (maSuCo: string) => {
    navigate(`/${maSuCo}`);
  };

  // ─────────────────────────────────────────────
  // Search local
  // ─────────────────────────────────────────────

  const filtered = search.trim()
    ? data.filter((item) => {
        const keyword = search.toLowerCase();

        return (
          (item.maSuCo ?? "")
            .toLowerCase()
            .includes(keyword) ||
          (item.diaDiem ?? "")
            .toLowerCase()
            .includes(keyword) ||
          (item.noiDung ?? "")
            .toLowerCase()
            .includes(keyword)
        );
      })
    : data;

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="kd-page">
      {/* Header */}
      <div className="kd-filter-bar">
        <div className="kd-filter-left">
          <span className="kd-total-label">
            Tổng:
            <strong> {totalElements} </strong>
            sự cố
          </span>

          <div className="kd-filters">
            {TRANG_THAI_FILTERS.map((f) => (
              <button
                key={f}
                className={`kd-filter-btn ${
                  activeFilter === f
                    ? "kd-filter-btn--active"
                    : ""
                }`}
                onClick={() =>
                  handleFilterChange(f)
                }
              >
                {trangThaiLabel[f]}
              </button>
            ))}
          </div>
        </div>

        <input
          className="kd-search-input"
          placeholder="Tìm theo mã, địa điểm, nội dung..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Table */}
      <div className="kd-table-wrapper">
        {loading ? (
          <div className="kd-state-box">
            <span className="kd-spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="kd-state-box kd-state-box--error">
            <p>{error}</p>

            <button
              className="kd-retry-btn"
              onClick={() =>
                setCurrentPage((p) => p)
              }
            >
              Thử lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="kd-state-box">
            <p>Không có sự cố nào.</p>
          </div>
        ) : (
          <table className="kd-table">
            <thead>
              <tr>
                <th>Mã sự cố</th>
                <th>Nội dung</th>
                <th>Địa điểm</th>
                <th>Mã người dân</th>
                <th>Ngày tạo</th>
                <th>Dự kiến hoàn thành</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.maSuCo}
                  className="kd-row"
                  onClick={() =>
                    handleRowClick(item.maSuCo)
                  }
                >
                  <td className="kd-id-cell">
                    {item.maSuCo ?? "--"}
                  </td>

                  <td className="kd-content-cell">
                    {item.noiDung ?? "--"}
                  </td>

                  <td>
                    {item.diaDiem ?? "--"}
                  </td>

                  <td className="kd-citizen-cell">
                    {item.maNguoiDan ?? "--"}
                  </td>

                  <td className="kd-date-cell">
                    {formatDate(
                      item.thoiGianTao
                    )}
                  </td>

                  <td className="kd-date-cell">
                    {formatDate(
                      item.ngayDuKienHoanThanh
                    )}
                  </td>

                  <td>
                    <span
                      className={`kd-badge ${
                        trangThaiBadgeClass[
                          item.trangThai
                        ] ?? ""
                      }`}
                    >
                      {trangThaiLabel[
                        item.trangThai
                      ] ?? item.trangThai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="kd-pagination">
          {/* First */}
          <button
            className="kd-page-btn"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(0)}
          >
            «
          </button>

          {/* Prev */}
          <button
            className="kd-page-btn"
            disabled={currentPage === 0}
            onClick={() =>
              setCurrentPage((p) => p - 1)
            }
          >
            ←
          </button>

          {/* Number */}
          {Array.from(
            { length: totalPages },
            (_, i) => i
          ).map((i) => (
            <button
              key={i}
              className={`kd-page-btn ${
                currentPage === i
                  ? "kd-page-btn--active"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage(i)
              }
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            className="kd-page-btn"
            disabled={
              currentPage === totalPages - 1
            }
            onClick={() =>
              setCurrentPage((p) => p + 1)
            }
          >
            →
          </button>

          {/* Last */}
          <button
            className="kd-page-btn"
            disabled={
              currentPage === totalPages - 1
            }
            onClick={() =>
              setCurrentPage(totalPages - 1)
            }
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default KiemDuyetPage;
import "./PhanCongPhanLoaiPage.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GetSuCoByTrangThaiService } from "../../../services/SucoService";

import type { SucoSumaryResponse } from "../../../types/Suco";

const PAGE_SIZE = 10;

const formatDate = (iso?: string) => {
  if (!iso) return "--";

  return new Date(iso).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};

const PhanCongPhanLoaiPage = () => {
  const navigate = useNavigate();

  const [sucoList, setSucoList] =
    useState<SucoSumaryResponse[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [currentPage, setCurrentPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalElements, setTotalElements] =
    useState(0);

  // ─────────────────────────────────────
  // Load danh sách CHỜ TIẾP NHẬN
  // ─────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);

        setError(null);

        const res =
          await GetSuCoByTrangThaiService(
            "DA_TIEP_NHAN",
            currentPage,
            PAGE_SIZE
          );

        if (cancelled) return;

        const page = res.data;

        setSucoList(page.content ?? []);

        setTotalElements(
          page.pagination
            ?.totalElements ?? 0
        );

        setTotalPages(
          page.pagination?.totalPages ??
            1
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

    loadData();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  // ─────────────────────────────────────
  // Navigate detail
  // ─────────────────────────────────────

  const handleRowClick = (
    maSuCo: string
  ) => {
    navigate(
      `/nhanvien/phan-cong/${maSuCo}`
    );
  };

  return (
    <div className="pc-page">
      {/* Header */}
      <div className="pc-header">
        <h2>
          Danh sách sự cố chờ phân công
        </h2>

        <span className="pc-total">
          Tổng:
          <strong>
            {" "}
            {totalElements}{" "}
          </strong>
          sự cố
        </span>
      </div>

      {/* Table */}
      <div className="pc-table-wrapper">
        {loading ? (
          <div className="pc-state-box">
            <span className="pc-spinner" />

            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="pc-state-box pc-state-box--error">
            <p>{error}</p>
          </div>
        ) : sucoList.length === 0 ? (
          <div className="pc-state-box">
            <p>
              Không có sự cố cần phân
              công.
            </p>
          </div>
        ) : (
          <table className="pc-table">
            <thead>
              <tr>
                <th>Mã sự cố</th>
                <th>Nội dung</th>
                <th>Địa điểm</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {sucoList.map((item) => (
                <tr
                  key={item.maSuCo}
                  className="pc-row"
                  onClick={() =>
                    handleRowClick(
                      item.maSuCo
                    )
                  }
                >
                  <td className="pc-id-cell">
                    {item.maSuCo}
                  </td>

                  <td className="pc-content-cell">
                    {item.noiDung ??
                      "--"}
                  </td>

                  <td>
                    {item.diaDiem ??
                      "--"}
                  </td>

                  <td className="pc-date-cell">
                    {formatDate(
                      item.thoiGianTao
                    )}
                  </td>

                  <td>
                    <span className="pc-badge">
                      {
                        item.trangThai
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading &&
        totalPages > 1 && (
          <div className="pc-pagination">
            {/* Prev */}
            <button
              className="pc-page-btn"
              disabled={
                currentPage === 0
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p - 1
                )
              }
            >
              ←
            </button>

            {/* Numbers */}
            {Array.from(
              {
                length: totalPages,
              },
              (_, i) => i
            ).map((i) => (
              <button
                key={i}
                className={`pc-page-btn ${
                  currentPage === i
                    ? "pc-page-btn--active"
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
              className="pc-page-btn"
              disabled={
                currentPage ===
                totalPages - 1
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p + 1
                )
              }
            >
              →
            </button>
          </div>
        )}
    </div>
  );
};

export default PhanCongPhanLoaiPage;
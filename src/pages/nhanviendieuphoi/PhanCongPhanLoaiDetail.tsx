import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import "./PhanCongPhanLoaiDetail.scss";

import DetailSuCo from "../../components/Suco/DetailSuCo";
import ListLoai from "../../components/PhanLoai/ListLoai";
import DanhSachPhanCong from "../../components/PhanCong/DanhSachPhanCong";
import CreatePhanCong from "../../components/PhanCong/CreatePhanCong";

import { useCreatePhanLoai } from "../../hooks/phanloai/useCreatePhanLoai";

import type { LoaiResponse } from "../../types/Loai";

const PhanCongPhanLoaiDetail = () => {
  const navigate = useNavigate();
  const { maSuCo } = useParams();

  // ── Phân loại state ──────────────────────────
  const [selectedLoaiList, setSelectedLoaiList] =
    useState<LoaiResponse[]>([]);

  const [ghiChu, setGhiChu] = useState("");

  const {
    createPhieuPhanLoai,
    loading: loadingPhanLoai,
    error: errorPhanLoai,
  } = useCreatePhanLoai();

  const [phanLoaiDone, setPhanLoaiDone] =
    useState(false);

  // ── Tabs ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    "phan-loai" | "phan-cong" | "ds-phan-cong"
  >("phan-loai");

  // ── Guard ────────────────────────────────────
  if (!maSuCo) {
    return (
      <div className="pcpl-page">
        <div className="pcpl-panel">
          <p>Không tìm thấy mã sự cố.</p>
        </div>
      </div>
    );
  }

  // ── Handlers ─────────────────────────────────
  const handleSelectLoai = (loai: LoaiResponse) => {
    setSelectedLoaiList((prev) => {
      const exists = prev.some(
        (l) => l.maLoai === loai.maLoai
      );

      if (exists) {
        return prev.filter(
          (l) => l.maLoai !== loai.maLoai
        );
      }

      return [...prev, loai];
    });
  };

  const handleSubmitPhanLoai = async () => {
    if (selectedLoaiList.length === 0) return;

    try {
      await createPhieuPhanLoai({
        maSuCo,
        maLoai: selectedLoaiList.map(
          (l) => l.maLoai
        ),
      });

      setPhanLoaiDone(true);
    } catch {
      // error handled by hook
    }
  };

  // ── Render ───────────────────────────────────
  return (
    <div className="pcpl-page">

      <div className="pcpl-layout">
        {/* ─── LEFT: Detail sự cố ──────────── */}
        <div className="pcpl-main">
          <DetailSuCo maSuCo={maSuCo} />
        </div>

        {/* ─── RIGHT: Action panel ─────────── */}
        <div className="pcpl-sidebar">
          {/* Header */}
          <div className="pcpl-sidebar-header">
            <h3 className="pcpl-sidebar-title">
              Xử lý Phân loại
            </h3>

            <p className="pcpl-sidebar-sub">
              ĐANG THỰC HIỆN CHO{" "}
              <strong>#{maSuCo}</strong>
            </p>
          </div>

          {/* Tabs */}
          <div className="pcpl-tabs">
            <button
              className={`pcpl-tab ${activeTab === "phan-loai"
                ? "pcpl-tab--active"
                : ""
                }`}
              onClick={() =>
                setActiveTab("phan-loai")
              }
            >
              Phân loại
            </button>

            <button
              className={`pcpl-tab ${activeTab === "phan-cong"
                ? "pcpl-tab--active"
                : ""
                }`}
              onClick={() =>
                setActiveTab("phan-cong")
              }
            >
              Phân công
            </button>

            <button
              className={`pcpl-tab ${activeTab === "ds-phan-cong"
                ? "pcpl-tab--active"
                : ""
                }`}
              onClick={() =>
                setActiveTab("ds-phan-cong")
              }
            >
              DS Phân công
            </button>
          </div>

          {/* Tab content */}
          <div className="pcpl-tab-content">
            {/* ── Tab: Phân loại ──────────── */}
            {activeTab === "phan-loai" && (
              <div className="create-phan-cong">
                <h2 className="create-phan-cong__title">
                  Phân loại sự cố
                </h2>

                {errorPhanLoai && (
                  <p className="error-msg">
                    {errorPhanLoai}
                  </p>
                )}

                <div>
                  <ListLoai
                    selectedLoaiList={
                      selectedLoaiList
                    }
                    onSelect={handleSelectLoai}
                  />
                </div>

                <div>
                  <span className="section-label">
                    Loại đã chọn
                  </span>
                  <div className="selected-list">
                    {selectedLoaiList.length ===
                      0 ? (
                      <p className="empty-selected">
                        Chưa chọn loại nào
                      </p>
                    ) : (
                      selectedLoaiList.map(
                        (loai) => (
                          <div
                            key={loai.maLoai}
                            className="selected-item"
                          >
                            <span className="selected-item__name">
                              {loai.tenLoaiSuCo}
                            </span>
                            <button
                              className="btn-remove"
                              onClick={() =>
                                handleSelectLoai(
                                  loai
                                )
                              }
                            >
                              ✕ Xóa
                            </button>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
                {phanLoaiDone && (
                  <div className="pcpl-success-box">
                    <span className="pcpl-success-icon">
                      ✓
                    </span>
                    Phân loại thành công!
                  </div>
                )}

                <button
                  className="btn-submit"
                  disabled={
                    loadingPhanLoai ||
                    selectedLoaiList.length === 0
                  }
                  onClick={handleSubmitPhanLoai}
                >
                  {loadingPhanLoai
                    ? "Đang xử lý..."
                    : "Xác nhận phân loại"}
                </button>
              </div>
            )}

            {activeTab === "phan-cong" && (
              <CreatePhanCong maSuCo={maSuCo} />
            )}

            {activeTab === "ds-phan-cong" && (
              <DanhSachPhanCong maSuCo={maSuCo} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhanCongPhanLoaiDetail;

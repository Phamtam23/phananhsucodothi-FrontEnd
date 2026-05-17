import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import "./KiemDuyetDetailPage.scss";

import DetailSuCo from "../../../components/Suco/DetailSuCo";

import {
  CreatePhieuKiemDuyetService,
} from "../../../services/PhieuKiemDuyetService";

import {
  TrangThaiKiemDuyet,
} from "../../../types/PhieuKiemDuyet";

import type {
  CreatePhieuKiemDuyetRequest,
  PhieuKiemDuyetResponse,
} from "../../../types/PhieuKiemDuyet";

const KiemDuyetDetailPage = () => {
  const navigate = useNavigate();
  const { maSuCo } = useParams();

  const [lyDo, setLyDo] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [dangChon, setDangChon] =
    useState<TrangThaiKiemDuyet | null>(
      null
    );

  const [phieuKetQua, setPhieuKetQua] =
    useState<PhieuKiemDuyetResponse | null>(
      null
    );

  // ─────────────────────────────────────
  // Không có mã sự cố
  // ─────────────────────────────────────

  if (!maSuCo) {
    return (
      <div className="kdp-page">
        <div className="kdp-panel">
          <p>Không tìm thấy mã sự cố.</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────
  // Submit kiểm duyệt
  // ─────────────────────────────────────

  const handleSubmit = async (
    trangThaiKiemDuyet: TrangThaiKiemDuyet
  ) => {
    // validate từ chối
    if (
      trangThaiKiemDuyet ===
        TrangThaiKiemDuyet.TU_CHOI &&
      !lyDo.trim()
    ) {
      setError(
        "Vui lòng nhập lý do từ chối."
      );

      return;
    }

    try {
      setLoading(true);

      setError(null);

      setDangChon(trangThaiKiemDuyet);

      const body: CreatePhieuKiemDuyetRequest =
        {
          maSuCo,

          trangThaiKiemDuyet,

          lyDoTuChoi:
            trangThaiKiemDuyet ===
            TrangThaiKiemDuyet.TU_CHOI
              ? lyDo.trim()
              : "",
        };

      const res =
        await CreatePhieuKiemDuyetService(
          body
        );

      // check status
      if (
        res.status !== 200 &&
        res.status !== 201
      ) {
        throw new Error(
          "Kiểm duyệt thất bại."
        );
      }

      setPhieuKetQua(res.data);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Có lỗi xảy ra."
      );

      setDangChon(null);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // Check trạng thái
  // ─────────────────────────────────────

  const isDuyet =
    phieuKetQua?.trangThai ===
    TrangThaiKiemDuyet.DUYET;

  // ─────────────────────────────────────
  // Render
  // ─────────────────────────────────────

  return (
    <div className="kdp-page">
      {/* Back */}
      <button
        className="kdp-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Quay lại danh sách
      </button>

      {/* Detail sự cố */}
      <DetailSuCo maSuCo={maSuCo} />

      {/* Kết quả */}
      {phieuKetQua ? (
        <div className="kdp-panel">
          <div
            className={`kdp-success-box ${
              isDuyet
                ? "kdp-success-green"
                : "kdp-success-red"
            }`}
          >
            <span
              className={`kdp-success-icon ${
                isDuyet
                  ? "kdp-icon-green"
                  : "kdp-icon-red"
              }`}
            >
              {isDuyet ? "✓" : "✕"}
            </span>

            <div>
              <p className="kdp-success-title">
                {isDuyet
                  ? "Đã duyệt sự cố thành công"
                  : "Đã từ chối sự cố"}
              </p>

              <p className="kdp-success-sub">
                Mã phiếu:
                <strong>
                  {" "}
                  {
                    phieuKetQua.maKiemDuyet
                  }
                </strong>
              </p>

              <p className="kdp-success-sub">
                Mã sự cố:
                <strong>
                  {" "}
                  {maSuCo}
                </strong>
              </p>

              {phieuKetQua.lyDoTuChoi && (
                <p className="kdp-success-sub">
                  Lý do:
                  {" "}
                  {
                    phieuKetQua.lyDoTuChoi
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="kdp-panel">
          {/* Header */}
          <div className="kdp-panel-header">
            <span className="kdp-panel-icon">
              🛡
            </span>

            <div>
              <h3 className="kdp-panel-title">
                Kiểm duyệt sự cố
              </h3>

              <p className="kdp-panel-sub">
                Mã sự cố:
                <strong>
                  {" "}
                  {maSuCo}
                </strong>
              </p>
            </div>
          </div>

          {/* Input lý do */}
          <div className="kdp-field">
            <label className="kdp-label">
              Lý do từ chối

              <span className="kdp-hint">
                {" "}
                (bắt buộc khi từ chối)
              </span>
            </label>

            <textarea
              className={`kdp-textarea ${
                error
                  ? "kdp-textarea--error"
                  : ""
              }`}
              rows={4}
              placeholder="Nhập lý do từ chối..."
              value={lyDo}
              disabled={loading}
              onChange={(e) => {
                setLyDo(e.target.value);

                if (error) {
                  setError(null);
                }
              }}
            />

            {error && (
              <p className="kdp-error-text">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="kdp-actions">
            {/* Reject */}
            <button
              className="kdp-btn kdp-btn--reject"
              disabled={loading}
              onClick={() =>
                handleSubmit(
                  TrangThaiKiemDuyet.TU_CHOI
                )
              }
            >
              {loading &&
              dangChon ===
                TrangThaiKiemDuyet.TU_CHOI ? (
                <span className="kdp-spinner" />
              ) : (
                "✕ Từ chối"
              )}
            </button>

            {/* Approve */}
            <button
              className="kdp-btn kdp-btn--approve"
              disabled={loading}
              onClick={() =>
                handleSubmit(
                  TrangThaiKiemDuyet.DUYET
                )
              }
            >
              {loading &&
              dangChon ===
                TrangThaiKiemDuyet.DUYET ? (
                <span className="kdp-spinner" />
              ) : (
                "✓ Duyệt"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KiemDuyetDetailPage;
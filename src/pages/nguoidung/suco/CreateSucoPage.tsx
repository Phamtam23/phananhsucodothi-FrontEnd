import { useRef, useState, useCallback } from "react";
import { useCreateSuco } from "../../../hooks/suco/useCreateSuco";
import { useLocationSearch } from "../../../hooks/suco/uselocationsearch";
import apiClient from "../../../services/apiClient";
import "./CreateSuco.scss";

const BASE_URL = "http://localhost:8080/api/v1";

const CreateSuco = () => {
  const { form, errors, loading, handleChange, handleSubmit, setLocation, setMediaUrls } =
    useCreateSuco();

  const { query, suggestions, isSerching, handQueryChange, handleSelect, clearSuggestions } =
    useLocationSearch((kinhDo, viDo, diaDiem) => {
      setLocation(kinhDo, viDo, diaDiem);
    });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (files: File[]) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
      const valid = files.filter((f) => validTypes.includes(f.type));
      if (valid.length === 0) return;

      const blobPreviews = valid.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...blobPreviews]);

      try {
        const formData = new FormData();
        valid.forEach((file) => formData.append("files", file));
        formData.append("type", "suco");

        const res = await apiClient.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 200) {
          const serverUrls: string[] = res.data.data;

          setPreviewUrls((prev) => [
            ...prev.filter((url) => !blobPreviews.includes(url)),
            ...serverUrls,
          ]);
          setMediaUrls((prev) => [...prev, ...serverUrls]);
        }
      } catch (error) {
        alert("Upload ảnh thất bại, vui lòng thử lại");
        setPreviewUrls((prev) => prev.filter((url) => !blobPreviews.includes(url)));
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [setMediaUrls]
  );

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  return (
    <div className="cs-page">
      {/* ── Hero panel ────────────────────────── */}
      <aside className="cs-hero">
        <div>
          <h1 className="cs-headline">
            Tạo<br />
            <span className="cs-accent">Phản ánh</span>
          </h1>
          <p className="cs-desc">
            Đóng góp vào việc xây dựng đô thị thông minh và an toàn hơn bằng
            cách báo cáo các sự cố hạ tầng hoặc dân sinh ngay tại đây.
          </p>
          <div className="cs-process-card">
            <div>
              <div className="cs-process-label">QUY TRÌNH</div>
              <p className="cs-process-text">
                Báo cáo của bạn sẽ được gửi trực tiếp liên quan với cơ quan lý
                chuyên trách xử lý trong vòng 24–48 giờ.
              </p>
            </div>
          </div>
        </div>
        <div className="cs-hero-img">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80"
            alt="urban"
          />
        </div>
      </aside>
      <main className="cs-main">
        <form onSubmit={handleSubmit} className="cs-form">

          {/* Step 01 – Nội dung */}
          <section className="cs-section">
            <header className="cs-step-header">
              <span className="cs-step-num">01</span>
              <h2 className="cs-step-title">Tạo phản ánh</h2>
            </header>

            <div className="cs-field">
              <label className="cs-label">NỘI DUNG PHẢN ÁNH</label>
              <textarea
                name="noiDung"
                className={`cs-textarea ${errors.noiDung ? "cs-input-error" : ""}`}
                placeholder="Cung cấp chi tiết về thời gian, địa điểm cụ thể và tình trạng hiện tại..."
                rows={5}
                value={form.noiDung}
                onChange={handleChange}
              />
              {errors.noiDung && <span className="cs-error-msg">{errors.noiDung}</span>}
            </div>
          </section>

          {/* Step 02 – Hình ảnh */}
          <section className="cs-section">
            <header className="cs-step-header">
              <span className="cs-step-num">02</span>
              <h2 className="cs-step-title">Hình ảnh &amp; Minh chứng (Anhsuco)</h2>
            </header>

            <div
              className={`cs-dropzone ${dragOver ? "cs-dz-active" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrls.length === 0 ? (
                <div className="cs-dz-empty">
                  <p className="cs-dz-text">Kéo thả hoặc nhấn để tải lên</p>
                  <p className="cs-dz-hint">Hỗ trợ JPG, PNG, GIF, MP4. Tối đa 10MB.</p>
                </div>
              ) : (
                <div className="cs-preview-grid">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="cs-preview-item">
                      <img
                        src={url.startsWith("blob:") ? url : `${BASE_URL}${url}`}
                        alt={`preview-${i}`}
                      />
                      <button
                        type="button"
                        className="cs-remove-btn"
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="cs-add-more">
                    <span>+ Thêm</span>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,video/mp4"
                style={{ display: "none" }}
                onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
              />
            </div>
          </section>

          {/* Step 03 – Địa điểm */}
          <section className="cs-section">
            <header className="cs-step-header">
              <span className="cs-step-num">03</span>
              <h2 className="cs-step-title">Vị trí sự cố</h2>
            </header>

            <div className="cs-field">
              <label className="cs-label">ĐỊA ĐIỂM</label>
              <div className="cs-location-wrap">
                <div className="cs-input-icon-wrap">
                  <input
                    type="text"
                    className={`cs-input cs-input-pl ${errors.diaDiem ? "cs-input-error" : ""}`}
                    placeholder="Nhập địa chỉ để tìm kiếm..."
                    value={query}
                    onChange={handQueryChange}
                    onBlur={() => setTimeout(clearSuggestions, 150)}
                    autoComplete="off"
                  />
                  {isSerching && <span className="cs-searching">Đang tìm...</span>}
                </div>

                {suggestions.length > 0 && (
                  <ul className="cs-suggestions">
                    {suggestions.map((item) => (
                      <li
                        key={item.place_id}
                        className="cs-suggestion-item"
                        onMouseDown={() => handleSelect(item)}
                      >
                        <span>📍</span>
                        <span className="cs-suggestion-text">{item.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.diaDiem && <span className="cs-error-msg">{errors.diaDiem}</span>}

              {form.kinhDo && form.viDo && (
                <div className="cs-selected-location">
                  <span className="cs-selected-dot" />
                  <div className="cs-selected-address">{form.diaDiem}</div>
                </div>
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="cs-actions">
            <button
              type="button"
              className="cs-btn-cancel"
              onClick={() => window.history.back()}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="cs-btn-submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi phản ánh ▷"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateSuco;
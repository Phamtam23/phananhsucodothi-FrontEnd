import {useParams} from "react-router-dom";
import {useState} from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useUpdateSuCo } from "../../../hooks/suco/useUpdateSuCo";
import apiClient from "../../../services/apiClient";
import "./UpdateSuCoPage.scss";
const UpdateSuCoPage = () =>{
    const maSuCo = useParams<{maSuCo: string}>().maSuCo;
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
 
    if (!maSuCo) {
            return <div>Không tìm thấy mã sự cố</div>;
        }
    const {formUpdate, handleChange, handleSubmit, loading, sucoDetail, setFormUpdate} = useUpdateSuCo(maSuCo);

    const imageUrl = sucoDetail?.mediaUrls && sucoDetail.mediaUrls.length > 0
      ? sucoDetail.mediaUrls[0]
      : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80";

    const addFiles = useCallback(
        async (files: File[]) => {
            const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
            const valid = files.filter((f) => validTypes.includes(f.type));
            if (valid.length === 0) return;

            const blobPreviews = valid.map((f)=> URL.createObjectURL(f));
            setPreviewUrls((prev) => [...prev, ...blobPreviews]);

            try {
                const formData = new FormData();
                valid.forEach((file) => formData.append("files", file));
                formData.append("type","suco");

                const res = await apiClient.post("/files/upload", formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });

                if(res.status === 200) {
                    const serverUrls: string[] = res.data.data;
                    setPreviewUrls ((prev) => [
                        ...prev.filter((url) => !blobPreviews.includes(url)),
                    ])
                    setMediaUrls((prev) => [...prev, ...serverUrls]);
                    setFormUpdate((prev) => ({
                      ...prev,
                      mediaUrls: [...prev.mediaUrls, ...serverUrls],
                    }));
                }
            } catch (error) {
                alert("Upload ảnh thất bại, vui lòng thử lại");
                setPreviewUrls((prev) => prev.filter((url) => !blobPreviews.includes(url)));
            }
                finally {
                    if(fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
        },[setMediaUrls])

    const removeImage = (index: number) => {
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        setMediaUrls((prev) => prev.filter((_, i) => i !== index));
        setFormUpdate((prev) => ({
          ...prev,
          mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
        }));
    }

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(Array.from(e.dataTransfer.files));
        },
        [addFiles]
    );

    if(loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="update-suco-page">
            <h1>Cập nhật phản ánh</h1>
            <div className="update-suco-layout">
              <aside className="update-suco-sidebar">
                <div className="update-suco-card">
                  <div className="update-suco-card__header">Thông tin phản ánh</div>
                  <h2 className="update-suco-card__title">{sucoDetail?.tieuDe || "Tiêu đề phản ánh"}</h2>
                  <p className="update-suco-card__subtitle">
                    Chỉ được phép cập nhật nội dung và ảnh minh chứng. Tiêu đề và địa điểm sẽ không thay đổi.
                  </p>
                  <div className="update-suco-card__meta">
                    <span className="update-suco-card__meta-label">Địa điểm</span>
                    <p className="update-suco-card__meta-value">{sucoDetail?.diaDiem || "Chưa có địa điểm"}</p>
                  </div>
                  <div className="update-suco-card__image-wrap">
                    <img
                      src={imageUrl}
                      alt={sucoDetail?.tieuDe ? `Ảnh minh chứng của ${sucoDetail.tieuDe}` : "Update incident"}
                    />
                  </div>
                </div>
              </aside>
              <section className="update-suco-content">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nội dung:</label>
                        <textarea name="noiDung" value={formUpdate.noiDung} onChange={handleChange} required />
                    </div>
                    <div
                        className={`file-drop-area ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => {e.preventDefault(); setDragOver(true);}}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <p>Kéo thả ảnh/video vào đây hoặc nhấn để chọn</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        ref={fileInputRef}
                        onChange={(e) => addFiles(Array.from(e.target.files || []))}
                    />
                </div>

                <div className="preview-container">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="preview-item">
                            <img src={url} alt={`preview-${index}`} />
                            <button type="button" onClick={() => removeImage(index)}>X</button>
                        </div>
                    ))}
                </div>
                <button type="submit">Cập nhật</button>
             </form>
              </section>
            </div>
        </div>
    );
}
export default UpdateSuCoPage;
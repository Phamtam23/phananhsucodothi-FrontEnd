import { useCallback, useRef, useState } from "react";
import apiClient from "../../services/apiClient";
import { API_CONFIG } from "../../constants/app.constants";
import { usePhieuMoLai } from "../../hooks/phieumolai/usePhieuMoLai";
import "./PhieuMoLaiForm.scss";
type Props = {
    maKetQuaXuLy: string;
    onSuccess?: () => void;
};

const PhieuMoLaiForm = ({maKetQuaXuLy,onSuccess}: Props) => {
    const { loading, error, create  } = usePhieuMoLai();
    const [lyDo, setLyDo] = useState("");

    const [mediaUrls, setMediaUrls] =
        useState<string[]>([]);

    const [previewUrls, setPreviewUrls] =
        useState<string[]>([]);

    const [dragOver, setDragOver] =
        useState(false);

       const fileInputRef =
        useRef<HTMLInputElement>(null);

    const addFiles = useCallback(
        async (files: File[]) => {

            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "video/mp4"
            ];

            const valid = files.filter((f) =>
                validTypes.includes(f.type)
            );

            if (valid.length === 0) return;

            const blobPreviews = valid.map((f) =>
                URL.createObjectURL(f)
            );

            setPreviewUrls((prev) => [
                ...prev,
                ...blobPreviews
            ]);

            try {

                const formData = new FormData();

                valid.forEach((file) =>
                    formData.append("files", file)
                );

                formData.append("type", "molai");

                const res = await apiClient.post(
                    "/files/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                if (res.status === 200) {

                    const serverUrls: string[] =
                        res.data.data;

                    setPreviewUrls((prev) => [
                        ...prev.filter(
                            (url) =>
                                !blobPreviews.includes(url)
                        ),
                        ...serverUrls,
                    ]);

                    setMediaUrls((prev) => [
                        ...prev,
                        ...serverUrls
                    ]);
                }

            } catch (error) {

                alert("Upload thất bại");

                setPreviewUrls((prev) =>
                    prev.filter(
                        (url) =>
                            !blobPreviews.includes(url)
                    )
                );
            }
        },
        []
    );

    const removeMedia = (index: number) => {

        setPreviewUrls((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setMediaUrls((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {

            e.preventDefault();

            setDragOver(false);

            addFiles(
                Array.from(e.dataTransfer.files)
            );
        },
        [addFiles]
    );

    const handleSubmit = async () => {

        if (!lyDo.trim()) {
            alert("Vui lòng nhập lý do");
            return;
        }

        const success = await create({
            maKetQuaXuLy,
            lyDo,
            mediaUrls
        });

        if (success) {

            setLyDo("");
            setMediaUrls([]);
            setPreviewUrls([]);

            onSuccess?.();
        }
    };

    return (
        <div className="phieu-mo-lai">

            <h3 className="pm-title">
                Yêu cầu mở lại xử lý
            </h3>

            <textarea
                className="pm-textarea"
                placeholder="Nhập lý do mở lại..."
                value={lyDo}
                onChange={(e) =>
                    setLyDo(e.target.value)
                }
            />

            <div
                className={`pm-dropzone ${
                    dragOver ? "active" : ""
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() =>
                    setDragOver(false)
                }
                onDrop={handleDrop}
                onClick={() =>
                    fileInputRef.current?.click()
                }
            >

                {previewUrls.length === 0 ? (

                    <div className="pm-empty">
                        Kéo thả hoặc nhấn để tải minh chứng
                    </div>

                ) : (

                    <div className="pm-preview-grid">

                        {previewUrls.map((url, i) => (

                            <div
                                key={i}
                                className="pm-preview-item"
                            >

                                <img
                                    src={
                                        url.startsWith("blob:")
                                            ? url
                                            : `${API_CONFIG.BASE_URL}${url}`
                                    }
                                    alt=""
                                />

                                <button
                                    type="button"
                                    onClick={(e) => {

                                        e.stopPropagation();

                                        removeMedia(i);
                                    }}
                                >
                                    ×
                                </button>

                            </div>
                        ))}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="
                        image/jpeg,
                        image/png,
                        image/gif,
                        video/mp4
                    "
                    style={{ display: "none" }}
                    onChange={(e) =>
                        addFiles(
                            Array.from(
                                e.target.files ?? []
                            )
                        )
                    }
                />
            </div>

            {error && (
                <p className="pm-error">
                    {error}
                </p>
            )}

            <div className="pm-actions">

                <button
                    type="button"
                    className="pm-btn-cancel"
                >
                    Hủy
                </button>

                <button
                    type="button"
                    className="pm-btn-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {
                        loading
                            ? "Đang gửi..."
                            : "Gửi yêu cầu mở lại"
                    }
                </button>

            </div>
        </div>
    );
};

export default PhieuMoLaiForm;
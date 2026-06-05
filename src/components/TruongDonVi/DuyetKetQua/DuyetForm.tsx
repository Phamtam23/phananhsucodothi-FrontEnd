interface Props {
    maKetQua: string;
    lyDo: string;
    setLyDo: (v: string) => void;
    dangXuLy: boolean;
    onDuyet: (ma: string) => void;
    onTuChoi: (ma: string) => void;
}

const DuyetForm = ({ maKetQua, lyDo, setLyDo, dangXuLy, onDuyet, onTuChoi }: Props) => (
    <div className="duyet-form">
        <div className ="duyet-form-group">
        <label className="duyet-form-label">GHI CHÚ PHÊ DUYỆT</label>
            <textarea
                className="duyet-form-textarea"
                placeholder="Nhập nhận xét hoặc chỉ đạo phê duyệt..."
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                disabled={dangXuLy}
                rows={3}
            />
        </div>
          <div className="duyet-form-actions">
            <button
                className="btn-approve"
                disabled={dangXuLy}
                onClick={() => onDuyet(maKetQua)}
            >
                {dangXuLy ? "Đang xử lý..." : "DUYỆT KẾT QUẢ"}
            </button>
            <button
                className="btn-reject"
                disabled={dangXuLy}
                onClick={() => onTuChoi(maKetQua)}
            >
                YÊU CẦU LÀM LẠI
            </button>
        </div>
    </div>
)

export default DuyetForm;
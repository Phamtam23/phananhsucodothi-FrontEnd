import { useEffect, useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { useLoaiSuCo } from "../../hooks/admin/useLoaiSuCo";
import type { LoaiRequest, LoaiResponse } from "../../types/Loai";
import "./QuanLyLoaiSuCoPage.scss";
import "../admin/QuanLyTaiKhoanPage.scss"; // dùng lại slide-panel

const FORM_TRONG: LoaiRequest = { maLoai: "", tenLoaiSuCo: "" };

const QuanLyLoaiSuCoPage = () => {
  const { danhSach, loading, layDanhSach, themLoai, capNhatLoai } = useLoaiSuCo();
  const [moPanel, setMoPanel] = useState(false);
  const [dangSua, setDangSua] = useState<LoaiResponse | null>(null);
  const [form, setForm] = useState<LoaiRequest>(FORM_TRONG);

  useEffect(() => { layDanhSach(); }, [layDanhSach]);

  const moThem = () => { setDangSua(null); setForm(FORM_TRONG); setMoPanel(true); };
  const moSua = (l: LoaiResponse) => { setDangSua(l); setForm({ maLoai: l.maLoai, tenLoaiSuCo: l.tenLoaiSuCo }); setMoPanel(true); };
  const dong = () => { setMoPanel(false); setDangSua(null); };

  const luuForm = async () => {
    try {
      if (dangSua) await capNhatLoai(form);
      else await themLoai(form);
      dong();
    } catch {}
  };

  return (
    <div className="quan-ly-loai">
      <div className="quan-ly-loai__tieu-de">
        <div>
          <h1>Quản lý loại sự cố</h1>
          <p>{danhSach.length} loại sự cố đang hoạt động</p>
        </div>
        <button className="quan-ly-loai__btn-them" onClick={moThem}>
          <Plus size={16} /> Thêm loại
        </button>
      </div>

      {loading && <div style={{ textAlign: "center", padding: 48, color: "#64748b", fontFamily: "Inter, sans-serif" }}>Đang tải...</div>}

      {!loading && danhSach.length === 0 && (
        <div className="quan-ly-loai__trong">Chưa có loại sự cố nào. Hãy thêm mới!</div>
      )}

      <div className="quan-ly-loai__luoi">
        {danhSach.map(l => (
          <div className="quan-ly-loai__the" key={l.maLoai}>
            <div className="quan-ly-loai__the-noi-dung">
              <span className="quan-ly-loai__the-ma">{l.maLoai}</span>
              <div className="quan-ly-loai__the-ten">{l.tenLoaiSuCo}</div>
            </div>
            <div className="quan-ly-loai__the-hanh-dong">
              <button className="quan-ly-loai__btn-sua" onClick={() => moSua(l)}>
                <Pencil size={13} /> Sửa
              </button>
            </div>
          </div>
        ))}
      </div>

      {moPanel && (
        <>
          <div className="slide-panel-overlay" onClick={dong} />
          <div className="slide-panel">
            <div className="slide-panel__header">
              <h2>{dangSua ? "Cập nhật loại sự cố" : "Thêm loại sự cố mới"}</h2>
              <button className="slide-panel__btn-dong" onClick={dong}><X size={18} /></button>
            </div>
            <div className="slide-panel__body">
              <div className="slide-panel__nhom">
                <label>Mã loại *</label>
                <input
                  placeholder="VD: LOI_NUOC"
                  value={form.maLoai}
                  disabled={!!dangSua}
                  onChange={e => setForm(f => ({ ...f, maLoai: e.target.value }))}
                />
              </div>
              <div className="slide-panel__nhom">
                <label>Tên loại sự cố *</label>
                <input
                  placeholder="VD: Sự cố đường ống nước"
                  value={form.tenLoaiSuCo}
                  onChange={e => setForm(f => ({ ...f, tenLoaiSuCo: e.target.value }))}
                />
              </div>
            </div>
            <div className="slide-panel__footer">
              <button className="slide-panel__btn-huy" onClick={dong}>Hủy</button>
              <button className="slide-panel__btn-luu" onClick={luuForm}>{dangSua ? "Lưu thay đổi" : "Thêm mới"}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuanLyLoaiSuCoPage;

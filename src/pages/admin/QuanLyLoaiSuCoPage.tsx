import { useEffect, useState } from "react";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import { useLoaiSuCo } from "../../hooks/admin/useLoaiSuCo";
import type { LoaiRequest, LoaiResponse } from "../../types/Loai";
import "./QuanLyLoaiSuCoPage.scss";
import "../admin/QuanLyTaiKhoanPage.scss"; // dùng lại slide-panel

const FORM_TRONG: LoaiRequest = { maLoai: "", tenLoaiSuCo: "" };

const QuanLyLoaiSuCoPage = () => {
  const { danhSach, loading, layDanhSach, themLoai, capNhatLoai, xoaLoai } = useLoaiSuCo();
  const [moPanel, setMoPanel] = useState(false);
  const [dangSua, setDangSua] = useState<LoaiResponse | null>(null);
  const [form, setForm] = useState<LoaiRequest>(FORM_TRONG);
  const [tuKhoa, setTuKhoa] = useState("");

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

  const danhSachHienThi = danhSach.filter(l => 
    l.tenLoaiSuCo.toLowerCase().includes(tuKhoa.toLowerCase()) ||
    l.maLoai.toLowerCase().includes(tuKhoa.toLowerCase())
  );

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

      <div className="quan-ly-loai__bo-loc">
        <input 
          placeholder="Tìm kiếm loại sự cố..." 
          value={tuKhoa} 
          onChange={e => setTuKhoa(e.target.value)} 
        />
      </div>

      <div className="quan-ly-loai__bang">
        <table className="quan-ly-loai__bang-table">
          <thead>
            <tr>
              <th>Tên loại sự cố</th>
              <th style={{ width: "200px", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={2} className="quan-ly-loai__trong">Đang tải...</td>
              </tr>
            )}
            {!loading && danhSachHienThi.length === 0 && (
              <tr>
                <td colSpan={2} className="quan-ly-loai__trong">
                  {danhSach.length === 0 ? "Chưa có loại sự cố nào. Hãy thêm mới!" : "Không tìm thấy loại sự cố nào phù hợp"}
                </td>
              </tr>
            )}
            {!loading && danhSachHienThi.map(l => (
              <tr key={l.maLoai}>
                <td>
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>{l.tenLoaiSuCo}</strong>
                </td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                    <button className="quan-ly-loai__btn-sua" onClick={() => moSua(l)}>
                      <Pencil size={13} /> Sửa
                    </button>
                    <button 
                      className="quan-ly-loai__btn-xoa" 
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa loại sự cố "${l.tenLoaiSuCo}"?`)) {
                          xoaLoai(l.maLoai);
                        }
                      }}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

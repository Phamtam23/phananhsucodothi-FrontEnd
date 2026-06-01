import { useEffect, useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { useDonViTiepNhan } from "../../hooks/admin/useDonViTiepNhan";
import type { DonViXuLyResponse, CreateDonViXuLyRequest, UpdateDonViXuLyRequest } from "../../types/DonViXuLy";
import { TrangThaiDonVi } from "../../types/DonViXuLy";
import "./QuanLyDonViPage.scss";
import "../admin/QuanLyTaiKhoanPage.scss"; // dùng lại slide-panel

const FORM_TRONG: CreateDonViXuLyRequest = { tenDonVi: "", khuVuc: "", moTa: "", diaChi: "", sdt: "", email: "" };

const QuanLyDonViPage = () => {
  const { danhSach, loading, layDanhSach, themDonVi, capNhatDonVi } = useDonViTiepNhan();
  const [moPanel, setMoPanel] = useState(false);
  const [dangSua, setDangSua] = useState<DonViXuLyResponse | null>(null);
  const [form, setForm] = useState<CreateDonViXuLyRequest>(FORM_TRONG);

  useEffect(() => { layDanhSach(); }, [layDanhSach]);

  const moThem = () => { setDangSua(null); setForm(FORM_TRONG); setMoPanel(true); };
  const moSua = (dv: DonViXuLyResponse) => {
    setDangSua(dv);
    setForm({ tenDonVi: dv.tenDonVi, khuVuc: dv.khuVuc, moTa: dv.moTa, diaChi: dv.diaChi, sdt: dv.sdt, email: dv.email });
    setMoPanel(true);
  };
  const dong = () => { setMoPanel(false); setDangSua(null); };

  const luuForm = async () => {
    try {
      if (dangSua) {
        const req: UpdateDonViXuLyRequest = { ...form };
        await capNhatDonVi(dangSua.maDonViXuLy, req);
      } else {
        await themDonVi(form);
      }
      dong();
    } catch {}
  };

  return (
    <div className="quan-ly-don-vi">
      <div className="quan-ly-don-vi__tieu-de">
        <div>
          <h1>Quản lý đơn vị tiếp nhận</h1>
          <p>{danhSach.length} đơn vị đang hoạt động</p>
        </div>
        <button className="quan-ly-don-vi__btn-them" onClick={moThem}>
          <Plus size={16} /> Thêm đơn vị
        </button>
      </div>

      <div className="quan-ly-don-vi__bang">
        <table className="quan-ly-don-vi__bang-table">
          <thead>
            <tr>
              <th>Tên đơn vị</th>
              <th>Khu vực</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="quan-ly-don-vi__trong">Đang tải...</td></tr>}
            {!loading && danhSach.length === 0 && (
              <tr><td colSpan={7} className="quan-ly-don-vi__trong">Chưa có đơn vị nào</td></tr>
            )}
            {danhSach.map(dv => (
              <tr key={dv.maDonViXuLy}>
                <td><strong>{dv.tenDonVi}</strong></td>
                <td>{dv.khuVuc || "—"}</td>
                <td>{dv.diaChi || "—"}</td>
                <td>{dv.sdt || "—"}</td>
                <td>{dv.email || "—"}</td>
                <td>
                  {dv.trangThai === TrangThaiDonVi.HOAT_DONG
                    ? <span className="quan-ly-don-vi__trang-thai-hoat-dong">Hoạt động</span>
                    : <span className="quan-ly-don-vi__trang-thai-ngung">Tạm ngưng</span>
                  }
                </td>
                <td>
                  <div className="quan-ly-don-vi__hanh-dong">
                    <button className="quan-ly-don-vi__btn-sua" onClick={() => moSua(dv)}>
                      <Pencil size={13} /> Sửa
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
              <h2>{dangSua ? "Cập nhật đơn vị" : "Thêm đơn vị mới"}</h2>
              <button className="slide-panel__btn-dong" onClick={dong}><X size={18} /></button>
            </div>
            <div className="slide-panel__body">
              {[
                { label: "Tên đơn vị *", key: "tenDonVi", placeholder: "Tên đơn vị tiếp nhận" },
                { label: "Khu vực", key: "khuVuc", placeholder: "Quận/Huyện..." },
                { label: "Địa chỉ", key: "diaChi", placeholder: "Địa chỉ trụ sở..." },
                { label: "Số điện thoại", key: "sdt", placeholder: "0xxxxxxxxx" },
                { label: "Email", key: "email", placeholder: "donvi@example.com" },
                { label: "Mô tả", key: "moTa", placeholder: "Mô tả thêm..." },
              ].map(field => (
                <div className="slide-panel__nhom" key={field.key}>
                  <label>{field.label}</label>
                  <input
                    placeholder={field.placeholder}
                    value={(form as any)[field.key] || ""}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
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

export default QuanLyDonViPage;

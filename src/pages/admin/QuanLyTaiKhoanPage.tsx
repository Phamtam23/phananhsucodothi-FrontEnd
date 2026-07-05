import { useState } from "react";
import { Plus, Pencil, Lock, Unlock, X } from "lucide-react";
import { useTaiKhoan } from "../../hooks/admin/useTaiKhoan";
import type { CreateTaiKhoanRequest, UpdateTaiKhoanRequest, TaiKhoanResponse } from "../../types/TaiKhoan";
import { VaiTro, TrangThaiTaiKhoan } from "../../types/TaiKhoan";
import "./QuanLyTaiKhoanPage.scss";

const FORM_TRONG: CreateTaiKhoanRequest = {
  email: "", matKhau: "", hoTen: "", soDienThoai: "", cccd: "", diaChi: "", vaiTro: VaiTro.NGUOI_DAN, maDonVi: ""
};

const canChonDonVi = (vaiTro: string) =>
  vaiTro === VaiTro.NHAN_VIEN_XU_LY || vaiTro === VaiTro.TRUONG_DON_VI;

const QuanLyTaiKhoanPage = () => {
  const { danhSach, loading, danhSachDonViXuLy, loadingDonVi, taoTaiKhoan, capNhatTaiKhoan, khoaTaiKhoan, moKhoaTaiKhoan } = useTaiKhoan();
  const [moPanel, setMoPanel] = useState(false);
  const [dangSua, setDangSua] = useState<TaiKhoanResponse | null>(null);
  const [form, setForm] = useState<CreateTaiKhoanRequest>(FORM_TRONG);
  const [tuKhoa, setTuKhoa] = useState("");;
  const [locVaiTro, setLocVaiTro] = useState("TẤT_CẢ");

  const moThem = () => { setDangSua(null); setForm(FORM_TRONG); setMoPanel(true); };
  const moSua = (tk: TaiKhoanResponse) => {
    setDangSua(tk);
    setForm({ email: tk.email, matKhau: "", hoTen: tk.hoTen, soDienThoai: tk.soDienThoai, cccd: tk.cccd, diaChi: tk.diaChi || "", vaiTro: tk.vaiTro, maDonVi: "" });
    setMoPanel(true);
  };
const dong = () => { setMoPanel(false); setDangSua(null); setForm(FORM_TRONG); }

  const luuForm = async () => {
    try {
      if (dangSua) {
        const req: UpdateTaiKhoanRequest = { hoTen: form.hoTen, soDienThoai: form.soDienThoai, diaChi: form.diaChi, vaiTro: form.vaiTro, maDonVi: form.maDonVi };
        await capNhatTaiKhoan(dangSua.maTaiKhoan, req);
      } else {
        await taoTaiKhoan(form);
      }
      dong();
    } catch {}
  };

  const danhSachHienThi = danhSach
    .filter(tk => locVaiTro === "TẤT_CẢ" || tk.vaiTro === locVaiTro)
    .filter(tk => tk.hoTen.toLowerCase().includes(tuKhoa.toLowerCase()) || tk.email.toLowerCase().includes(tuKhoa.toLowerCase()));

  return (
    <div className="quan-ly-tai-khoan">
      {/* Tiêu đề */}
      <div className="quan-ly-tai-khoan__tieu-de">
        <div>
          <h1>Quản lý tài khoản</h1>
          <p>Tổng {danhSach.length} tài khoản trong hệ thống</p>
        </div>
        <button className="quan-ly-tai-khoan__btn-them" onClick={moThem}>
          <Plus size={16} /> Thêm tài khoản
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="quan-ly-tai-khoan__bo-loc">
        <input placeholder="Tìm kiếm tên, email..." value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
        <select value={locVaiTro} onChange={e => setLocVaiTro(e.target.value)}>
          <option value="TẤT_CẢ">Tất cả vai trò</option>
          {Object.values(VaiTro).map(v => <option key={v} value={v}>{v.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Bảng */}
      <div className="quan-ly-tai-khoan__bang">
        <table className="quan-ly-tai-khoan__bang-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="quan-ly-tai-khoan__trong">Đang tải...</td></tr>
            )}
            {!loading && danhSachHienThi.length === 0 && (
              <tr><td colSpan={6} className="quan-ly-tai-khoan__trong">Không có tài khoản nào</td></tr>
            )}
            {danhSachHienThi.map(tk => (
              <tr key={tk.maTaiKhoan}>
                <td><strong>{tk.hoTen}</strong></td>
                <td>{tk.email}</td>
                <td><span className="quan-ly-tai-khoan__vai-tro">{tk.vaiTro.replace(/_/g, " ")}</span></td>
                <td>{tk.soDienThoai}</td>
                <td>
                  {tk.trangThai === TrangThaiTaiKhoan.HOAT_DONG
                    ? <span className="quan-ly-tai-khoan__trang-thai-hoat-dong">Hoạt động</span>
                    : <span className="quan-ly-tai-khoan__trang-thai-bi-khoa">Bị khóa</span>
                  }
                </td>
                <td>
                  <div className="quan-ly-tai-khoan__hanh-dong">
                    <button className="quan-ly-tai-khoan__btn-sua" onClick={() => moSua(tk)}>
                      <Pencil size={13} /> Sửa
                    </button>
                    {tk.trangThai === TrangThaiTaiKhoan.HOAT_DONG
                      ? <button className="quan-ly-tai-khoan__btn-khoa" onClick={() => khoaTaiKhoan(tk.maTaiKhoan)}><Lock size={13} /> Khóa</button>
                      : <button className="quan-ly-tai-khoan__btn-mo-khoa" onClick={() => moKhoaTaiKhoan(tk.maTaiKhoan)}><Unlock size={13} /> Mở khóa</button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide Panel */}
      {moPanel && (
        <>
          <div className="slide-panel-overlay" onClick={dong} />
          <div className="slide-panel">
            <div className="slide-panel__header">
              <h2>{dangSua ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}</h2>
              <button className="slide-panel__btn-dong" onClick={dong}><X size={18} /></button>
            </div>

            <div className="slide-panel__body">
              {/* Chỉ hiện khi thêm mới */}
              {!dangSua && (
                <>
                  <div className="slide-panel__nhom">
                    <label>Email *</label>
                    <input type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="slide-panel__nhom">
                    <label>Mật khẩu *</label>
                    <input type="password" placeholder="Nhập mật khẩu" value={form.matKhau} onChange={e => setForm(f => ({ ...f, matKhau: e.target.value }))} />
                  </div>
                  <div className="slide-panel__nhom">
                    <label>CCCD *</label>
                    <input placeholder="Số CCCD" value={form.cccd} onChange={e => setForm(f => ({ ...f, cccd: e.target.value }))} />
                  </div>
                </>
              )}

              <div className="slide-panel__nhom">
                <label>Họ tên *</label>
                <input placeholder="Nguyễn Văn A" value={form.hoTen} onChange={e => setForm(f => ({ ...f, hoTen: e.target.value }))} />
              </div>
              <div className="slide-panel__nhom">
                <label>Số điện thoại</label>
                <input placeholder="0xxxxxxxxx" value={form.soDienThoai} onChange={e => setForm(f => ({ ...f, soDienThoai: e.target.value }))} />
              </div>
              <div className="slide-panel__nhom">
                <label>Địa chỉ</label>
                <input placeholder="Địa chỉ..." value={form.diaChi} onChange={e => setForm(f => ({ ...f, diaChi: e.target.value }))} />
              </div>

              <div className="slide-panel__nhom">
                <label>Vai trò *</label>
                <select value={form.vaiTro} onChange={e => setForm(f => ({ ...f, vaiTro: e.target.value, maDonVi: "" }))}>
                  {Object.values(VaiTro).map(v => <option key={v} value={v}>{v.replace(/_/g, " ")}</option>)}
                </select>
              </div>

              {/* Hiện khi chọn vai trò nhân viên hoặc trưởng đơn vị */}
              {canChonDonVi(form.vaiTro) && (
                <div className="slide-panel__nhom">
                  <label>Đơn vị xử lý *</label>
                  <select value={form.maDonVi} onChange={e => setForm(f => ({ ...f, maDonVi: e.target.value }))}>
                    <option value="">-- Chọn đơn vị --</option>
                    {danhSachDonViXuLy.map(dv => (
                      <option key={dv.maDonViXuLy} value={dv.maDonViXuLy}>{dv.tenDonVi}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="slide-panel__footer">
              <button className="slide-panel__btn-huy" onClick={dong}>Hủy</button>
              <button className="slide-panel__btn-luu" onClick={luuForm}>{dangSua ? "Lưu thay đổi" : "Tạo tài khoản"}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuanLyTaiKhoanPage;
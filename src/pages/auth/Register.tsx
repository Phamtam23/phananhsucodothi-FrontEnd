import { useRegister } from "../../hooks/auth/useRegister";
import { Link } from "react-router-dom";
import "./Auth.scss";

const Register = () => {
  const {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useRegister();

  return (
    <div className="auth">
      <div className="auth-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h1>Urban Pulse Civic</h1>
        <p>Hệ thống quản lý đô thị thông minh</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Đăng ký tài khoản</h2>

        <div className="form-row">
          <div className="form-group">
            <div className="label-row"><label>Họ tên</label></div>
            <input name="hoTen" placeholder="Nguyễn Văn A" value={form.hoTen} onChange={handleChange} />
            <p className="error">{errors.hoTen}</p>
          </div>
          <div className="form-group">
            <div className="label-row"><label>Số điện thoại</label></div>
            <input name="soDienThoai" placeholder="0987654321" value={form.soDienThoai} onChange={handleChange} />
            <p className="error">{errors.soDienThoai}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="label-row"><label>CCCD/CMND</label></div>
            <input name="cccd" placeholder="012345678912" value={form.cccd} onChange={handleChange} />
            <p className="error">{errors.cccd}</p>
          </div>
          <div className="form-group">
            <div className="label-row"><label>Email</label></div>
            <input type="email" name="email" placeholder="nguoidan@gmail.com" value={form.email} onChange={handleChange} />
            <p className="error">{errors.email}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="label-row"><label>Mật khẩu</label></div>
            <input type="password" name="matKhau" placeholder="••••••••" value={form.matKhau} onChange={handleChange} />
            <p className="error">{errors.matKhau}</p>
          </div>
          <div className="form-group">
            <div className="label-row"><label>Nhập lại mật khẩu</label></div>
            <input type="password" name="nhapLaiMatKhau" placeholder="••••••••" value={form.nhapLaiMatKhau} onChange={handleChange} />
            <p className="error">{errors.nhapLaiMatKhau}</p>
          </div>
        </div>

        <div className="form-group">
          <div className="label-row"><label>Địa chỉ</label></div>
          <input name="diaChi" placeholder="Nhập địa chỉ của bạn" value={form.diaChi} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: "12px" }}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <div className="divider">Hoặc</div>

        <div className="register-link">
          Đã có tài khoản? <Link to="/auth/login">Đăng nhập ngay</Link>
        </div>
      </form>

      <div className="auth-footer">
        © 2024 URBAN PULSE CIVIC • BẢO MẬT & AN TOÀN
      </div>
    </div>
  );
};

export default Register;
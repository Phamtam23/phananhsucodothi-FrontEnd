import { useRegister } from "../../hooks/auth/useRegister";
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
    <div className="auth-container">
      <h2>Đăng ký</h2>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <p className="error">{errors.email}</p>
        </div>

        {/* Mật khẩu */}
        <div>
          <input
            type="password"
            name="matKhau"
            placeholder="Mật khẩu"
            value={form.matKhau}
            onChange={handleChange}
          />
          <p className="error">{errors.matKhau}</p>
        </div>

        {/* Nhập lại mật khẩu */}
        <div>
          <input
            type="password"
            name="nhapLaiMatKhau"
            placeholder="Nhập lại mật khẩu"
            value={form.nhapLaiMatKhau}
            onChange={handleChange}
          />
          <p className="error">{errors.nhapLaiMatKhau}</p>
        </div>

        {/* Họ tên */}
        <div>
          <input
            name="hoTen"
            placeholder="Họ tên"
            value={form.hoTen}
            onChange={handleChange}
          />
          <p className="error">{errors.hoTen}</p>
        </div>

        {/* SĐT */}
        <div>
          <input
            name="soDienThoai"
            placeholder="Số điện thoại"
            value={form.soDienThoai}
            onChange={handleChange}
          />
          <p className="error">{errors.soDienThoai}</p>
        </div>

        {/* CCCD */}
        <div>
          <input
            name="cccd"
            placeholder="CCCD"
            value={form.cccd}
            onChange={handleChange}
          />
          <p className="error">{errors.cccd}</p>
        </div>

        {/* Địa chỉ */}
        <div>
          <input
            name="diaChi"
            placeholder="Địa chỉ"
            value={form.diaChi}
            onChange={handleChange}
          />
        </div>

        {/* Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;
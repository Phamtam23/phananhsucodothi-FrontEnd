import { useLogin } from "../../hooks/auth/useLogin";
import { Link } from "react-router-dom";
import "./Auth.scss";

const Login = () => {
  const {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useLogin();

  return (
    <div className="auth">
      <div className="auth-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h1>PAS</h1>
        <p>Hệ thống quản lý đô thị thông minh</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Đăng nhập hệ thống</h2>

        <div className="form-group">
          <div className="label-row">
            <label>Email</label>
          </div>
          <input
            type="email"
            name="email"
            placeholder="nguoidan@gmail.com"
            value={form.email}
            onChange={handleChange}
          />
          <p className="error">{errors.email}</p>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label>Mật khẩu</label>
            <Link to="/auth/forgot" className="forgot-password">Quên mật khẩu?</Link>
          </div>
          <input
            type="password"
            name="matKhau"
            placeholder="••••••••"
            value={form.matKhau}
            onChange={handleChange}
          />
          <p className="error">{errors.matKhau}</p>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Ghi nhớ đăng nhập</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="divider">Hoặc tiếp tục với</div>
        <div className="register-link">
          Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay</Link>
        </div>
      </form>

      <div className="auth-footer">
        © 2024 PASC • BẢO MẬT & AN TOÀN
      </div>
    </div>
  );
};

export default Login;
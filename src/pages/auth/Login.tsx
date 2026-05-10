import { useLogin } from "../../hooks/auth/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useLogin();

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <p className="error">{errors.email}</p>
        </div>

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

        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p>
        Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default Login;
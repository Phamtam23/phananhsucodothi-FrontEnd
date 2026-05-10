import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterService } from "../../services/AuthService";

export const useRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    matKhau: '',
    nhapLaiMatKhau: '',
    hoTen: '',
    soDienThoai: '',
    cccd: '',
    diaChi: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.email) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.matKhau) newErrors.matKhau = "Mật khẩu không được để trống";
    else if (form.matKhau.length < 6)
      newErrors.matKhau = "Mật khẩu tối thiểu 6 ký tự";

    if (form.nhapLaiMatKhau !== form.matKhau)
      newErrors.nhapLaiMatKhau = "Mật khẩu không khớp";

    if (!form.hoTen) newErrors.hoTen = "Họ tên không được để trống";

    if (!form.soDienThoai)
      newErrors.soDienThoai = "SĐT không được để trống";

    if (!form.cccd) newErrors.cccd = "CCCD không được để trống";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await RegisterService(form);

      if (response.status === 200) {
        alert("Đăng ký thành công");
        navigate("/auth/login");
      } else {
        alert("Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Register failed", error);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
};
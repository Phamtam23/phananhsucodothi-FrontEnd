import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginService } from "../../services/AuthService";
export const useLogin = () => {

    const navigate = useNavigate();
     const [form, setForm] = useState({
        email: '',
        matKhau: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

        setErrors((prev: any) => ({
        ...prev,
        [e.target.name]: ''
        }));
    };


    const validate = () => {
    const newErrors: any = {};

    if (!form.email) newErrors.email = "Email không được để trống";
    if (!form.matKhau) newErrors.matKhau = "Mật khẩu không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            const response = await LoginService(form);
            if (response.status !== 200) {
                alert("Đăng nhập thất bại");
                return;
            }
             const user = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", user.accessToken);

            // Check role exact field from backend
            const role = user.role || '';
            
            if (role === 'R_Admin') {
                navigate("/admin/thong-ke");
            } else if (role === 'R_DIEUPHOI') {
                navigate("/nhanvien/kiem-duyet");
            } else if (role === 'R_TXULY') {
                navigate("/truongdonvi/xac-minh");
            } else if (role === 'R_NVXULY') {
                navigate("/nhanvienxuly/xu-ly");
            } else {
                navigate("/");
            }
        } catch (error) {
             console.error("Login failed", error);
             alert("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    }
    return {
        form,
        errors,
        loading,
        handleChange,
        handleSubmit
    };
}
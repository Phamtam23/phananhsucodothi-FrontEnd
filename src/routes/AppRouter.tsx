import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import UserLayout  from '../layouts/UserLayout';
import  NhanVienDieuPhoiLayout from '../layouts/NhanVienDieuPhoiLayout';
import CreateSuco from '../pages/nguoidung/suco/CreateSucoPage';
import LichSuSuCo from '../pages/nguoidung/suco/LichSuSuCoPage';
import DetailSuCoPage from "../pages/nguoidung/suco/DetailSucoPage"
import KiemDuyetDetailPage from '../pages/nhanvien/nhanviendieuphoi/KiemDuyetDetailPage';
import KiemDuyetPage from '../pages/nhanvien/nhanviendieuphoi/KiemDuyetPage';
import PhanCongPhanLoaiPage from '../pages/nhanvien/nhanviendieuphoi/PhanCongPhanLoaiPage';
import PhanCongPhanLoaiDetail from '../pages/nhanvien/nhanviendieuphoi/PhanCongPhanLoaiDetail';
export const AppRouter = () => {

    return (
        <Routes>
            <Route element = {<UserLayout />} >
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/suco/create" element={<CreateSuco />} />
              <Route path="/suco/lich-su" element={<LichSuSuCo />} />
              <Route path="/suco/detail/:maSuCo" element={<DetailSuCoPage />} />
            </Route>
            <Route element = {<NhanVienDieuPhoiLayout />} >
                <Route path="/nhanvien/kiem-duyet" element={<KiemDuyetPage />} />
                <Route path="/nhanvien/kiem-duyet/:maSuCo" element={<KiemDuyetDetailPage />} />
                <Route path="/nhanvien/phan-cong/phan-loai" element={<PhanCongPhanLoaiPage />} />
                <Route path="/nhanvien/phan-cong/:maSuCo" element={<PhanCongPhanLoaiDetail />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}
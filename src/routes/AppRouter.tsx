import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import UserLayout from '../layouts/UserLayout';
import NhanVienDieuPhoiLayout from '../layouts/NhanVienDieuPhoiLayout';
import CreateSuco from '../pages/nguoidung/suco/CreateSucoPage';
import LichSuSuCo from '../pages/nguoidung/suco/LichSuSuCoPage';
import DetailSuCoPage from "../pages/nguoidung/suco/DetailSucoPage"
import KiemDuyetDetailPage from '../pages/nhanviendieuphoi/KiemDuyetDetailPage';
import KiemDuyetPage from '../pages/nhanviendieuphoi/KiemDuyetPage';
import PhanCongPhanLoaiPage from '../pages/nhanviendieuphoi/PhanCongPhanLoaiPage';
import PhanCongPhanLoaiDetail from '../pages/nhanviendieuphoi/PhanCongPhanLoaiDetail';
import ThongBaoPage from '../components/Page/ThongBaoPage';
import TruongDonViLayout from '../layouts/TruongDonViLayout';
import XacMinhPhanAnhPage from '../pages/truongdonvi/XacMinhPhanAnhPage';
import PhanCongNhanSuPage from '../pages/truongdonvi/PhanCongNhanSuPage';
import DuyetKetQuaDetailPageWrapper from '../pages/truongdonvi/DuyetKetQuaDetailPageWrapper';
import NhanVienXuLyLayout from '../layouts/NhanVienXuLyLayout';
import XuLySuCoPage from '../pages/nhanvienxuly/XuLySuCoPage';
import DangKetQuaPage from '../pages/nhanvienxuly/DangKetQuaPage';
import LichSuThucHienPage from '../pages/nhanvienxuly/LichSuThucHienPage';
import AdminLayout from '../layouts/AdminLayout';
import QuanLyTaiKhoanPage from '../pages/admin/QuanLyTaiKhoanPage';
import QuanLyLoaiSuCoPage from '../pages/admin/QuanLyLoaiSuCoPage';
import QuanLyDonViPage from '../pages/admin/QuanLyDonViPage';
import ThongKeHeThongPage from '../pages/admin/ThongKeHeThongPage';
import PhanAnhCongDongPage from '../pages/nguoidung/suco/PhanAnhCongDongPage';
import BanDoPage from '../pages/nguoidung/suco/BanDoPage';
import DanhSachSuCo from '../pages/nguoidung/suco/DanhSachSuco';
import Profile from '../pages/auth/Profile';
import LichSuPage from '../pages/nhanviendieuphoi/LichSuPage';
import ThongKeDonViPage from '../pages/truongdonvi/ThongKeDonViPage';
import DuyetMoLaiDetailPage from '../pages/truongdonvi/DuyetMoLaiDetailPage';
import XemChiTieSuCoPage from '../pages/nhanvienxuly/XemChiTieSuCoPage';
import BanDoDieuPhoiPage from '../pages/nhanviendieuphoi/BanDoDieuPhoiPage';
import BanDoTruongDonViPage from '../pages/truongdonvi/BanDoTruongDonViPage';
import UpdateSuCoPage from '../pages/nguoidung/suco/UpdateSuCoPage';
export const AppRouter = () => {

    return (
        <Routes>
            <Route element={<UserLayout />} >
                <Route path="/" element={<PhanAnhCongDongPage />} />
                <Route path="/ban-do" element={<BanDoPage />} />
                <Route path="/danh-sach-phan-anh" element={<DanhSachSuCo />} />
                <Route path="/suco/create" element={<CreateSuco />} />
                <Route path="/suco/lich-su" element={<LichSuSuCo />} />
                <Route path="/suco/detail/:maSuCo" element={<DetailSuCoPage />} />
                <Route path="/suco/update/:maSuCo" element={<UpdateSuCoPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/thong-bao" element={<ThongBaoPage />} />
            </Route>
            <Route element={<NhanVienDieuPhoiLayout />} >
                <Route path="/nhanvien/kiem-duyet" element={<KiemDuyetPage />} />
                <Route path="/nhanvien/ban-do" element={<BanDoDieuPhoiPage />} />
                <Route path="/nhanvien/kiem-duyet/:maSuCo" element={<KiemDuyetDetailPage />} />
                <Route path="/nhanvien/phan-cong/phan-loai" element={<PhanCongPhanLoaiPage />} />
                <Route path="/nhanvien/phan-cong/:maSuCo" element={<PhanCongPhanLoaiDetail />} />
                <Route path="/nhanvien/lich-su/kiem-duyet" element={<LichSuPage />} />
                <Route path="/nhanvien/profile" element={<Profile />} />
                <Route path="/nhanvien/thong-bao" element={<ThongBaoPage />} />
            </Route>
            <Route element={<TruongDonViLayout />}>
                <Route path="/truongdonvi/xac-minh" element={<XacMinhPhanAnhPage />} />
                <Route path="/truongdonvi/ban-do" element={<BanDoTruongDonViPage />} />
                <Route path="/truongdonvi/phan-cong/:id" element={<PhanCongNhanSuPage />} />
                <Route path="/truongdonvi/duyet-ket-qua/:id" element={<DuyetKetQuaDetailPageWrapper />} />
                <Route path="/truongdonvi/profile" element={<Profile />} />
                <Route path="/truongdonvi/thong-bao" element={<ThongBaoPage />} />
                <Route path="/truongdonvi/thong-ke" element={<ThongKeDonViPage />} />
                <Route path="/truongdonvi/duyet-mo-lai/:maPhieuMoLai" element={<DuyetMoLaiDetailPage />} />
               <Route path="/truongdonvi/ban-do" element={<BanDoTruongDonViPage />} />
            </Route>
            <Route element={<NhanVienXuLyLayout />}>
                <Route path="/nhanvienxuly/xu-ly" element={<XuLySuCoPage />} />
                <Route path="/nhanvienxuly/chi-dao" element={<XuLySuCoPage />} />
                <Route path="/nhanvienxuly/dang-ket-qua" element={<DangKetQuaPage />} />
                <Route path="/nhanvienxuly/lich-su" element={<LichSuThucHienPage />} />
                <Route path="/nhanvienxuly/profile" element={<Profile />} />
                <Route path="/nhanvienxuly/thong-bao" element={<ThongBaoPage />} />
                 <Route path="/nhanvienxuly/chi-tiet/:maPhieuPhanCong/:maChiTietPhanCong/:loai" element={<XemChiTieSuCoPage />} />
            </Route>
            <Route element={<AdminLayout />}>
                <Route path="/admin/tai-khoan" element={<QuanLyTaiKhoanPage />} />
                <Route path="/admin/loai-su-co" element={<QuanLyLoaiSuCoPage />} />
                <Route path="/admin/don-vi" element={<QuanLyDonViPage />} />
                <Route path="/admin/thong-ke" element={<ThongKeHeThongPage />} />
                <Route path="/admin/thong-bao" element={<ThongBaoPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}


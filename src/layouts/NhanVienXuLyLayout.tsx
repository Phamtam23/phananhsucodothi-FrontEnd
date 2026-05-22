import NhanVienXuLySidebar from "./components/NhanVienXuLySidebar";
import "./NhanVienXuLyLayout.scss"
import { Outlet } from "react-router-dom";

export const NhanVienXuLyLayout = () => {
    return (
        <div className="NhanVienXuLyLayout">
            <NhanVienXuLySidebar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default NhanVienXuLyLayout;

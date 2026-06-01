import NhanVienXuLySidebar from "./components/NhanVienXuLySidebar";
import InternalHeader from "../components/InternalHeader/InternalHeader";
import "./NhanVienXuLyLayout.scss"
import { Outlet } from "react-router-dom";

export const NhanVienXuLyLayout = () => {
    return (
        <div className="NhanVienXuLyLayout">
            <NhanVienXuLySidebar />
            <main>
                <InternalHeader />
                <div className="main-content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default NhanVienXuLyLayout;

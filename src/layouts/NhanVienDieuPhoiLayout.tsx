import Banner from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "./NhanVienDieuPhoiLayout.scss"
import { Outlet } from "react-router-dom";
export const NhanVienDieuPhoiLayout = () => {
return (
    <div className="NhanVienDieuPhoiLayout">
      <Banner />
      <main>
        <Outlet />
      </main>
    </div>

);
}

export default NhanVienDieuPhoiLayout;
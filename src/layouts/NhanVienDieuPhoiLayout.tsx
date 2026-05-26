import Banner from "../components/Sidebar/Sidebar";
import InternalHeader from "../components/InternalHeader/InternalHeader";
import "./NhanVienDieuPhoiLayout.scss"
import { Outlet } from "react-router-dom";
export const NhanVienDieuPhoiLayout = () => {
return (
    <div className="NhanVienDieuPhoiLayout">
      <Banner />
      <main>
        <InternalHeader />
        <div className="main-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>

);
}

export default NhanVienDieuPhoiLayout;
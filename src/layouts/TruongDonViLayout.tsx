import Sidebar from "../components/Sidebar/Sidebar";
import "./TruongDonViLayout.scss"
import { Outlet } from "react-router-dom";

export const TruongDonViLayout = () => {
    return (
        <div className="TruongDonViLayout">
            <Sidebar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default TruongDonViLayout;

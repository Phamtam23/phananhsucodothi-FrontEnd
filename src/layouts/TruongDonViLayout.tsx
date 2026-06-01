import Sidebar from "../components/Sidebar/Sidebar";
import InternalHeader from "../components/InternalHeader/InternalHeader";
import "./TruongDonViLayout.scss"
import { Outlet } from "react-router-dom";

export const TruongDonViLayout = () => {
    return (
        <div className="TruongDonViLayout">
            <Sidebar />
            <main>
                <InternalHeader />
                <div className="main-content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default TruongDonViLayout;

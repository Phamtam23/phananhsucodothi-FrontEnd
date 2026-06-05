import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
    return (
       <div className="user-layout">
        <Header />
         <main className="user-layout__main">
              <Outlet />
         </main>
         <Footer />
       </div>    
    )}

export default UserLayout;
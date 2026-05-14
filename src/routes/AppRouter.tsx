import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import UserLayout  from '../layouts/UserLayout';
import CreateSuco from '../pages/nguoidung/suco/CreateSuco';
import LichSuSuCo from '../pages/nguoidung/suco/LichSuSuCo';
export const AppRouter = () => {

    return (
        <Routes>
            <Route element = {<UserLayout />} >
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/suco/create" element={<CreateSuco />} />
              <Route path="/suco/lich-su" element={<LichSuSuCo />} />
            </Route>
             <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}
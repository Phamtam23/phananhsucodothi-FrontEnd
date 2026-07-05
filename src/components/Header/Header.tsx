import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/app.constants';
import NotificationDropdown from "../Notification/NotificationDropdown";
import './Header.scss';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          PASC
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav">
          {NAV_ITEMS
           .filter((item) => {
              if (item.requiresAuth && !isLoggedIn) return false;
              return true;
            })
                  .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`header__nav-link ${
                location.pathname === item.path ? 'header__nav-link--active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
         {/* Auth buttons */}
        <div className="header__actions">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="header__btn-login">
                Đăng nhập
              </Link>
              <Link to="/register" className="header__btn-register">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <NotificationDropdown buttonClassName="header__btn-bell" badgeClassName="header__bell-badge" isInternal={false} />
              <Link to="/profile" className="header__btn-profile">
                Tài khoản
              </Link>
              <button
                className="header__btn-logout"
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('accessToken');
                  window.location.href = '/login';
                }}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;
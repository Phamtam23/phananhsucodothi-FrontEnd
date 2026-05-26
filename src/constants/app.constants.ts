export const API_CONFIG = {
    BASE_URL: "http://localhost:8080/api/v1",
    TIMEOUT: 30000,
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/auth/login",
            LOGOUT: "/auth/logout",
            REGISTER: "/auth/register",
            FORGOT_PASSWORD: "/auth-service/v1/forgot-password",
            PROFILE: "/auth/profile",
            UPDATE_PROFILE: "/auth/profile",
        },
        USER: {
            PROFILE: "/auth/profile",
            UPDATE_PROFILE: "/auth/profile",
        },
        SUCO: {
            GET_BY_ID: (id: number | string) => `/suco/${id}`,
            GET_ALL: () => `/suco`,
            GET_ALL_BY_NGUOI_DAN: () => `/suco/nguoi-dan`,
            CREATE: "/suco",
            GET_ALL_BY_TRANGTHAI: (trangThai: string) => `/suco/trang-thai/${trangThai}`,
        },
        PHANCONG: {
            GET_BY_ID: (id: number | string) => `/phancong/${id}`,
            GET_BY_SUCO_ID: (id: number | string) => `/phancong/su-co/${id}`,
            CREATE: "/phancong",
            GET_BY_DONVI: (page: number = 0, size: number = 10) => `/phancong/don-vi?page=${page}&size=${size}`,
            UPDATE: (id: number | string) => `/phancong/${id}`,
            GET_BY_NHANVIEN:() => "/phancong/nhan-vien"
        },
        PHIEUKIEMDUYET: {
            CREATE: "/phieu-kiem-duyet",
            GET_BY_NHANVIEN : () =>"/phieu-kiem-duyet/nhan-vien",
            GET_BY_SUCO_ID: (id: number | string) => `/phieu-kiem-duyet/su-co/${id}`,
            GET_BY_ID: (id: number | string) => `/phieu-kiem-duyet/${id}`,
        },
        CHITIEPHANCONG: {
            CREATE: "/chi-tiet-phan-cong",
            UPDATE: "/chi-tiet-phan-cong",
            GET_BY_PHANCONG_ID: (id: number | string) => `/chi-tiet-phan-cong/phan-cong/${id}`,
            GET_BY_ID: (id: number | string) => `/chi-tiet-phan-cong/${id}`,
            GET_BY_NHANVIEN_ID: () => `/chi-tiet-phan-cong/nhan-vien`,
        },
        KETQUAXULY: {
            CREATE: "/ket-qua-xu-ly",
            GET_BY_ID: (id: number | string) => `/ket-qua-xu-ly/${id}`,
            UPDATE: "/ket-qua-xu-ly",
            GET_BY_CHITIETPHANCONG_ID: (id: number | string) => `/ket-qua-xu-ly/chi-tiet-phan-cong/${id}`,
            DUYET: (id: number | string) => `/ket-qua-xu-ly/duyet/${id}`,
        },
        DANHGIA: {
            CREATE: "/phieu-danh-gia",
            GET_BY_KETQUAXULY_ID: (id: number | string) => `/phieu-danh-gia/ket-qua-xu-ly/${id}`,
        },
        PHIEUMOLAI: {
            CREATE: "/phieu-mo-lai",
            UPDATE: "/phieu-mo-lai",
            GET_BY_PHANCONG_ID: (id: number | string) => `/phieu-mo-lai/phan-cong/${id}`,
            GET_BY_CHITIETPHANCONG_ID: (id: number | string) => `/phieu-mo-lai/chi-tiet-phan-cong/${id}`,
            GET_BY_ID: (id: number | string) => `/phieu-mo-lai/${id}`,
            GET_ALL_BY_DONVI: (page: number = 0, size: number = 10) => `/phieu-mo-lai/don-vi?page=${page}&size=${size}`,
            DUYET: (id: number | string) => `/phieu-mo-lai/duyet/${id}`,
        },
        DONVIXULY: {
            CREATE: "/don-vi-xu-ly",
            UPDATE: (id: number | string) => `/don-vi-xu-ly/${id}`,
            GET_BY_ID: (id: number | string) => `/don-vi-xu-ly/${id}`,
            GET_ALL: "/don-vi-xu-ly",
        },
        TAIKHOAN: {
            GET_ALL: "/tai-khoan",
            GET_BY_ID: (id: string) => `/tai-khoan/${id}`,
            CREATE: "/tai-khoan",
            UPDATE: (id: string) => `/tai-khoan/${id}`,
            KHOA: (id: string) => `/tai-khoan/${id}/khoa`,
            MO_KHOA: (id: string) => `/tai-khoan/${id}/mo-khoa`,
        },
        THONGKE: {
            HE_THONG: "/thong-ke",
        },
        FILE: {
            UPLOAD: "/files/upload",
        },
        NHANVIENDONVI: {
            GET_ALL_BY_DONVI_PHANCONG: () => `/nhan-vien-don-vi/phan-cong`,
            GET_ALL_BY_DONVI: (maDonVi: string) => `/nhan-vien-don-vi/don-vi/${maDonVi}`,
        },
        PHIEUPHANLOAI: {
            CREATE: "/phieu-phan-loai",
            GET_BY_SUCO_ID: (id: number | string) => `/phieu-phan-loai/su-co/${id}`,
            DELETE: (maSuCo: string, maLoai: string) => `/phieu-phan-loai?maSuCo=${maSuCo}&maLoai=${maLoai}`,
        },
        LOAI: {
            CREATE: "/loai",
            UPDATE: "/loai",
            GET_ALL: "/loai",
            GET_BY_ID: (id: number | string) => `/loai/${id}`,
        },
        PHIEUCHIDAO: {
            CREATE: "/phieu-chi-dao",
            UPDATE: "/phieu-chi-dao",
            GET_ALL_BY_CHITIETPHANCONG_ID: (id: number | string) => `/phieu-chi-dao/chi-tiet-phan-cong/${id}`,
            GET_BY_ID: (id: number | string) => `/phieu-chi-dao/${id}`,
            DELETE: (id: number | string) => `/phieu-chi-dao/${id}`
        }

    },
} as const;

export const TOKEN_CONFIG = {
    ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes in milliseconds
    REFRESH_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    REFRESH_INTERVAL: 14 * 60 * 1000, // 14 minutes - refresh before expiry
    REFRESH_BUFFER: 60 * 1000, // 1 minute buffer before token expires
} as const;

export const STORAGE_KEYS = {
    PROFILE: "profile",
    USER_INFO: "user_info",
    THEME: "theme",
    LANGUAGE: "language",
    REMEMBER_EMAIL: "remember_email",
    TOKEN: "accessToken",
} as const;

export const ROUTES = {
    AUTH: {
        LOGIN: "/login",
        REGISTER: "/register",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
    },
    MAIN: {
        HOME: "/",
        DASHBOARD: "/dashboard",
        PROFILE: "/profile",
        SETTINGS: "/settings",
    },
} as const;

export const HTTP_HEADERS = {
    CONTENT_TYPE: "Content-Type",
    AUTHORIZATION: "Authorization",
    NGROK_SKIP_WARNING: "ngrok-skip-browser-warning",
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: "Đăng nhập thành công",
        LOGIN_FAILED: "Đăng nhập thất bại",
        LOGOUT_SUCCESS: "Đăng xuất thành công",
        LOGOUT_FAILED: "Đăng xuất thất bại",
        SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn",
        TOKEN_REFRESH_SUCCESS: "Làm mới token thành công",
        TOKEN_REFRESH_FAILED: "Làm mới token thất bại",
        FORGOT_PASSWORD_SUCCESS:
            "Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
        FORGOT_PASSWORD_FAILED: "Gửi email thất bại, vui lòng thử lại",
    },
    VALIDATION: {
        EMAIL_REQUIRED: "Vui lòng nhập email",
        EMAIL_INVALID: "Email không hợp lệ",
        PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu",
        PASSWORD_MIN_LENGTH: "Mật khẩu tối thiểu 6 ký tự",
    },
    COMMON: {
        NETWORK_ERROR: "Lỗi kết nối mạng, vui lòng thử lại",
        SOMETHING_WENT_WRONG: "Có lỗi xảy ra, vui lòng thử lại sau",
    },
} as const;

export const UI_CONFIG = {
    ANIMATION_DURATION: 300, // milliseconds
    DEBOUNCE_DELAY: 500, // milliseconds
    NOTIFICATION_DURATION: 3, // seconds
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
    PHONE: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
} as const;

export const APP_META = {
    NAME: "Project Management System",
    VERSION: "1.0.0",
    DESCRIPTION: "A modern project management application",
} as const;

export const NAV_ITEMS = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Bản đồ', path: '/ban-do' },
    { label: 'Danh sách phản ánh', path: '/danh-sach-phan-anh' },
    { label: 'Lịch sử phản ánh', path: '/suco/lich-su', requiresAuth: true }

];
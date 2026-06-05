import "./LichSuThucHienPage.scss";
import { useChiTietPhanCongNhanVien } from "../../hooks/chitietphancong/useChiTietPhanCongNhanVien";
import { TrangThaiChiTietPhanCong } from "../../types/ChiTietPhanCong";
import { formatDate } from "../../utils/Format"
import { useState } from "react";
import Pagination from "../../components/Page/Pagination";
import { Search, ListFilter, FolderClosed, Clock, ShieldCheck, MapPin, Trash2 } from "lucide-react";

const getBadge = (trangThai: TrangThaiChiTietPhanCong) => {
    switch (trangThai) {
        case TrangThaiChiTietPhanCong.HOAN_THANH:
            return <span className="badge-lich-su xong">Hoàn thành</span>;
        case TrangThaiChiTietPhanCong.DANG_XU_LY:
            return <span className="badge-lich-su dang">Đang xử lý</span>;
        case TrangThaiChiTietPhanCong.DANG_CHO:
            return <span className="badge-lich-su cho">Chờ xử lý</span>;
        default:
            return <span className="badge-lich-su cho">{trangThai}</span>;
    }
}

const LichSuThucHienPage = () => {
    const { data, loading, error } = useChiTietPhanCongNhanVien(0, 50);
    const [search, setSearch] = useState("");
    const [tuNgay, setTuNgay] = useState("");
    const [denNgay, setDenNgay] = useState("");
    const [page, setPage] = useState(0);

    const handleReset = () => {
        setSearch("");
        setTuNgay("");
        setDenNgay("");
    };

    const tatCaPhieu = data?.content || [];
    const lichSu = tatCaPhieu.filter(p => {
        const matchesStatus = p.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH ||
            p.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY ||
            p.trangThai === TrangThaiChiTietPhanCong.DANG_CHO;

        if (!matchesStatus) return false;

        if (search.trim()) {
            const keyword = search.toLowerCase().trim();
            const matchesId = p.maChiTietPhanCong?.toLowerCase().includes(keyword);
            const matchesTieuDe = p.tieuDe?.toLowerCase().includes(keyword);
            const matchesDiaDiem = p.diaDiem?.toLowerCase().includes(keyword);
            if (!matchesId && !matchesTieuDe && !matchesDiaDiem) return false;
        }

        if (tuNgay) {
            if (!p.thoiGianTao) return false;
            const itemDate = p.thoiGianTao.split('T')[0];
            if (itemDate < tuNgay) return false;
        }

        return true;
    });

    const tongSo = data?.pagination.totalElements || 0;
    const dangXuLy = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY).length;
    const hoanThanh = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH).length;

    if (loading) return <div className="trang-lich-su-loading">Đang tải lịch sử...</div>;
    if (error) return <div className="trang-lich-su-loading" style={{ color: "#ef4444" }}>{error}</div>;

    return (
        <div className="trang-lich-su">
            <div className="trang-lich-su-header-row">
                <div className="header-titles">
                    <h1>Lịch sử phản ánh</h1>
                    <p>Hệ thống quản lý và giám sát các khiếu nại, phản ánh từ công dân.</p>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">TỔNG SỐ PHẢN ÁNH</span>
                        <span className="stat-value">{tongSo.toLocaleString()}</span>
                        <span className="stat-trend trend-up">↗ +12% so với tháng trước</span>
                    </div>
                    <div className="stat-icon folder-icon">
                        <FolderClosed size={24} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">ĐANG XỬ LÝ</span>
                        <span className="stat-value">{dangXuLy.toLocaleString()}</span>
                        <span className="stat-trend trend-warn">Cần đẩy nhanh tiến độ xử lý</span>
                    </div>
                    <div className="stat-icon clock-icon">
                        <Clock size={24} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">HOÀN THÀNH</span>
                        <span className="stat-value">{hoanThanh.toLocaleString()}</span>
                        <span className="stat-trend trend-good">✓ 93.3% tỷ lệ hoàn thành</span>
                    </div>
                    <div className="stat-icon check-icon">
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </div>

            <div className="lich-su-filter-bar">
                {/* Cụm tìm kiếm */}
                <div className="ls-card-loc ls-card-tim">
                    <div className="ls-o-timkiem">
                        <Search size={18} className="search-icon" />
                        <div className="ls-khung-nhap">
                            <input
                                type="text"
                                placeholder="Tìm kiếm mã ID, tiêu đề..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Cụm thời gian */}
                <div className="ls-card-loc ls-card-thoigian">
                    <div className="ls-chu-thoigian">
                        <span>THỜI</span>
                        <span>GIAN:</span>
                    </div>
                    <div className="ls-o-thoigian">
                        <div className="ls-khung-nhap">
                            <input
                                type="date"
                                value={tuNgay}
                                onChange={(e) => setTuNgay(e.target.value)}
                                className="ls-date-input"
                            />
                        </div>
                    </div>
                </div>

                <button onClick={handleReset} className="reset-filter-btn">
                    Đặt lại bộ lọc
                </button>
            </div>

            <table className="lich-su-table">
                <thead>
                    <tr>

                        <th>TIÊU ĐỀ</th>
                        <th>ĐỊA ĐIỂM</th>
                        <th>ĐƠN VỊ XỬ LÝ</th>
                        <th>TRẠNG THÁI</th>
                        <th>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>
                    {lichSu.map((item) => (
                        <tr key={item.maChiTietPhanCong}>
                            <td className="title-col">
                                <div className="table-title" title={item.tieuDe}>
                                    {item.tieuDe}
                                </div>
                            </td>
                            <td className="location-col">
                                <div className="location-wrapper" title={item.diaDiem}>
                                    <MapPin size={14} /> {item.diaDiem}
                                </div>
                            </td>
                            <td>{item.nhanVienXuLy?.hoTen || 'Sở Giao thông Vận tải'}</td>
                            <td>{getBadge(item.trangThai)}</td>
                            <td className="actions-col">
                                <button className="action-btn view-btn">
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={page}
                totalPages={data?.pagination.totalPages ?? 0}
                totalElements={data?.pagination.totalElements}
                onPageChange={setPage}
            />
        </div>
    );
};

export default LichSuThucHienPage;

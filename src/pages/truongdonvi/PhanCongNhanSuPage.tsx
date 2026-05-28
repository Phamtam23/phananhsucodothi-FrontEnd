import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {  format } from "date-fns";
import { MapPin, Image as ImageIcon, Map as MapIcon, ArrowLeft, RefreshCw, User, Calendar, MessageSquare } from "lucide-react";

import "./PhanCongNhanSuPage.scss";
import { usePhieuPhanCongDetail } from "../../hooks/phancong/usePhieuPhanCongDetail";
import { useNhanSuDonVi } from "../../hooks/nhansu/useNhanSuDonVi";
import { useChiTietPhanCong } from "../../hooks/phancong/useChiTietPhanCong";
import { usePhieuChiDao } from "../../hooks/phancong/usePhieuChiDao";
import type { NhanVienDonViResponse } from "../../types/NhanVienDonVi";
import { API_CONFIG} from "../../constants/app.constants";

const PhanCongNhanSuPage = () => {
    const { id: maPhieuPhanCong } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Data Hooks
    const { detail: phanCong, loading: loadingPhanCong } = usePhieuPhanCongDetail(maPhieuPhanCong);
    const { nhanSuList, loading: loadingNhanSu } = useNhanSuDonVi();
    const { chiTiet, loading: loadingChiTiet, fetchByPhanCongId, createChiTiet } = useChiTietPhanCong();
    const { chiDaoList, createChiDao, fetchByChiTietPhanCongId: fetchChiDaoList } = usePhieuChiDao();

    // Local State
    const [selectedNhanSu, setSelectedNhanSu] = useState<NhanVienDonViResponse | null>(null);
    const [thoiHan, setThoiHan] = useState("");
    const [loiNhac, setLoiNhac] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for Chi Dao Form
    const [showChiDaoForm, setShowChiDaoForm] = useState(false);
    const [newChiDaoContent, setNewChiDaoContent] = useState("");

    // Load ChiTiet and ChiDao when component mounts
    useEffect(() => {
        if (maPhieuPhanCong) {
            fetchByPhanCongId(maPhieuPhanCong);
            fetchChiDaoList(maPhieuPhanCong);
        }
    }, [maPhieuPhanCong, fetchByPhanCongId, fetchChiDaoList]);

    // Set selectedNhanSu when chiTiet is loaded
    useEffect(() => {
        if (chiTiet && chiTiet.nhanVienXuLy) {
            setSelectedNhanSu(chiTiet.nhanVienXuLy);
        }
    }, [chiTiet]);

    const handleSelectNhanSu = (nhanSu: NhanVienDonViResponse) => {
        setSelectedNhanSu(nhanSu);
    };

    const handleAssign = async () => {
        if (!maPhieuPhanCong || !selectedNhanSu) {
            alert("Vui lòng chọn nhân sự");
            return;
        }

        setIsSubmitting(true);
        try {
            // API hiện tại chỉ nhận maPhieuPhanCong và maNhanVienXuLy. Thời hạn và ghi chú không lưu vào backend theo yêu cầu.
            await createChiTiet({
                maPhieuPhanCong: maPhieuPhanCong,
                maNhanVienXuLy: selectedNhanSu.maNhanVien
            });
            alert("Phân công nhân sự thành công!");
            // Refresh data
            fetchByPhanCongId(maPhieuPhanCong);
        } catch (e) {
            alert("Lỗi khi phân công nhân sự");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddChiDao = async () => {
        if (!chiTiet) {
            alert("Vui lòng xác nhận giao việc cho nhân sự trước khi thêm chỉ đạo");
            return;
        }
        if (!newChiDaoContent.trim()) {
            alert("Vui lòng nhập nội dung chỉ đạo");
            return;
        }

        setIsSubmitting(true);
        try {
            await createChiDao({
                maChiTietPhanCong: chiTiet.maChiTietPhanCong,
                maTruongDonVi: "TRUONG_DON_VI_ID", // TODO: Get from context/auth if needed, but if backend gets it from token we can ignore this or pass dummy
                noiDung: newChiDaoContent,
                ngayChiDao: new Date().toISOString()
            });
            setShowChiDaoForm(false);
            setNewChiDaoContent("");
            alert("Thêm chỉ đạo thành công");
        } catch (e) {
            alert("Lỗi khi thêm chỉ đạo");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingPhanCong) return <div className="p-8">Đang tải thông tin...</div>;
    if (!phanCong) return <div className="p-8">Không tìm thấy thông tin phân công.</div>;

    const suco = phanCong.suCoDetail;

    return (
        <div className="pcns-page">
            <header className="pcns-header">
                <div className="pcns-header-top">
                    <button className="pcns-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Quay lại
                    </button>
                    <div className="pcns-tags">
                        <span className="pcns-status-tag">TRÌNH TRẠNG: {phanCong.trangThai}</span>
                        <span className="pcns-id-tag">ID: #{phanCong.maSuCo}</span>
                    </div>
                </div>
                
                <div className="pcns-header-main">
                    <h1>Phân chia & Thay đổi Nhân sự</h1>
                    <div className="pcns-actions">
                        <button className="pcns-btn-secondary">Lưu nháp</button>
                        <button 
                            className="pcns-btn-primary" 
                            onClick={handleAssign}
                            disabled={isSubmitting || !selectedNhanSu}
                        >
                            Xác nhận giao việc
                        </button>
                    </div>
                </div>
            </header>

            <div className="pcns-content">
                {/* CỘT TRÁI: Chi tiết & Chỉ đạo */}
                <div className="pcns-left-col">
                    <div className="pcns-card">
                        <div className="pcns-card-header">
                            <span className="pcns-section-label">CHI TIẾT PHẢN ÁNH</span>
                        </div>
                        <h2 className="pcns-incident-title">{suco?.noiDung || "Chưa có tiêu đề"}</h2>
                        <div className="pcns-incident-meta">
                            <div className="pcns-meta-item">
                                <MapPin size={14} />
                                <span>{suco?.diaDiem || "Chưa có địa điểm"}</span>
                            </div>
                            <div className="pcns-meta-item">
                                <Calendar size={14} />
                                <span>{suco?.thoiGianTao ? format(new Date(suco.thoiGianTao), 'HH:mm - dd/MM/yyyy') : ""}</span>
                            </div>
                        </div>
                        <p className="pcns-incident-desc">
                            (Mô tả chi tiết sự cố) Sự cố này yêu cầu xử lý kịp thời để tránh nguy hiểm.
                        </p>
                        
                        <div className="pcns-media-gallery">
                            {suco?.medias && suco.medias.slice(0, 2).map((m, i) => (
                                <div key={i} className="pcns-media-item">
                                    <img src={API_CONFIG.BASE_URL + m.url} alt="Incident" />
                                </div>
                            ))}
                            <div className="pcns-media-placeholder">
                                <MapIcon size={24} className="text-gray-400" />
                                <span>XEM BẢN ĐỒ</span>
                            </div>
                        </div>
                    </div>

                    <div className="pcns-card pcns-chidao-card">
                        <div className="pcns-card-header">
                            <span className="pcns-section-label">NỘI DUNG THỰC HIỆN DỰ KIẾN</span>
                        </div>
                        
                        <div className="pcns-chidao-list">
                            {chiDaoList.map((chidao, index) => (
                                <div key={chidao.maChiDao} className="pcns-chidao-item">
                                    <div className="pcns-chidao-index">{String(index + 1).padStart(2, '0')}</div>
                                    <div className="pcns-chidao-content">
                                        <h4>Nội dung chỉ đạo</h4>
                                        <p>{chidao.noiDung}</p>
                                    </div>
                                </div>
                            ))}
                            {chiDaoList.length === 0 && !showChiDaoForm && (
                                <p className="pcns-empty-msg">Chưa có chỉ đạo nào. Vui lòng phân công nhân sự và thêm chỉ đạo.</p>
                            )}
                        </div>

                        {showChiDaoForm ? (
                            <div className="pcns-chidao-form">
                                <textarea 
                                    placeholder="Nhập nội dung chỉ đạo..."
                                    value={newChiDaoContent}
                                    onChange={e => setNewChiDaoContent(e.target.value)}
                                    autoFocus
                                />
                                <div className="pcns-chidao-form-actions">
                                    <button onClick={() => setShowChiDaoForm(false)} className="btn-cancel">Hủy</button>
                                    <button onClick={handleAddChiDao} className="btn-save" disabled={isSubmitting}>Lưu chỉ đạo</button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                className="pcns-add-chidao-btn" 
                                onClick={() => setShowChiDaoForm(true)}
                                disabled={!chiTiet}
                            >
                                Thêm chỉ đạo
                            </button>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: Nhân sự & Ghi chú */}
                <div className="pcns-right-col">
                    <div className="pcns-card pcns-current-staff">
                        <div className="pcns-card-header space-between">
                            <span className="pcns-section-label">NHÂN SỰ PHỤ TRÁCH HIỆN TẠI</span>
                            <span className="pcns-history-link"><RefreshCw size={12} /> LỊCH SỬ THAY ĐỔI</span>
                        </div>
                        
                        {chiTiet && chiTiet.nhanVienXuLy ? (
                            <div className="pcns-staff-active">
                                <div className="pcns-staff-avatar">
                                    {chiTiet.nhanVienXuLy.anhDaiDien ? 
                                        <img src={chiTiet.nhanVienXuLy.anhDaiDien} alt="avatar" /> : 
                                        <User size={24} />
                                    }
                                </div>
                                <div className="pcns-staff-info">
                                    <span className="staff-role">NHÂN VIÊN XỬ LÝ</span>
                                    <h4 className="staff-name">{chiTiet.nhanVienXuLy.hoTen}</h4>
                                    <span className="staff-team">ID: {chiTiet.nhanVienXuLy.maNhanVien}</span>
                                </div>
                                <button className="pcns-swap-btn"><RefreshCw size={16} /></button>
                            </div>
                        ) : (
                            <div className="pcns-empty-msg p-4 text-center">
                                Chưa có nhân sự phụ trách
                            </div>
                        )}
                    </div>

                    <div className="pcns-card pcns-select-staff">
                        <div className="pcns-card-header">
                            <span className="pcns-section-label">CHỌN NHÂN SỰ / ĐỘI KỸ THUẬT</span>
                        </div>
                        
                        {loadingNhanSu ? (
                            <div className="p-4 text-center">Đang tải danh sách...</div>
                        ) : (
                            <div className="pcns-staff-list">
                                {nhanSuList.map(ns => (
                                    <div 
                                        key={ns.maNhanVien} 
                                        className={`pcns-staff-item ${selectedNhanSu?.maNhanVien === ns.maNhanVien ? 'selected' : ''}`}
                                        onClick={() => handleSelectNhanSu(ns)}
                                    >
                                        <div className="pcns-staff-avatar">
                                            {ns.anhDaiDien ? <img src={ns.anhDaiDien} alt="avatar" /> : <User size={20} />}
                                            {selectedNhanSu?.maNhanVien === ns.maNhanVien && (
                                                <div className="pcns-staff-check">✓</div>
                                            )}
                                        </div>
                                        <div className="pcns-staff-info">
                                            <h4 className="staff-name">{ns.hoTen}</h4>
                                            <span className="staff-desc">ID: {ns.maNhanVien}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="pcns-view-all-btn">XEM TẤT CẢ NHÂN SỰ ({nhanSuList.length})</button>
                    </div>

                    <div className="pcns-note-form">
                        <div className="pcns-card-header">
                            <span className="pcns-section-label text-white">THỜI HẠN & GHI CHÚ</span>
                        </div>
                        
                        <div className="pcns-form-group">
                            <label>THỜI HẠN XỬ LÝ DỰ KIẾN</label>
                            <input 
                                type="datetime-local" 
                                value={thoiHan}
                                onChange={e => setThoiHan(e.target.value)}
                            />
                        </div>
                        
                        <div className="pcns-form-group">
                            <label>LỜI NHẮC CHO NHÂN SỰ</label>
                            <textarea 
                                placeholder="Nhập hướng dẫn cụ thể cho đội kỹ thuật..."
                                value={loiNhac}
                                onChange={e => setLoiNhac(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhanCongNhanSuPage;

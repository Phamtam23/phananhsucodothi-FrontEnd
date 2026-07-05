import {useProfile} from "../../hooks/auth/useProfile";
import { useState, useEffect } from "react";
import type { UpdateProfileRequest } from "../../types/Auth";
import "./Profile.scss";
const Profile = () => {
    const {profile, loading, error, updating, updateProfile} = useProfile();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        hoTen: profile?.hoTen || "",
        soDienThoai: profile?.soDienThoai || "",
        diaChi: profile?.diaChi || "",
        email: profile?.email || "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                hoTen: profile.hoTen,
                soDienThoai: profile.soDienThoai,
                diaChi: profile.diaChi || "",
                email: profile.email,
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const success = await updateProfile(formData);
        if (success) {
            setIsEditing(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return null;

    return (
        <div className="profile-container">
            {/* Header Section */}
            <div className="profile-header">
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                        <img
                            src={profile.anhDaiDien ?? "/default-avatar.png"}
                            alt="avatar"
                        />
                    </div>
                    <button className="edit-avatar-btn">
                        <i className="fa-solid fa-camera"></i>
                    </button>
                </div>
                
                <div className="profile-header-info">
                    <div className="profile-id-badge">
                        <span>MÃ TÀI KHOẢN: {profile.id || "NV-001"}</span>
                    </div>
                    <h2>{profile.hoTen}</h2>
                    {profile.chucVu && <span className="chuc-vu">{profile.chucVu}</span>}
                    
                    <div className="profile-actions">
                        {!isEditing ? (
                            <>
                                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                                    <i className="fa-solid fa-pen"></i> Chỉnh sửa hồ sơ
                                </button>
                                <button className="btn-secondary">
                                    <i className="fa-solid fa-share-nodes"></i> Xuất báo cáo
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-secondary" onClick={() => setIsEditing(false)}>Hủy</button>
                                <button className="btn-primary" onClick={handleSubmit} disabled={updating}>
                                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="profile-content">
                <div className="profile-column left-column">
                    {/* Identification Info */}
                    <div className="profile-card">
                        <div className="card-header">
                            <i className="fa-regular fa-id-card"></i>
                            <h3>Thông tin định danh</h3>
                        </div>
                        <div className="card-body grid-2-col">
                            <div className="field">
                                <label>HỌ VÀ TÊN</label>
                                {isEditing ? (
                                    <input name="hoTen" value={formData.hoTen ?? ""} onChange={handleChange} />
                                ) : (
                                    <p>{profile.hoTen}</p>
                                )}
                            </div>
                            <div className="field">
                                <label>SỐ CMND/CCCD</label>
                                <p>{profile.cccd || "Chưa cập nhật"}</p>
                            </div>
                            <div className="field">
                                <label>SỐ ĐIỆN THOẠI</label>
                                {isEditing ? (
                                    <input name="soDienThoai" value={formData.soDienThoai ?? ""} onChange={handleChange} />
                                ) : (
                                    <p>{profile.soDienThoai || "Chưa cập nhật"}</p>
                                )}
                            </div>
                            <div className="field">
                                <label>ĐỊA CHỈ EMAIL</label>
                                {isEditing ? (
                                    <input name="email" value={formData.email ?? ""} onChange={handleChange} />
                                ) : (
                                    <p>{profile.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="profile-card">
                        <div className="card-header">
                            <i className="fa-solid fa-location-dot"></i>
                            <h3>Địa chỉ thường trú</h3>
                        </div>
                        <div className="card-body">
                            <div className="field full-width">
                                {isEditing ? (
                                    <input name="diaChi" value={formData.diaChi ?? ""} onChange={handleChange} className="address-input" />
                                ) : (
                                    <p className="address-text">{profile.diaChi || "Chưa cập nhật"}</p>
                                )}
                            </div>
                            <div className="map-placeholder">
                                <div className="map-inner">
                                    <button className="location-btn">Vị trí hiện tại</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-column right-column">
                    {/* Work Info */}
                    <div className="profile-card">
                        <div className="card-header">
                            <i className="fa-solid fa-briefcase"></i>
                            <h3>Công tác</h3>
                        </div>
                        <div className="card-body">
                            <div className="field full-width">
                                <label>CHỨC VỤ HIỆN TẠI</label>
                                <div className="role-badge">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span>{profile.chucVu || "Nhân viên"}</span>
                                </div>
                            </div>
                            <div className="field full-width">
                                <label>NGÀY BẮT ĐẦU</label>
                                <div className="date-badge">
                                    <i className="fa-regular fa-calendar"></i>
                                    <span>{profile.ngayBatDau ? new Date(profile.ngayBatDau).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</span>
                                </div>
                            </div>
                            
                            <div className="performance-box">
                                <div className="perf-header">
                                    <span>HIỆU SUẤT THÁNG</span>
                                    <span className="perf-value">98%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: '98%'}}></div>
                                </div>
                                <p className="perf-desc">Vượt mức chỉ tiêu đề ra cho khu vực trung tâm thành phố.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


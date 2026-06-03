import React from 'react';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../pages/nguoidung/suco/BanDoPage.scss';
import {TrangThaiSuCo} from "../../types/Suco"; 
import {TrangThaiPhanCong} from "../../types/PhieuPhanCong";
import type {SucoTrenBanDo} from "../../pages/truongdonvi/BanDoTruongDonViPage";

interface IncidentSidebarListProps {
  incidents: SucoTrenBanDo[];
  loading: boolean;
  emptyMessage?: string;
  onIncidentClick: (lat: number, lon: number) => void;
  children?: React.ReactNode; 
  loai?: string; 
}

const IncidentSidebarList = ({ incidents, loading,loai, emptyMessage = "Không có sự cố nào.", onIncidentClick, children }: IncidentSidebarListProps) => {
  const navigate = useNavigate();
 const handChiTietSuCo = (suco: SucoTrenBanDo) => {
    const { maSuCo, trangThai, trangThaiPhanCong, maPhieuPhanCong } = suco;
    if (loai === "DIEU_PHOI") {
        if (trangThai === TrangThaiSuCo.CHO_TIEP_NHAN) {
            navigate(`/nhanvien/kiem-duyet/${maSuCo}`);
            return; 
        }
        navigate(`/nhanvien/phan-cong/${maSuCo}`);
        return; 
    }

    if (loai === "TRUONG_DON_VI") {
        if (trangThaiPhanCong === TrangThaiPhanCong.CHO_XAC_NHAN) {
            navigate(`/truongdonvi/xac-minh`);
            return; 
        }
        if (trangThaiPhanCong === TrangThaiPhanCong.DA_XAC_NHAN) {
            navigate(`/truongdonvi/phan-cong/${maPhieuPhanCong}`);
            return; 
        }
        if (trangThaiPhanCong === TrangThaiPhanCong.CHO_DUYET_KET_QUA) {
            navigate(`/truongdonvi/duyet-ket-qua/${maPhieuPhanCong}`);
            return; 
        }
        return; 
    }

    navigate(`/suco/detail/${maSuCo}`);
};
  return (
    <div className="ban-do-sidebar">
      {children && (
        <div className="sidebar-header">
          {children}
        </div>
      )}

      <div className="incident-list">
        {loading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">{emptyMessage}</div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.maSuCo}
              className="incident-card"
              onClick={() => {
                if (incident.viDo && incident.kinhDo) {
                  onIncidentClick(incident.viDo, incident.kinhDo);
                }
              }}
            >
              <div className="incident-card-header">
                <span className="incident-id">{incident.maSuCo}</span>
                <span className={`incident-status ${incident.trangThai?.toLowerCase()}`}>
                  {incident.trangThai === "CHO_TIEP_NHAN" ? "CHỜ TIẾP NHẬN" :
                    incident.trangThai === "DA_TIEP_NHAN" ? "ĐÃ TIẾP NHẬN" :
                      incident.trangThai === "DANG_XU_LY" ? "ĐANG XỬ LÝ" :
                        incident.trangThai === "DA_XU_LY_XONG" ? "ĐÃ HOÀN THÀNH" :
                          incident.trangThai}
                </span>
              </div>
              <h3 className="incident-title">{incident.tieuDe}</h3>
              <div className="incident-meta" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#0066cc', fontWeight: 600 }}>
                  {incident.loaiSuCos && incident.loaiSuCos.length > 0 ? incident.loaiSuCos.join(', ') : 'Chưa phân loại'}
                </span>
              </div>
              <div className="incident-meta">
                <span className="meta-item">
                  <MapPin size={14} /> {incident.diaDiem || "Chưa xác định"}
                </span>
                {(!incident.viDo || !incident.kinhDo) && (
                  <div style={{ color: '#ff4d4f', fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>
                    * Sự cố này đang bị thiếu tọa độ từ API nên không thể ghim trên bản đồ.
                  </div>
                )}
              </div>
              <div className="incident-footer">
                <span className="date">{incident.thoiGianTao ? format(new Date(incident.thoiGianTao), 'dd/MM/yyyy HH:mm') : ''}</span>
               <button
                className="detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handChiTietSuCo(incident);
                }}
              >
                  Chi tiết &rarr;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentSidebarList;

import { useState, useEffect } from 'react';
import type { SucoSumaryResponse } from '../../types/Suco';
import IncidentMap from '../../components/Map/IncidentMap';
import IncidentSidebarList from '../../components/Map/IncidentSidebarList';
import '../../pages/nguoidung/suco/BanDoPage.scss';
import { usePhieuPhanCongDonVi } from '../../hooks/phancong/usePhieuPhanCongDonVi';

export interface SucoTrenBanDo  extends SucoSumaryResponse {
  trangThaiPhanCong?: string; 
  maPhieuPhanCong?: string;
}

const BanDoTruongDonViPage = () => {
  const [sucoS, setSucos] = useState<SucoTrenBanDo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data, loading: hookLoading } = usePhieuPhanCongDonVi(0, 1000);
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0544, 108.2022]); // Default center Da Nang
  const [mapZoom, setMapZoom] = useState(13);

  // Filters
  const [trangThaiFilter, setTrangThaiFilter] = useState<string>("tat_ca");
  const [loaiFilter, setLoaiFilter] = useState<string>("tat_ca");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!data?.content) return;
    // Response content là danh sách PhieuPhanCongWithSuCo
    const phanCongList = data.content;

    // Chỉ lấy các phiếu phân công đang active (chưa hoàn thành, chưa từ chối)
    const activeStatuses = ["CHO_XAC_NHAN", "DA_XAC_NHAN", "DANG_XU_LY", "CHO_DUYET_KET_QUA"];
    const activePhanCongs = phanCongList.filter((pc: any) => activeStatuses.includes(pc.trangThai));

    // Trích xuất suCoDetail từ phiếu phân công đang active, gán thêm trạng thái của phiếu phân công vào để lọc
    let allIncidents: any[] = activePhanCongs.map((pc: any) => {
      if (!pc.suCoDetail) return null;
      return {
        ...pc.suCoDetail,
        trangThaiPhanCong: pc.trangThai, 
        maPhieuPhanCong: pc.maPhieuPhanCong 
      };
    }).filter(Boolean);

    // Apply Status Filter before extracting unique incidents
    if (trangThaiFilter !== "tat_ca") {
        allIncidents = allIncidents.filter(incident => incident.trangThaiPhanCong === trangThaiFilter);
    }

    // Loại bỏ các sự cố trùng lặp
    let filtered = Array.from(new Map(allIncidents.map(item => [item.maSuCo, item])).values());

    // Lọc các sự cố nằm trong tọa độ Đà Nẵng
    filtered = filtered.filter(incident => {
      if (incident.viDo && incident.kinhDo) {
        return incident.viDo >= 15.9000 && incident.viDo <= 16.2500 &&
          incident.kinhDo >= 107.8000 && incident.kinhDo <= 108.3500;
      }
      if (incident.diaDiem) {
        const loc = incident.diaDiem.toLowerCase();
        return loc.includes("đà nẵng") || loc.includes("da nang");
      }
      return false;
    });

    // Extract unique types for the filter dropdown
    const types = Array.from(new Set(filtered.flatMap(item => item.loaiSuCos || [])));
    setAvailableTypes(types);

    // Apply Type Filter
    if (loaiFilter !== "tat_ca") {
        filtered = filtered.filter(incident => incident.loaiSuCos?.includes(loaiFilter));
    }

    setSucos(filtered);
    setLoading(false);
  }, [data, loaiFilter, trangThaiFilter]);

  return (
    <div className="ban-do-page" style={{ height: 'calc(100vh - 70px)' }}>
      <IncidentSidebarList
        incidents={sucoS}
        loai="TRUONG_DON_VI"
        loading={hookLoading || loading}
        emptyMessage="Không có sự cố nào đang được xử lý tại đơn vị của bạn."
        onIncidentClick={(lat, lon) => {
          setMapCenter([lat, lon]);
          setMapZoom(17);
        }}
      >
        <h2>Sự cố đang xử lý tại đơn vị</h2>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', marginBottom: '12px' }}>
          Bản đồ chỉ hiển thị các sự cố đã được phân công cho đơn vị của bạn và đang trong quá trình xử lý.
        </p>

        <div className="filter-group" style={{ display: 'flex', gap: '8px' }}>
          <select
            value={trangThaiFilter}
            onChange={e => setTrangThaiFilter(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          >
            <option value="tat_ca">Tất cả trạng thái</option>
            <option value="CHO_XAC_NHAN">Chờ xác minh</option>
            <option value="DA_XAC_NHAN">Chờ phân công</option>
            <option value="DANG_XU_LY">Đang xử lý</option>
            <option value="CHO_DUYET_KET_QUA">Chờ duyệt kết quả</option>
          </select>

          {availableTypes.length > 0 && (
            <select
              value={loaiFilter}
              onChange={e => setLoaiFilter(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="tat_ca">Tất cả loại sự cố</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          )}
        </div>
      </IncidentSidebarList>

      <div className="map-area">
        <IncidentMap loai="TRUONG_DON_VI" incidents={sucoS} mapCenter={mapCenter} mapZoom={mapZoom} />
      </div>
    </div>
  );
};

export default BanDoTruongDonViPage;

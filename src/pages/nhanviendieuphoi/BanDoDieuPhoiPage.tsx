import { useState, useEffect } from 'react';
import { GetALLSuCoService } from '../../services/SucoService';
import type { SucoSumaryResponse } from '../../types/Suco';
import IncidentMap from '../../components/Map/IncidentMap';
import IncidentSidebarList from '../../components/Map/IncidentSidebarList';
import '../nguoidung/suco/BanDoPage.scss';

const BanDoDieuPhoiPage = () => {
  const [incidents, setIncidents] = useState<SucoSumaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0544, 108.2022]); // Default center Da Nang
  const [mapZoom, setMapZoom] = useState(13);

  const [trangThaiFilter, setTrangThaiFilter] = useState<string>("tat_ca");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);

        const response = await GetALLSuCoService(0, 1000);
        let allIncidents = response.data?.content ?? [];

        const allowedStatuses = ["CHO_TIEP_NHAN", "DA_TIEP_NHAN", "DANG_XU_LY"];

        let filtered = allIncidents.filter(incident => allowedStatuses.includes(incident.trangThai || ""));


        if (trangThaiFilter !== "tat_ca") {
          filtered = filtered.filter(incident => incident.trangThai === trangThaiFilter);
        }

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

        setIncidents(filtered);
      } catch (error) {
        console.error("Error fetching incidents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, [trangThaiFilter]);

  return (
    <div className="ban-do-page" style={{ height: 'calc(100vh - 70px)' }}>
      <IncidentSidebarList
        incidents={incidents}
        loai="DIEU_PHOI"
        loading={loading}
        emptyMessage="Không có sự cố nào cần điều phối/xử lý lúc này."
        onIncidentClick={(lat, lon) => {
          setMapCenter([lat, lon]);
          setMapZoom(17);
        }}
      >
        <h2>Sự cố đang điều phối / xử lý</h2>
        <div className="filter" style={{ marginTop: '16px' }}>
          <select
            value={trangThaiFilter}
            onChange={e => setTrangThaiFilter(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          >
            <option value="tat_ca">Tất cả (Chờ duyệt, Đã duyệt, Đang xử lý)</option>
            <option value="CHO_TIEP_NHAN">Chỉ sự cố Chờ tiếp nhận</option>
            <option value="DA_TIEP_NHAN">Chỉ sự cố Đã tiếp nhận</option>
            <option value="DANG_XU_LY">Chỉ sự cố Đang xử lý</option>
          </select>
        </div>
      </IncidentSidebarList>

      <div className="map-area">
        <IncidentMap loai="DIEU_PHOI" incidents={incidents} mapCenter={mapCenter} mapZoom={mapZoom} />
      </div>
    </div>
  );
};

export default BanDoDieuPhoiPage;

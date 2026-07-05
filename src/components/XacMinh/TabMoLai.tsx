export const TabMoLai = ({ tabHienTai, setTab, soMoLai }: {
    tabHienTai: string;
    setTab: (tab: any) => void;
    soMoLai: number;
}) => (
    <div className="xac-minh-tabs">
        <button className={`xac-minh-tab ${tabHienTai === "CHO_PHAN_HOI" ? "active" : ""}`} onClick={() => setTab("CHO_PHAN_HOI")}>
            Chờ phản hồi <span className="tab-badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>{soMoLai}</span>
        </button>
        <button className={`xac-minh-tab ${tabHienTai === "DA_XU_LY" ? "active" : ""}`} onClick={() => setTab("DA_XU_LY")}>
            Đã xử lý
        </button>
    </div>
);
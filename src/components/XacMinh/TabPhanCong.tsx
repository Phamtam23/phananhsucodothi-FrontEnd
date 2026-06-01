export const TabPhanCong = ({ tabHienTai, setTab, soChoXacNhan, soDaXacNhan }: {
    tabHienTai: string;
    setTab: (tab: any) => void;
    soChoXacNhan: number;
    soDaXacNhan: number;
}) => (
    <div className="xac-minh-tabs">
        {[
            { key: "CHO_XAC_NHAN", label: "Chờ xác minh", so: soChoXacNhan },
            { key: "DA_XAC_NHAN", label: "Chờ phân công", so: soDaXacNhan },
            { key: "DANG_XU_LY", label: "Đang xử lý" },
            { key: "CHO_DUYET_KET_QUA", label: "Chờ duyệt kết quả" },
            { key: "HOAN_THANH", label: "Đã thực hiện" },
        ].map(tab => (
            <button key={tab.key} className={`xac-minh-tab ${tabHienTai === tab.key ? "active" : ""}`} onClick={() => setTab(tab.key)}>
                {tab.label} {tab.so != null && tab.so > 0 && <span className="tab-badge">{tab.so}</span>}
            </button>
        ))}
    </div>
);

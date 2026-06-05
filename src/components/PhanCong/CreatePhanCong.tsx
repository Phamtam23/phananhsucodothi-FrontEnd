import { useCreatePhanCong } from "../../hooks/phancong/useCreatePhanCong";
import ListDonViXuLy from "../DonViXuLy/ListDonViXuLy";
import "./CreatePhanCong.scss";

type Props = {
  maSuCo: string;
};

const CreatePhanCong = ({ maSuCo }: Props) => {
  const {
    loading,
    error,
    donviList,
    addDonVi,
    removeDonVi,
    handleCreatePhanCong,
  } = useCreatePhanCong(maSuCo);

  return (
  <div className="create-phan-cong">
    <h2 className="create-phan-cong__title">Tạo phiếu phân công</h2>

    {error && <p className="error-msg">{error}</p>}

    <div>
      <ListDonViXuLy selectedDonViList={donviList} onSelect={addDonVi} />
    </div>

    <div>
      <span className="section-label">Đơn vị đã chọn</span>
      <div className="selected-list">
        {donviList.length === 0 ? (
          <p className="empty-selected">Chưa chọn đơn vị nào</p>
        ) : (
          donviList.map((dv) => (
            <div key={dv.maDonViXuLy} className="selected-item">
              <span className="selected-item__name">{dv.tenDonVi}</span>
              <button className="btn-remove" onClick={() => removeDonVi(dv.maDonViXuLy)}>
                ✕ Xóa
              </button>
            </div>
          ))
        )}
      </div>
    </div>

    <button
      className="btn-submit"
      disabled={loading || donviList.length === 0}
      onClick={handleCreatePhanCong}
    >
      {loading ? 'Đang tạo...' : 'Tạo phân công'}
    </button>
  </div>
);
}
export default CreatePhanCong;

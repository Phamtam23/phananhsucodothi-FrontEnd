import "./LichSuSuCo.scss";
import { useLichSuSuCo } from "../../../hooks/suco/useLichSuSuCo";
import SuCoCard from "../../../components/Suco/SuCoCard";
const LichSuSuCo = () => {
    const { loading, error, sucoList, pagination, setPage, page } = useLichSuSuCo();
    if (loading) {
        return <div>Đang tải...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

  return (
    <div className="lich-su-su-co">
        <h2>Lịch sử sự cố</h2>
        {sucoList.length === 0 ? (
            <p>Không có dữ liệu</p>

        ):(
         <div className="suco-list">
      {sucoList.map((suco) => (
        <SuCoCard key={suco.maSuCo} suco={suco} onClick={(maSuCo) => console.log('Clicked', maSuCo)} />
        ))}
        </div>
            )}

        <div className="pagination">

        <button
          disabled={pagination.first}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Trang {pagination.page + 1} / {pagination.totalPages}
        </span>

        <button
          disabled={pagination.last}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>

    );

}

export default LichSuSuCo;
import "./DetailSuco.scss";
import { useParams } from "react-router-dom";
import DetailSuCo from "../../../components/Suco/DetailSuCo"
import ListPhanCong from "../../../components/PhanCong/ListPhanCong"

const detailSucoPage = () => {
    const { maSuCo } = useParams<{ maSuCo: string }>();
    console.log("Mã sự cố từ URL:", maSuCo);
    return (
        <div>
            <DetailSuCo maSuCo={maSuCo ?? ""} />
            <ListPhanCong maSuCo={maSuCo ?? ""} />
        </div>
    )
}   

export default detailSucoPage;
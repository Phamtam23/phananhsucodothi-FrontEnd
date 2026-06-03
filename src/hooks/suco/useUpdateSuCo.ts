import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateSuCoService,GetSuCoByIdService } from "../../services/SucoService";
import type { UpdateSucoRequest,SucoDetailResponse } from "../../types/Suco";
export const useUpdateSuCo = (maSuCo:string) => {
    const navigate = useNavigate();
    const [formUpdate, setFormUpdate] = useState(<UpdateSucoRequest>{
        maSuCo: "",
        noiDung: "",
        mediaUrls: [],
    });

    const [sucoDetail, setSucoDetail] = useState<SucoDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchSucoDetail = async (id:number|string) => {
        setLoading(true);
        try {
            const res = await GetSuCoByIdService(id);
            setSucoDetail(res.data);
            setFormUpdate({
                maSuCo: res.data.maSuCo,
                noiDung: res.data.noiDung,
                mediaUrls: res.data.medias.map(m => m.url),
            });
        } catch (err) {
            alert("Không thể tải chi tiết sự cố");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       const {name, value} = e.target;
        setFormUpdate((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async () => {

        try {
            setLoading(true);
            await UpdateSuCoService(formUpdate);
            alert("Cập nhật sự cố thành công");
            navigate("/nguoidung/suco");
        } catch (error) {
            alert("Cập nhật sự cố thất bại, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (maSuCo) {
            fetchSucoDetail(maSuCo);
        }
    },[])

    return {
        formUpdate,
        sucoDetail,
        setFormUpdate,
        loading,
        errors,
        handleChange,
        handleSubmit,
    }

}


import{ useState } from "react";
import type {PhieuPhanLoaiRequest,PhieuPhanLoaiResponse} from "../../types/PhieuPhanLoai";
import { CreatePhieuPhanLoaiService } from "../../services/PhieuPhanLoaiService";
export const useCreatePhanLoai = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createPhieuPhanLoai = async (data: PhieuPhanLoaiRequest): Promise<PhieuPhanLoaiResponse> => {
        try {
            setLoading(true);
            setError(null);
            const response = await CreatePhieuPhanLoaiService(data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || "Không thể tạo phiếu phân loại");
            throw err;
        }
        finally {
            setLoading(false);
        }
    }

    return {
        createPhieuPhanLoai,
        loading,
        error
    }
}
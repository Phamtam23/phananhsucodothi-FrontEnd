import { useCallback,useState } from 'react';
import { useEffect } from 'react';
import { GetSuCoToBanDoService } from '../../services/SucoService';
import type {LoaiResponse} from '../../types/Loai';
import type { SucoSumaryResponse } from '../../types/Suco';
import {GetAllLoaiService} from '../../services/LoaiService';
export const useBanDo = () => {
    const [danhSachSuCo, setDanhSachSuCo] = useState<SucoSumaryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [danhSachLoai, setDanhSachLoai] = useState<LoaiResponse[]>([]);
    
    const fetchDanhSachSuCo = useCallback(async (maLoai?: string, trangThai?: string, page: number = 0, size: number = 10) => {
        try
        {
            setLoading(true);
            setError(null);
            const response = await GetSuCoToBanDoService(maLoai, trangThai, page, size);
            setDanhSachSuCo(response.data.content);
        }
        catch (err: any)
        {
            setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu sự cố');

        }
        finally
        {
            setLoading(false);
        }

    }, []);

    const fetchDanhSachLoai = useCallback(async () => {
        try
        {
            const response = await GetAllLoaiService();
            setDanhSachLoai(response.data);
        }
        catch (err: any)
        {
            setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu loại sự cố');
        }
        finally
        {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchDanhSachLoai();
    }, []);

    return {
        danhSachSuCo,
        loading,
        error,
        fetchDanhSachSuCo,
        danhSachLoai
    }
}

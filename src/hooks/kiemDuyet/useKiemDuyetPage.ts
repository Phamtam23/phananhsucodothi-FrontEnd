import { useState, useEffect } from "react";
import { useCallback } from "react";
import { GetALLSuCoService} from "../../services/SucoService";
import type { SucoSumaryResponse } from "../../types/Suco";
import type { SuCoFilterRequest } from "../../types/Suco";

const pageSize = 10;

export const useKiemDuyetPage = () => {
  const [danhSachSuCo, setDanhSachSuCo] = useState<SucoSumaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sucoFilter, setSucoFilter] = useState<SuCoFilterRequest>({});
  const fetchDanhSachSuCo = useCallback(async ( page: number = 0, size: number = 10,filter?: SuCoFilterRequest)=>{
      try{
          setLoading(true);
          setError(null);
          const response = await GetALLSuCoService(page, size,filter);
          setDanhSachSuCo(response.data.content);
          setTotalElements(response.data.pagination.totalElements);
          setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
          setError("Failed to fetch suco data");
      } finally {
          setLoading(false);
      }
  },[])

  useEffect(() => {
    fetchDanhSachSuCo(currentPage, pageSize, sucoFilter);
  }, [currentPage, sucoFilter]);

  const setSucoFilterWrapped = useCallback((
    value: SuCoFilterRequest | ((prev: SuCoFilterRequest) => SuCoFilterRequest)
  ) => {
    setCurrentPage(0);
    setSucoFilter(value);
  }, []);

  return {
    danhSachSuCo,
    loading,
    error,
    currentPage,
    totalElements,
    totalPages,
    setCurrentPage,
    fetchDanhSachSuCo,
    sucoFilter,
    setSucoFilter
  };
};

 
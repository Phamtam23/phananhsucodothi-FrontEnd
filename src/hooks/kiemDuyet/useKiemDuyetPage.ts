import { useState, useEffect, useMemo } from "react";

import {
  GetALLSuCoService,
  GetSuCoByTrangThaiService,
} from "../../services/SucoService";

import type { SucoSumaryResponse } from "../../types/Suco";

import type { PageResponse } from "../../types/Page";

const pageSize = 10;

export type TrangThaiFilter =
  | "tat_ca"
  | "CHO_TIEP_NHAN"
  | "DA_TIEP_NHAN"
  | "TU_CHOI";

export const useKiemDuyetPage = () => {

  const [data, setData] =
    useState<SucoSumaryResponse[]>([]);

  const [totalElements, setTotalElements] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [currentPage, setCurrentPage] =
    useState(0);

  const [trangThaiFilter, setTrangThaiFilter] =
    useState<TrangThaiFilter>("tat_ca");

  const [searchCode, setSearchCode] =
    useState("");

  const [searchLocation, setSearchLocation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {

    let cancelled = false;

    const fetchData = async () => {

      setLoading(true);

      setError(null);

      try {

        let response;

        if (trangThaiFilter === "tat_ca") {

          response =
            await GetALLSuCoService(
              currentPage,
              pageSize
            );

        } else {

          response =
            await GetSuCoByTrangThaiService(
              trangThaiFilter,
              currentPage,
              pageSize
            );
        }

        if (cancelled) return;

        const page:
          PageResponse<SucoSumaryResponse> =
            response.data;

        setData(page.content ?? []);

        setTotalElements(
          page.pagination?.totalElements ?? 0
        );

        setTotalPages(
          page.pagination?.totalPages ?? 1
        );

      } catch (err) {

        if (cancelled) return;

        setError(
          "Đã có lỗi xảy ra khi tải dữ liệu."
        );

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };

  }, [currentPage, trangThaiFilter]);

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      const matchesCode =
        !searchCode ||
        item.maSuCo
          ?.toLowerCase()
          .includes(searchCode.toLowerCase());

      const matchesLocation =
        !searchLocation ||
        item.diaDiem
          ?.toLowerCase()
          .includes(searchLocation.toLowerCase());

      return matchesCode && matchesLocation;
    });

  }, [data, searchCode, searchLocation]);

  return {
    pageSize,

    data: filteredData,

    totalElements,
    totalPages,

    currentPage,
    setCurrentPage,

    trangThaiFilter,
    setTrangThaiFilter,

    searchCode,
    setSearchCode,

    searchLocation,
    setSearchLocation,

    loading,
    error,
  };
};
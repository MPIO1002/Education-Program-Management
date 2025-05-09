import { useState, useEffect } from 'react';

interface UseTableProps {
  apiEndpoint: string;
  filterKeys: string[];
  initialSearchParams?: Record<string, string>; // ✅ đổi từ searchParams -> initialSearchParams
  refreshTrigger?: any;
  onNotify?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

interface UseTableReturn<T> {
  data: T[];
  searchParams: Record<string, string>;
  setSearchParams: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  isLoading: boolean;
  hasError: boolean;
  selectedRows: number[];
  toggleRowSelection: (index: number) => void;
  deleteSelectedRows: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useTable = <T extends { id: number }>({
  apiEndpoint,
  initialSearchParams = {},
  refreshTrigger,
  onNotify,
}: UseTableProps): UseTableReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [searchParams, setSearchParams] = useState<Record<string, string>>(initialSearchParams); // ✅ useState ở đây
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      let response;
      const paginationRequest = {
        page: currentPage,
        size: rowsPerPage,
      };

      const hasSearch = Object.values(searchParams).some((v) => v.trim() !== '');

      if (hasSearch) {
        response = await fetch(`${apiEndpoint}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paginationRequest,
            ...searchParams,
          }),
        });
      } else {
        const queryParams = new URLSearchParams({
          page: String(currentPage),
          size: String(rowsPerPage),
        }).toString();

        response = await fetch(`${apiEndpoint}?${queryParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();

      setData(result.listContent || []);
      setTotalPages(result.pageableData.totalPage);

    } catch (error) {
      console.error('Error fetching data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint, refreshTrigger, searchParams, currentPage, rowsPerPage]);

  const refreshData = async () => {
    await fetchData();
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const deleteSelectedRows = async () => {
    const idsToDelete = selectedRows.map((index) => data[index].id);

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`${apiEndpoint}/${id}`, {
            method: 'DELETE',
          })
        )
      );

      const remainingData = data.filter((row) => !idsToDelete.includes(row.id));
      setData(remainingData);
      setSelectedRows([]);
      onNotify?.('Đã xóa thành công', 'success');
    } catch (error) {
      console.error('Có lỗi khi xóa:', error);
      onNotify?.('Có lỗi xảy ra khi xóa', 'error');
    }
  };

  return {
    data,
    searchParams,
    setSearchParams,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    isLoading,
    hasError,
    selectedRows,
    toggleRowSelection,
    deleteSelectedRows,
    refreshData,
  };
};

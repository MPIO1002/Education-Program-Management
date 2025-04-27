import { useState, useEffect } from 'react';

interface UseTableProps {
  apiEndpoint: string;
  filterKeys: string[];
  refreshTrigger?: any; // Ensure refreshTrigger is defined here
  onNotify?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void; // Optional notification callback
}

interface UseTableReturn<T> {
  data: T[];
  filteredData: T[];
  paginatedData: T[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  totalPages: number;
  isLoading: boolean;
  hasError: boolean;
  selectedRows: number[];
  toggleRowSelection: (index: number) => void;
  deleteSelectedRows: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useTable = <T extends { id: number }>({ apiEndpoint, filterKeys, refreshTrigger, onNotify }: UseTableProps): UseTableReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result.result || []); // Assuming the API returns an object with a 'result' property
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint, refreshTrigger]); // Fetch data when apiEndpoint or refreshTrigger changes

  // Refresh data
  const refreshData = async () => {
    await fetchData();
  };

  // Filtered data based on search term
  const filteredData = data.filter((row) =>
    filterKeys.some((key) =>
      String(row[key as keyof T]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle row selection
  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
    );
  };

  // Delete selected rows
    const deleteSelectedRows = async () => {
      const idsToDelete = selectedRows.map((index) => paginatedData[index].id); // Get IDs of selected rows
      try {
          await Promise.all(
              idsToDelete.map((id) =>
                  fetch(`${apiEndpoint}/${id}`, {
                      method: 'DELETE',
                  })
              )
          );
  
          // Remove deleted rows from the table
          const remainingData = data.filter((row) => !idsToDelete.includes(row['id']));
          setData(remainingData);
          setSelectedRows([]);
  
          // Notify success
          if (onNotify) {
              onNotify('Đã xóa thành công', 'success');
          }
      } catch (error) {
          console.error('Có lỗi xảy ra', error);
  
          // Notify error
          if (onNotify) {
              onNotify('Có lỗi xảy ra', 'error');
          }
      }
  };

  return {
    data,
    filteredData,
    paginatedData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    isLoading,
    hasError,
    selectedRows,
    toggleRowSelection,
    deleteSelectedRows,
    refreshData,
  };
};
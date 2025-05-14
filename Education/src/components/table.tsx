import React from 'react';
import Pagination from './pagination';
import Notification from './notification';
import useDebounce from '../hooks/useDebounce';
import { useTable } from '../hooks/useTable';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoDataImage from '../assets/svg/not-found.svg';

interface TableProps {
    columns: Array<{
        key: string;
        label: string;
        style?: React.CSSProperties;
        render?: (row: any) => React.ReactNode;
    }>;
    apiEndpoint: string;
    filterKeys: string[];
    refreshTrigger: any;
    filter?: Record<string, string>;
    selectFilter?: {
        filterKey: string;
        options: Array<{ value: string; label: string }>;
    };
    searchParams: Record<string, string>;
    transformResponse?: (data: any[]) => any[];
}

const Table: React.FC<TableProps> = ({
    columns,
    apiEndpoint,
    filterKeys,
    filter,
    selectFilter,
    searchParams: initialSearchParams,
    refreshTrigger,
    transformResponse,
}) => {
    const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const {
        data: rawData,
        isLoading,
        hasError,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        totalPages,
        selectedRows,
        toggleRowSelection,
        deleteSelectedRows,
        setRowsPerPage,
        searchParams,
        setSearchParams,
    } = useTable({
        apiEndpoint,
        filterKeys,
        initialSearchParams,
        refreshTrigger,
        onNotify: (message, type) => {
            setNotification({ message, type }); // Lưu thông báo vào state
        },
    });
    const data = transformResponse ? transformResponse(rawData) : rawData;
    const [tempSearchTerm, setTempSearchTerm] = React.useState(searchParams[Object.keys(searchParams)[0]] || '');
    const debouncedSearchTerm = useDebounce(tempSearchTerm, 500);


    const handleSelectAll = () => {
        const allSelected = selectedRows.length === data.length;
        data.forEach((_, index) => {
            const isSelected = selectedRows.includes(index);
            if (allSelected && isSelected) toggleRowSelection(index); // Uncheck all
            else if (!allSelected && !isSelected) toggleRowSelection(index); // Check all
        });
    };

    const handleDelete = async () => {
        await deleteSelectedRows();
    };

    React.useEffect(() => {
        const key = Object.keys(searchParams)[0];
        setSearchParams((prev) => ({
            ...prev,
            [key]: debouncedSearchTerm,
            ...filter, // Thêm filter vào params
        }));
        setCurrentPage(1);
    }, [debouncedSearchTerm, filter]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempSearchTerm(e.target.value);
    };


    return (
        <div>
            {/* Hiển thị thông báo nếu có */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)} // Đóng thông báo
                />
            )}
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    {/* Input Tìm Kiếm */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={tempSearchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm..."
                            className="px-4 py-2 border rounded-lg w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Delete Button */}
                    <div className="mb-4">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                            onClick={handleDelete}
                            disabled={selectedRows.length === 0}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            ({selectedRows.length})
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                        </div>
                    ) : hasError ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <img src={NoDataImage} alt="No data" className="w-32 h-32 mb-4" />
                            <p className="text-gray-500 mt-4">Failed to load data</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <img src={NoDataImage} alt="No data" className="w-32 h-32 mb-4" />
                            <p className="text-gray-500 mt-4">No data found. Try searching with a different keyword.</p>
                        </div>
                    ) : (
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-[#1b4587] text-white">
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedRows.length === data.length}
                                        />
                                    </th>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="border border-gray-300 px-4 py-2 text-left"
                                            style={column.style}
                                        >
                                            {selectFilter && column.key === selectFilter.filterKey ? (
                                                <select
                                                    value={filter?.[selectFilter.filterKey] || ''}
                                                    onChange={(e) =>
                                                        setSearchParams((prev) => ({
                                                            ...prev,
                                                            [selectFilter.filterKey]: e.target.value,
                                                        }))
                                                    }
                                                    className="bg-[#1b4587] text-white rounded px-2 py-1 focus:outline-none"
                                                >
                                                    <option value="">{column.label}</option> {/* Tên cột làm tùy chọn mặc định */}
                                                    {selectFilter.options.map((option) => (
                                                        <option key={option.value} value={option.value} className="bg-white text-black">
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                column.label
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row: any, index: number) => (
                                    <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(index)}
                                                onChange={() => toggleRowSelection(index)}
                                            />
                                        </td>
                                        {columns.map((column) => (
                                            <td key={column.key} className="border border-gray-300 px-4 py-2">
                                                {column.render ? column.render(row) : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setCurrentPage(1);
                        setRowsPerPage(size);
                    }}
                />
            </div>
        </div>
    );
};

export default Table;

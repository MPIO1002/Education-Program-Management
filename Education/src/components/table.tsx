import React, { JSX, useState } from 'react';
import { useTable } from '../hooks/useTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Notification from './notification'; // Import Notification component

interface TableProps {
    columns: Array<{
        style: React.CSSProperties | undefined;
        key: string;
        label: string;
        render?: (row: Record<string, any>) => JSX.Element; // Optional custom render function

    }>;
    apiEndpoint: string;
    filterKeys: string[];
    refreshTrigger?: any; // Add refreshTrigger as an optional property
}

const Table: React.FC<TableProps> = ({ columns, apiEndpoint, filterKeys, refreshTrigger }) => {
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    } | null>(null);

    const {
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
    } = useTable({
        apiEndpoint,
        filterKeys,
        refreshTrigger,
        onNotify: (message, type) => setNotification({ message, type }), // Pass notification handler
    });

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            {/* Render Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)} // Clear notification after it disappears
                />
            )}

            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Enter keyword..."
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/3 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded flex items-center gap-2 cursor-pointer"
                    onClick={deleteSelectedRows}
                    disabled={selectedRows.length === 0}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>

            {/* Table */}
            <div className="relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : hasError ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-gray-500 mt-4">Failed to load data</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-gray-500 mt-4">No data found. Try searching with a different keyword.</p>
                    </div>
                ) : (
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1b4587] text-white">
                                <th className="border border-gray-300 px-4 py-2" style={{ width: '50px' }}>
                                    <input
                                        type="checkbox"
                                        className="cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                paginatedData.forEach((_, i) => toggleRowSelection(i));
                                            } else {
                                                paginatedData.forEach((_) => toggleRowSelection(-1));
                                            }
                                        }}
                                        checked={
                                            selectedRows.length === paginatedData.length &&
                                            paginatedData.length > 0
                                        }
                                    />
                                </th>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="border border-gray-300 px-4 py-2 text-left"
                                        style={column.style}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(index)}
                                            onChange={() => toggleRowSelection(index)}
                                        />
                                    </td>
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="border border-gray-300 px-4 py-2"
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : (row as Record<string, any>)[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && !hasError && filteredData.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;
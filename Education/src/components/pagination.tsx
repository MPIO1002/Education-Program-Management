import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) => {
    const handleFirstPage = () => onPageChange(1);
    const handleLastPage = () => onPageChange(totalPages);
    const handlePreviousPage = () => onPageChange(Math.max(currentPage - 1, 1));
    const handleNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));

    const getPages = () => {
        const pages = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage === 1) {
                pages.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pages;
    };

    return (
        <nav aria-label="Page navigation example">
            <ul className="flex items-center justify-between -space-x-px h-8 text-sm mt-4">
                {/* First and Previous Buttons */}
                <div className="flex items-center -space-x-px h-8 text-sm">
                <li>
                    <button
                        onClick={handleFirstPage}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        <DoubleArrowLeftIcon />
                    </button>
                </li>
                <li>
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <ChevronLeftIcon />
                    </button>
                </li>

                {/* Page Numbers */}
                {getPages().map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                                currentPage === page
                                    ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Next and Last Buttons */}
                <li>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <ChevronRightIcon />
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleLastPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        <DoubleArrowRightIcon />
                    </button>
                </li>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                <span>Rows per page:</span>
                <select
                    className="border-gray-500 rounded p-1 text-gray-500"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
            </ul>
        </nav>
    );
};

export default Pagination;
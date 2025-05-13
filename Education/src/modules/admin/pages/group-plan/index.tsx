import React, { useState } from 'react';
import Table from '../../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const GroupPlan = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    hocPhanName: '',
  });
  const columns = [
    { key: 'maNhom', label: 'Mã nhóm', style: { width: '80px' } },
    { key: 'hocPhanName', label: 'Tên học phần', style: { width: '200px' } },
    { key: 'namHoc', label: 'Năm học', style: { width: '200px' } },
    { key: 'hocKy', label: 'HK', style: { width: '30px' } },
    { key: 'soLuongSv', label: 'SV', style: { width: '30px' } },
    { key: 'thoiGianBatDau', label: 'Thời gian bắt đầu', style: { width: '200px' } },
    { key: 'thoiGianKetThuc', label: 'Thời gian kết thúc', style: { width: '200px' } },
    { key: 'trangThai', label: 'Trạng thái', style: { width: '200px' } },
    {
      key: 'actions',
      label: 'Hành động',
      style: { width: '150px' },
      render: (row: { [key: string]: any }) => (
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => handleUpdate(row)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ),
    },
  ];

  const apiEndpoint = 'http://localhost:8080/api/plan-group';
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions'); // Exclude 'actions' from filtering

  const handleUpdate = (row: { [key: string]: any }) => {
    console.log('Update row:', row);
    // Add your update logic here, e.g., open a modal or navigate to an edit page
  };

  return (
    <div>
      <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mb-4">Kế hoạch mở nhóm</h1>
              <div className="mb-4">
                <button
                  className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSquarePlus} />
                  Thêm
                </button>
              </div>
            </div>
      <Table columns={columns} apiEndpoint={apiEndpoint} filterKeys={filterKeys} refreshTrigger={refreshTrigger} searchParams={searchParams} />
    </div>
  );
};

export default GroupPlan;
import React from 'react';
import Table from '../../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const GroupPlan = () => {
  const columns = [
    { key: 'maNhom', label: 'Mã nhóm', style: { width: '80px' } },
    { key: 'hocPhanName', label: 'Tên học phần', style: { width: '200px' } },
    { key: 'namHoc', label: 'Năm học', style: { width: '100px' } },
    { key: 'hocKy', label: 'HK', style: { width: '30px' } },
    { key: 'soLuongSv', label: 'SV', style: { width: '30px' } },
    { key: 'thoiGianBatDau', label: 'Thời gian bắt đầu', style: { width: '150px' } },
    { key: 'thoiGianKetThuc', label: 'Thời gian kết thúc', style: { width: '150px' } },
    { key: 'trangThai', label: 'Trạng thái', style: { width: '120px' } },
    {
      key: 'actions',
      label: 'Hành động',
      style: { width: '110px' },
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
      <h1 className="text-2xl font-bold mb-4">Kế hoạch nhóm</h1>
      <Table columns={columns} apiEndpoint={apiEndpoint} filterKeys={filterKeys} />
    </div>
  );
};

export default GroupPlan;
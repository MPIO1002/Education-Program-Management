import React, { useState } from 'react';
import Table from '../../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import AddGroupPlanModal from './components/add-group-plan.modal'; // Import modal thêm mới
import UpdateGroupPlanModal from './components/update-group-plan.modal'; // Import modal cập nhật

const GroupPlan = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    hocPhanName: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State để quản lý modal thêm
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State để quản lý modal cập nhật
  const [selectedGroupPlan, setSelectedGroupPlan] = useState<{
    id: number;
    maNhom: string;
    hocPhanID: number;
    namHoc: string;
    hocKy: number;
    soLuongSv: number;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    trangThai: string;
  } | null>(null); // State để lưu trữ dữ liệu nhóm được chọn

  // Cấu hình các cột hiển thị trong bảng
  const columns = [
    { key: 'maNhom', label: 'Mã nhóm', style: { width: '150px' } },
    { key: 'hocPhanName', label: 'Tên học phần' },
    { key: 'maHp', label: 'Mã học phần', style: { width: '100px' } },
    { key: 'idNhom', label: 'Nhóm', style: { width: '80px' } },
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
            onClick={() => handleUpdate(row)} // Gọi hàm mở modal cập nhật
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ),
    },
  ];

  const apiEndpoint = 'http://localhost:8080/api/plan-group';
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions'); // Exclude 'actions' from filtering

  // Hàm xử lý tách `maNhom` thành `maHp` và `idNhom`
  const transformData = (data: any[]) => {
    return data.map((item) => {
      const [maHp, idNhom] = item.maNhom.split('.'); // Tách `maNhom` thành `maHp` và `idNhom`
      return {
        ...item,
        maHp,
        idNhom,
      };
    });
  };

  const handleUpdate = (row: { [key: string]: any }) => {
    setSelectedGroupPlan({
      id: row.id,
      maNhom: row.maNhom,
      hocPhanID: row.hocPhanID,
      namHoc: row.namHoc,
      hocKy: row.hocKy,
      soLuongSv: row.soLuongSv,
      thoiGianBatDau: row.thoiGianBatDau,
      thoiGianKetThuc: row.thoiGianKetThuc,
      trangThai: row.trangThai,
    });
    setIsUpdateModalOpen(true); // Mở modal cập nhật
  };

  const handleAddGroupPlan = () => {
    setIsAddModalOpen(true); // Mở modal thêm
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Kế hoạch mở nhóm</h1>
        <div className="mb-4">
          <button
            className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={handleAddGroupPlan} // Gọi hàm mở modal thêm
          >
            <FontAwesomeIcon icon={faSquarePlus} />
            Thêm
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        apiEndpoint={apiEndpoint}
        filterKeys={filterKeys}
        refreshTrigger={refreshTrigger}
        searchParams={searchParams}
        transformResponse={transformData}
      />

      {/* Hiển thị modal thêm mới */}
      {isAddModalOpen && (
        <AddGroupPlanModal
          onClose={() => setIsAddModalOpen(false)} // Đóng modal
          onGroupPlanAdded={() => {
            setIsAddModalOpen(false); // Đóng modal
            setRefreshTrigger((prev) => prev + 1); // Làm mới bảng
          }}
        />
      )}

      {/* Hiển thị modal cập nhật */}
      {isUpdateModalOpen && selectedGroupPlan && (
        <UpdateGroupPlanModal
          groupPlanData={selectedGroupPlan} // Truyền dữ liệu nhóm được chọn
          onClose={() => setIsUpdateModalOpen(false)} // Đóng modal
          onGroupPlanUpdated={() => {
            setIsUpdateModalOpen(false); // Đóng modal
            setRefreshTrigger((prev) => prev + 1); // Làm mới bảng
          }}
        />
      )}
    </div>
  );
};

export default GroupPlan;
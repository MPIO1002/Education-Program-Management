import React, { useState } from 'react';
import Table from '../../../../components/table';
import AddCourseModal from './components/add-course.modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import UpdateCourseModal from './components/update-course.modal';

const Courses = () => {
  const [filter, setFilter] = useState<Record<string, string>>({
    loaiHp: '',
  });

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    tenHp: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    tenHp: string;
    maHp: string;
    soTinChi: string;
    soTietLyThuyet: string;
    soTietThucHanh: string;
    loaiHp: string;
    hocPhanTienQuyet: string;
  } | null>(null);

  const columns = [
    { key: 'tenHp', label: 'Tên học phần' },
    { key: 'maHp', label: 'Mã học phần', style: { width: '150px' } },
    { key: 'soTinChi', label: 'Số tín chỉ', style: { width: '150px' } },
    { key: 'soTietLyThuyet', label: 'Số tiết lý thuyết', style: { width: '200px' } },
    { key: 'soTietThucHanh', label: 'Số tiết thực hành', style: { width: '200px' } },
    { key: 'loaiHp', label: 'Loại học phần', style: { width: '200px' } },
    { key: 'hocPhanTienQuyet', label: 'Học phần tiên quyết', style: { width: '230px' } },
    {
      key: 'actions',
      label: 'Hành động',
      render: (row: { [key: string]: any }) => (
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => handleUpdate(row)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ),
    },
  ];

  const apiEndpoint = 'http://localhost:8080/api/courses';
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions');

  const handleUpdate = (row: { [key: string]: any }) => {
    setSelectedCourse({
      id: row.id,
      tenHp: row.tenHp,
      maHp: row.maHp,
      soTinChi: row.soTinChi,
      soTietLyThuyet: row.soTietLyThuyet,
      soTietThucHanh: row.soTietThucHanh,
      loaiHp: row.loaiHp,
      hocPhanTienQuyet: row.hocPhanTienQuyet,
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Học phần</h1>
        <div className="mb-4">
          <button
            className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={handleAddCourse}
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
        filter={filter}
        selectFilter={{
          filterKey: 'loaiHp',
          options: [
            { value: '', label: 'Tất cả' },
            { value: 'Bắt buộc', label: 'Bắt buộc' },
            { value: 'Tự chọn', label: 'Tự chọn' },
          ],
        }}
      />

      {isModalOpen && (
        <AddCourseModal
          onClose={() => setIsModalOpen(false)}
          onCourseAdded={() => {
            setIsModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      {isUpdateModalOpen && selectedCourse && (
        <UpdateCourseModal
          courseData={selectedCourse}
          onClose={() => setIsUpdateModalOpen(false)}
          onCourseUpdated={() => {
            setIsUpdateModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default Courses;
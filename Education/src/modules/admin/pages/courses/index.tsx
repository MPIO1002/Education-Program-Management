import React, { useState } from 'react';
import Table from '../../../../components/table';
import AddCourseModal from './components/add-course.modal'; // Import the modal component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import UpdateCourseModal from './components/update-course.modal';

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger table refresh
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State to control UpdateCourseModal visibility
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    tenHp: string;
    maHp: string;
    soTinChi: string;
    soTietLyThuyet: string;
    soTietThucHanh: string;
    loaiHp: string;
    hocPhanTienQuyet: string;
  } | null>(null); // State to store the selected course for updating
  
  const columns = [
    { key: 'tenHp', label: 'Tên học phần', style: { width: '210px' } },
    { key: 'maHp', label: 'Mã học phần', style: undefined },
    { key: 'soTinChi', label: 'Số tín chỉ', style: undefined },
    { key: 'soTietLyThuyet', label: 'Số tiết lý thuyết', style: undefined },
    { key: 'soTietThucHanh', label: 'Số tiết thực hành', style: undefined },
    { key: 'loaiHp', label: 'Loại học phần', style: undefined },
    { key: 'hocPhanTienQuyet', label: 'Học phần tiên quyết', style: undefined },
    {
      key: 'actions',
      label: 'Hành động',
      style: undefined,
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
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions'); // Exclude 'actions' from filtering

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
    }); // Set the selected course data
    setIsUpdateModalOpen(true); // Open the UpdateCourseModal
  };

  const handleAddCourse = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment refresh trigger to refresh the table
    setIsModalOpen(true); // Open the modal
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
      <Table columns={columns} apiEndpoint={apiEndpoint} filterKeys={filterKeys} refreshTrigger={refreshTrigger} />
      {isModalOpen && (
        <AddCourseModal
          onClose={() => setIsModalOpen(false)} // Close the modal
          onCourseAdded={() => {
            setIsModalOpen(false); // Close the modal
            setRefreshTrigger((prev) => prev + 1); // Increment refresh trigger to refresh the table
          }}
        />
      )}
      {isUpdateModalOpen && selectedCourse && (
        <UpdateCourseModal
          courseData={selectedCourse} // Pass the selected course data to the UpdateCourseModal
          onClose={() => setIsUpdateModalOpen(false)} // Close the UpdateCourseModal
          onCourseUpdated={() => {
            setIsUpdateModalOpen(false); // Close the UpdateCourseModal
            setRefreshTrigger((prev) => prev + 1); // Increment refresh trigger to refresh the table
          }}
        />
      )}
    </div>
  );
};

export default Courses;
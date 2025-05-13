import React, { useState } from 'react';
import Table from '../../../../components/table';
import AddGeneralInfoModal from './components/add-general-info.modal';
import UpdateGeneralInfoModal from './components/update-general-info.modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus, faEye, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import NoDataImage from '../../../../assets/svg/not-found.svg';

const GeneralInfo = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [courses, setCourses] = useState<{ [key: number]: any[] }>({});
  const [expandedGroupIds, setExpandedGroupIds] = useState<number[]>([]);
  const [scheduleFrameDetails, setScheduleFrameDetails] = useState<any | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<{
    id: number;
    tenCtdt: string;
    nganh: string;
    khoaQuanLy: string;
    heDaoTao: string;
    trangThai: string;
  } | null>(null);

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    tenCtdt: '',
  });

  const columns = [
    { key: 'tenCtdt', label: 'Tên CTĐT', style: { width: '450px' } },
    { key: 'nganh', label: 'Ngành' },
    { key: 'khoaQuanLy', label: 'Khoa quản lý' },
    { key: 'heDaoTao', label: 'Hệ đào tạo' },
    { key: 'trangThai', label: 'Trạng thái' },
    {
      key: 'actions',
      label: 'Hành động',
      render: (row: { [key: string]: any }) => (
        <div className="flex justify-center gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => handleUpdate(row)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => handleViewDetails(row.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      ),
    },
  ];

  const apiEndpoint = 'http://localhost:8080/api/general-info';
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions');

  const handleUpdate = (row: { [key: string]: any }) => {
    setSelectedInfo({
      id: row.id,
      tenCtdt: row.tenCtdt,
      nganh: row.nganh,
      khoaQuanLy: row.khoaQuanLy,
      heDaoTao: row.heDaoTao,
      trangThai: row.trangThai,
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddGeneralInfo = () => {
    setIsAddModalOpen(true);
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/schedule-frames/${id}`);
      const data = await response.json();

      if (!response.ok || !data.sucess) {
        throw new Error(data.message || 'Failed to fetch schedule frame details');
      }

      setScheduleFrameDetails(data.result);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching schedule frame details:', error);
    }
  };

  const toggleGroup = async (groupId: number) => {
    if (expandedGroupIds.includes(groupId)) {
      // Nếu groupId đã mở, đóng nó
      setExpandedGroupIds((prev) => prev.filter((id) => id !== groupId));
      return;
    }

    // Mở dropdown và fetch dữ liệu nếu chưa có
    setExpandedGroupIds((prev) => [...prev, groupId]);

    if (!courses[groupId]) {
      try {
        console.log(`Fetching courses for group ID: ${groupId}`);
        const response = await fetch(`http://localhost:8080/api/schedule-frames/${groupId}/courses`);
        const data = await response.json();
        console.log('Fetched Courses:', data);
        if (!response.ok || !data.sucess) {
          throw new Error(data.message || 'Failed to fetch courses');
        }

        setCourses((prev) => ({ ...prev, [groupId]: data.result }));
        console.log('Updated Courses State:', courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Thông tin chung</h1>
        <div className="mb-4">
          <button
            className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={handleAddGeneralInfo}
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
      />

      {isAddModalOpen && (
        <AddGeneralInfoModal
          onClose={() => setIsAddModalOpen(false)}
          onGeneralInfoAdded={() => {
            setIsAddModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      {isUpdateModalOpen && selectedInfo && (
        <UpdateGeneralInfoModal
          id={selectedInfo.id}
          onClose={() => setIsUpdateModalOpen(false)}
          onGeneralInfoUpdated={() => {
            setIsUpdateModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      {isDetailModalOpen && scheduleFrameDetails && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-2/3 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{scheduleFrameDetails.name}</h2>
            <ul>
              {scheduleFrameDetails.knowledgeGroupList.length > 0 ? (
                scheduleFrameDetails.knowledgeGroupList.map((group: any) => (
                  <li key={group.id} className="mb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <div>
                        <h3 className="font-bold underline">{group.name}</h3>
                        <p className="text-sm text-gray-600">
                          Tín chỉ bắt buộc: {group.mandatoryCredits}, Tín chỉ tự chọn: {group.electiveCredits}
                        </p>
                      </div>
                      <FontAwesomeIcon
                        icon={expandedGroupIds.includes(group.id) ? faChevronUp : faChevronDown}
                      />
                    </div>
                    {expandedGroupIds.includes(group.id) && (
                      <div className="mt-2 pl-4 border-l border-gray-300">
                        {courses[group.id] ? (
                          courses[group.id].length > 0 ? (
                            <ul>
                              {courses[group.id].map((course: any) => (
                                <li key={course.id} className="mb-2">
                                  <p>
                                    <strong>{course.tenHp}</strong> ({course.maHp})
                                  </p>
                                  <p>
                                    Tín chỉ: {course.soTinChi}, Lý thuyết: {course.soTietLyThuyet}, Thực hành: {course.soTietThucHanh}
                                  </p>
                                  <p>Loại học phần: {course.loaiHp}</p>
                                  {course.hocPhanTienQuyet && (
                                    <p>Học phần tiên quyết: {course.hocPhanTienQuyet}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex flex-col items-center mt-4">
                              <img src={NoDataImage} alt="No data" className="w-32 h-32" />
                              <p className="text-gray-500 mt-2">Chưa có dữ liệu</p>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center mt-4">
                            <img src={NoDataImage} alt="No data" className="w-32 h-32" />
                            <p className="text-gray-500 mt-2">Đang tải...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <div className="flex flex-col items-center mt-4">
                  <img src={NoDataImage} alt="No data" className="w-32 h-32" />
                  <p className="text-gray-500 mt-2">Chưa có dữ liệu</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfo;
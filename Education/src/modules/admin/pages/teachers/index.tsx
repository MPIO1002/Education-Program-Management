import React, { useState } from 'react';
import Table from '../../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus, faChartBar } from '@fortawesome/free-solid-svg-icons';
import AddTeacherModal from './components/add-teachers.modal';
import UpdateTeacherModal from './components/update-teachers.modal';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Teachers = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [statisticsData, setStatisticsData] = useState<{ [key: string]: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'department' | 'degree'>('department');
  const [degreeStatisticsData, setDegreeStatisticsData] = useState<{ [key: string]: number } | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<{
    id: number;
    maGv: string;
    hoTen: string;
    boMon: string;
    khoa: string;
    trinhDo: string;
    chuyenMon: string;
    trangThai: string;
    namSinh: string;
  } | null>(null);

  const [filter, setFilter] = useState<Record<string, string>>({
    trinhDo: '',
  });

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    hoTen: '',
  });

  const columns = [
    { key: 'maGv', label: 'Mã GV', style: { width: '100px' } },
    { key: 'hoTen', label: 'Họ tên', style: { width: '200px' } },
    { key: 'boMon', label: 'Bộ môn', style: { width: '150px' } },
    { key: 'khoa', label: 'Khoa', style: { width: '150px' } },
    { key: 'trinhDo', label: 'Trình độ', style: { width: '100px' } },
    { key: 'chuyenMon', label: 'Chuyên môn', style: { width: '250px' } },
    { key: 'trangThai', label: 'Trạng thái', style: { width: '150px' } },
    {
      key: 'namSinh',
      label: 'Năm sinh',
      style: { width: '120px' },
      render: (row: { namSinh: string }) => {
        const date = new Date(row.namSinh);
        return date.toLocaleDateString('vi-VN');
      },
    },
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

  const apiEndpoint = 'http://localhost:8080/api/teachers';
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions');

  const handleUpdate = (row: { [key: string]: any }) => {
    setSelectedTeacher({
      id: row.id,
      maGv: row.maGv,
      hoTen: row.hoTen,
      boMon: row.boMon,
      khoa: row.khoa,
      trinhDo: row.trinhDo,
      chuyenMon: row.chuyenMon,
      trangThai: row.trangThai,
      namSinh: row.namSinh ? new Date(row.namSinh).toISOString().split('T')[0] : '',
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddTeacher = () => {
    setIsAddModalOpen(true);
  };

  const handleStatistics = async () => {
    try {
      const departmentResponse = await fetch('http://localhost:8080/api/teachers/statistics/department');
      const departmentData = await departmentResponse.json();

      if (!departmentResponse.ok || !departmentData.sucess) {
        throw new Error(departmentData.message || 'Failed to fetch department statistics');
      }

      setStatisticsData(departmentData.result);

      const degreeResponse = await fetch('http://localhost:8080/api/teachers/statistics/degree');
      const degreeData = await degreeResponse.json();

      if (!degreeResponse.ok || !degreeData.sucess) {
        throw new Error(degreeData.message || 'Failed to fetch degree statistics');
      }

      setDegreeStatisticsData(degreeData.result);

      setIsStatisticsModalOpen(true);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Danh sách giảng viên</h1>
        <div className="flex gap-4 mb-4">
          <button
            className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={handleAddTeacher}
          >
            <FontAwesomeIcon icon={faSquarePlus} />
            Thêm
          </button>
          <button
            className="bg-green-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={handleStatistics}
          >
            <FontAwesomeIcon icon={faChartBar} />
            Thống kê
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
          filterKey: 'trinhDo',
          options: [
            { value: '', label: 'Tất cả' },
            { value: 'Thạc sĩ', label: 'Thạc sĩ' },
            { value: 'Tiến sĩ', label: 'Tiến sĩ' },
          ],
        }}
      />

      {isAddModalOpen && (
        <AddTeacherModal
          onClose={() => setIsAddModalOpen(false)}
          onTeacherAdded={() => {
            setIsAddModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      {isUpdateModalOpen && selectedTeacher && (
        <UpdateTeacherModal
          teacherData={selectedTeacher}
          onClose={() => setIsUpdateModalOpen(false)}
          onTeacherUpdated={() => {
            setIsUpdateModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      {isStatisticsModalOpen && (statisticsData || degreeStatisticsData) && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
          onClick={() => setIsStatisticsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-2/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Thống kê giảng viên</h2>
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded cursor-pointer ${activeTab === 'department' ? 'bg-[#1b4587] text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setActiveTab('department')}
              >
                Theo bộ môn
              </button>
              <button
                className={`px-4 py-2 rounded cursor-pointer ${activeTab === 'degree' ? 'bg-[#1b4587] text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setActiveTab('degree')}
              >
                Theo trình độ
              </button>
            </div>

            {activeTab === 'department' && statisticsData && (
              <Bar
                data={{
                  labels: Object.keys(statisticsData),
                  datasets: [
                    {
                      label: 'Số lượng giảng viên',
                      data: Object.values(statisticsData),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                  },
                }}
              />
            )}

            {activeTab === 'degree' && degreeStatisticsData && (
              <div className="flex justify-center">
                <Pie
                  data={{
                    labels: Object.keys(degreeStatisticsData),
                    datasets: [
                      {
                        label: 'Số lượng giảng viên',
                        data: Object.values(degreeStatisticsData),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      },
                    ],
                  }}
                  options={{
                    responsive: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                  width={500}
                  height={500}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
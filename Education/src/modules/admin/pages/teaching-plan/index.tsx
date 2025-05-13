import React, { useState } from 'react';
import Table from '../../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import AddTeachingPlanModal from './components/add-teaching-plan.modal'; // Import modal thêm mới
import UpdateTeachingPlanModal from './components/update-teaching-plan.modal'; // Import modal cập nhật

const TeachingPlan = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filter, setFilter] = useState<Record<string, string>>({
      hocKy: '',
    });
  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    tenHp: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTeachingPlan, setSelectedTeachingPlan] = useState<{
    id: number;
    maHp: string;
    tenHp: string;
    soTinChi: string;
    hocKy: string;
    maHpTruoc: string;
  } | null>(null);

  const columns = [
    { key: 'maHp', label: 'Mã học phần', style: { width: '150px' } },
    { key: 'tenHp', label: 'Tên học phần', style: { width: '400px' } },
    { key: 'soTinChi', label: 'Số tín chỉ' },
    { key: 'hocKy', label: 'Học kỳ' },
    { key: 'maHpTruoc', label: 'Mã học phần trước', style: { width: '200px' } },
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

  const apiEndpoint = 'http://localhost:8080/api/teaching-plan';
  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions');

  const handleUpdate = (row: { [key: string]: any }) => {
    setSelectedTeachingPlan({
      id: row.id,
      maHp: row.maHp,
      tenHp: row.tenHp,
      soTinChi: row.soTinChi,
      hocKy: row.hocKy,
      maHpTruoc: row.maHpTruoc,
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddTeachingPlan = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Kế hoạch dạy học</h1>
        <div className="mb-4">
          <button
            className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={handleAddTeachingPlan}
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
                  filterKey: 'hocKy',
                  options: [
                    { value: '', label: 'Tất cả' },
                    ...Array.from({ length: 10 }, (_, i) => ({
                      value: (i + 1).toString(),
                      label: (i + 1).toString(),
                    })),
                  ],
                }}
      />

      {isAddModalOpen && (
        <AddTeachingPlanModal
          onClose={() => setIsAddModalOpen(false)}
          onTeachingPlanAdded={() => {
            setIsAddModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      {isUpdateModalOpen && selectedTeachingPlan && (
        <UpdateTeachingPlanModal
          teachingPlanData={selectedTeachingPlan}
          onClose={() => setIsUpdateModalOpen(false)}
          onTeachingPlanUpdated={() => {
            setIsUpdateModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default TeachingPlan;
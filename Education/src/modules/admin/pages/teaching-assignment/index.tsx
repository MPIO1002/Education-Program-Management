import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "../../../../components/table";
import { faPen, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AssignTeacherModal from "./components/assign-teacher.modal";
import UpdateAssignTeacherModal from "./components/update-assign-teacher.modal";

const TeachingAssignment = () => {
  const [isOpenAssignModal, setIsOpenAssignModal] = useState(false);
  const [isOpenUpdateAssignModal, setIsOpenUpdateAssignModal] = useState(false);

  const [selectedModel, setSelectedModel] = useState<{
        id: number,
        nhomId: number,
        planGroupName: string,
        giangVienId: number,
        vaiTro: string,
        soTiet: number
  } | null>(null);

  const apiEndpoint = "http://localhost:8080/api/plan-group-teacher";

  const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filter, setFilter] = useState<Record<string, string>>({
        vaiTro: '',
    });
  
    const [searchParams, setSearchParams] = useState<Record<string, string>>({
      planGroupName: '',
    });

  const columns = [
      { key: "planGroupName", label: "Mã nhóm" },
      { key: "teacherName", label: "Tên giảng viên" },
      { key: "vaiTro", label: "Vai trò" },
      { key: "soTiet", label: "Số tiết", style: { width: "150px" }},
      {
        key: 'actions',
        label: 'Hành động',
        render: (row: { [key: string]: any }) => (
          <div className="flex justify-center">
            <button className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                    onClick={(e) => openUpdateAssignModal(row)}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </div>
        ),
      },
      {key: "planGroupId", label: "PGId", style: { display: "none" }},
      {key: "teacherId", label: "TeacherId", style: { display: "none" }}
    ];

  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions');

  const openUpdateAssignModal = (row: { [key: string]: any }) => {
    setSelectedModel({
      id: row.id,
      nhomId: row.planGroupId,
      planGroupName: row.planGroupName,
      giangVienId: row.teacherId,
      vaiTro: row.vaiTro,
      soTiet: row.soTiet
    })

    setIsOpenUpdateAssignModal(true);
  }

  return (
     <div>
      <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Phân công giảng dạy</h1>
            <div className="mb-4">
              <button className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                      onClick={() => setIsOpenAssignModal(true)}>
                <FontAwesomeIcon icon={faSquarePlus} />
                Phân công
              </button>
            </div>
      </div>
      <Table columns={columns}
             apiEndpoint={apiEndpoint}
             filterKeys={filterKeys}
             refreshTrigger={refreshTrigger}
             searchParams={searchParams}
             filter={filter}
             selectFilter={{
               filterKey: 'vaiTro',
               options: [
                 { value: '', label: 'Tất cả' },
                 { value: 'Phụ trách', label: 'Phụ trách' },
                 { value: 'Sửa', label: 'Sửa' },
               ],
             }}>
      </Table>
      {isOpenAssignModal && (
        <AssignTeacherModal onClose={() => setIsOpenAssignModal(false)}
                            onAssign={() => {
                              setIsOpenAssignModal(false)
                              setRefreshTrigger(prev => prev + 1)
                            }}>
        </AssignTeacherModal>
      )}
      {isOpenUpdateAssignModal && selectedModel && (
        <UpdateAssignTeacherModal model={selectedModel}
                                  onClose={() => setIsOpenUpdateAssignModal(false)}
                                  onUpdate={() => {
                                    setIsOpenUpdateAssignModal(false)
                                    setRefreshTrigger(prev => prev + 1)
                                  }}>
        </UpdateAssignTeacherModal>
      )}
    </div>
  )
}

export default TeachingAssignment

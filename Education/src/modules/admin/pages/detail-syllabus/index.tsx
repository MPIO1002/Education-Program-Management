import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Table from '../../../../components/table';
import { useState } from 'react';
import UpdateDetailedSyllabusModal from './components/update-detailed-syllabus.modal';

const DetailedSyllabus = () => {
  const apiEndpoint = "http://localhost:8080/api/study-guide";
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filter, setFilter] = useState<Record<string, string>>({
      trangThai: '',
  });

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    nameCourse: '',
  });

  const columns = [
    { key: "nameCourse", label: "Tên học phần" },
    { key: "mucTieu", label: "Mục tiêu" },
    { key: "phuongPhapGiangDay", label: "Phương pháp giảng dạy" },
    { key: "taiLieuThamKhao", label: "Tài liệu tham khảo" },
    { key: "trangThai", label: "Trạng thái", style: { width: "150px" }},
    {
      key: 'actions',
      label: 'Hành động',
      render: (row: { [key: string]: any }) => (
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => handleUpdate(row)}>
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ),
    },
    { key: "courseId", label: "Course Id", style: { display: "none" }}
  ];

  const filterKeys = columns.map((column) => column.key).filter((key) => key !== 'actions');
  
  const [selectedModel, setSelectedModel] = useState<{
    id: number,
    courseId: number,
    mucTieu: string,
    noiDung: string[],
    phuongPhapGiangDay: string,
    taiLieuThamKhao: string,
    trangThai: string
  } | null>(null);

  const handleUpdate = (row: { [key: string]: any }) => {
    setSelectedModel({
      id: row.id,
      courseId: row.courseId,
      mucTieu: row.mucTieu,
      noiDung: row.noiDung,
      phuongPhapGiangDay: row.phuongPhapGiangDay,
      taiLieuThamKhao: row.taiLieuThamKhao,
      trangThai: row.trangThai,
    });

    setIsOpenUpdate(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Đề cương chi tiết</h1>
      </div>
      <Table columns={columns}
             apiEndpoint={apiEndpoint}
             filterKeys={filterKeys}
             refreshTrigger={refreshTrigger}
             searchParams={searchParams}
             filter={filter}
             selectFilter={{
               filterKey: 'trangThai',
               options: [
                 { value: '', label: 'Tất cả' },
                 { value: 'Đã duyệt', label: 'Đã duyệt' },
                 { value: 'Chưa duyệt', label: 'Chưa duyệt' },
               ],
             }}>
      </Table>
      {isOpenUpdate && selectedModel && (
        <UpdateDetailedSyllabusModal model={selectedModel}
                                     onClose={ () => setIsOpenUpdate(false) }
                                     onUpdated={() => {
                                      setIsOpenUpdate(false);
                                      setRefreshTrigger((prev) => prev + 1);
                                     }}>

        </UpdateDetailedSyllabusModal>
      )}
    </div>
  );
}

export default DetailedSyllabus;
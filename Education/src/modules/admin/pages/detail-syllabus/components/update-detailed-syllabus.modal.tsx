import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../../../../components/table";
import { faPen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Notification from "../../../../../components/notification";
import AddScoreModal from "./add-score.modal";
import UpdateScoreModal from "./update-score.modal";

interface ScoreJSON {
    deCuongId: number,
    tenCotDiem: string,
    tyLePhanTram: number,
    hinhThuc: string
}

interface CourseJSON {
    id: number,
    maHp: string,
    tenHp: string
}

interface UpdateDetailedSyllabusProps {
    model: {
        id: number,
        courseId: number,
        mucTieu: string,
        noiDung: string[],
        phuongPhapGiangDay: string,
        taiLieuThamKhao: string,
        trangThai: string
    }
    
    onClose: () => void;
    onUpdated: () => void;
}

const UpdateDetailedSyllabusModal: React.FC<UpdateDetailedSyllabusProps> = ({ model, onClose, onUpdated }) => {
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isOpenAddScore, setIsOpenAddScore] = useState(false);
    const [remainPercentage, setRemainPercentage] = useState(0);
    const remainPercentageRef = useRef(remainPercentage);

    const defaultFormData = {
        id: -1,
        courseId: -1,
        mucTieu: "",
        noiDung: "",
        phuongPhapGiangDay: "",
        taiLieuThamKhao: "",
        trangThai: "",
        listScore: []
    }
    const [formData, setFormData] = useState<{
        id: number,
        courseId: number,
        mucTieu: string,
        noiDung: string,
        phuongPhapGiangDay: string,
        taiLieuThamKhao: string,
        trangThai: string,
        listScore: ScoreJSON[]
    }>(defaultFormData);

    const [content, setContent] = useState("");

    const handleOnClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'modal-overlay') {
            onClose();
        }
    }

    const defaultSelectedCourse = {
        id: -1,
        maHp: "",
        tenHp: ""
    }

    const [selectedCourse, setSelectedCourse] = useState<CourseJSON>(defaultSelectedCourse);

    useEffect(() => {
        fetchSelectedCourse(model.courseId);
        setFormData({...model, ["noiDung"]: "", listScore: []});
        
        let content = "";
        model.noiDung.forEach((item) => {
            content += `${item}\n`;
        })

        content = content.substring(0, content.length - 1);
        setContent(content);

    }, [])

    useEffect(() => {
        let rContent = content.split('\n').join('_');
        setFormData(prev => ({ ...prev, ["noiDung"]: rContent}))
    }, [content])

    useEffect(() => {
        remainPercentageRef.current = remainPercentage
    }, [remainPercentage])

    
    const fetchSelectedCourse = async (id: number | string) => {
        let api = typeof(id) === "number" ? 
            `http://localhost:8080/api/courses/${id}` : `http://localhost:8080/api/courses/code/${id}`;

        try {
            const response = await fetch(api);
            if (!response.ok) {
                setSelectedCourse(defaultSelectedCourse);
                return;
            }
            const data = await response.json();

            if (data.sucess && data.result) setSelectedCourse(data.result); 
            else setSelectedCourse(defaultSelectedCourse);
        } 
        catch {}
    }
    
    const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;

        switch (e.target.name) {
            case "noiDung":
                setContent(value);
                return;

            default:
                setFormData(prev => ({ ...prev, [e.target.name]: value}))
        }
    }

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, ["trangThai"]: e.target.value}))
    }

    //#region Score Table

    const scoreFetchApiEndpoint = `http://localhost:8080/api/scores/study-guide/${model.id}`;
    const scoreApiEndpoint = `http://localhost:8080/api/scores`;
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedModel, setSelectedModel] = useState<{
        id: number,
        decuongId: number,
        tenCotDiem: string,
        tyLePhanTram: number,
        hinhThuc: string,
        remainPercentage: number
    } | null>(null);
    
    const filter: Record<string, string> = {};
    const searchParams: Record<string, string> = {};

    const scoreColumns = [
        { key: "id", label: "Id", style: { display: "none" }},
        { key: "tenCotDiem", label: "Tên cột điểm" },
        { key: "tyLePhanTram", label: "Tỷ lệ phần trăm" },
        { key: "hinhThuc", label: "Hình thức" },
        {
          key: 'actions',
          label: 'Hành động',
          render: (row: { [key: string]: any }) => (
            <div className="flex justify-center">
              <button type="button"
                      className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                      onClick={(e) => openUpdateScoreModal(row)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>
          ),
        },
        { key: "courseId", label: "Course Id", style: { display: "none" }}
    ];

    const filterKeys: string[] = []

    const loadTableData = (data: any) => {
        let per = 100;

        if (data) {
            data.forEach((item: any) => {
                per -= item.tyLePhanTram;
                item.deCuongId = model.id;
            })

            setRemainPercentage(per);
        }

        setFormData(prev => ({...prev, ["listScore"]: data || []}))
    }

    const ScoreTable = useMemo(() => 
                        <Table columns={scoreColumns}
                               apiEndpoint={scoreApiEndpoint}
                               filterKeys={filterKeys}
                               refreshTrigger={refreshTrigger}
                               searchParams={searchParams}
                               filter={filter}
                               fetchApiEndPoint={scoreFetchApiEndpoint}
                               canSearch={false}
                               finishLoadingCallback={loadTableData}>
                        </Table>, [refreshTrigger]);
    //#endregion

    const validate = () => {
        if (formData.mucTieu.trim().length == 0) {
            setNotification({ message: 'Mục tiêu bị trống', type: 'warning' });
            return false;
        }

        if (content.trim().length == 0) {
            setNotification({ message: 'Nội dung tham khảo bị trống', type: 'warning' });
            return false;
        }

        if (formData.phuongPhapGiangDay.trim().length == 0) {
            setNotification({ message: 'Phương pháp giảng dạy bị trống', type: 'warning' });
            return false;
        }

        if (formData.taiLieuThamKhao.trim().length == 0) {
            setNotification({ message: 'Tài liệu tham khảo bị trống', type: 'warning' });
            return false;
        }

        return true;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmit(true);

        if (!validate()) {
            setTimeout(() => {
                setNotification(null);
                setIsSubmit(false);
            }, 3000);

            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/study-guide/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Cập nhật thất bại');
            }

            setNotification({ message: result.message || 'Cập nhật thành công', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                onUpdated();
            }, 3000);
        }
        catch (e: any) {
            setNotification({ message: e.message || 'Failed to update. Please try again.', type: 'error' });
            setIsSubmit(false);

            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
    }

    const openAddScoreModal = () => {
        if (remainPercentage <= 0) {
            setNotification({ message: "Tỷ lệ phần trăm đã đủ. Không thể thêm!", type: 'warning' });
            setIsSubmit(false);

            setTimeout(() => {
                setNotification(null);
            }, 3000);
            
            return;
        }

        setIsOpenAddScore(true);
    }

    const openUpdateScoreModal = (row: { [key: string]: any }) => {
        console.log(remainPercentageRef.current);

        setSelectedModel({
            id: row.id,
            decuongId: model.id,
            tenCotDiem: row.tenCotDiem,
            tyLePhanTram: row.tyLePhanTram,
            hinhThuc: row.hinhThuc,
            remainPercentage: remainPercentageRef.current
        });

        setIsOpenUpdate(true);
    }

    return (
        <div id="modal-overlay"
             className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
             onClick={handleOnClose}>
            <div className="bg-white p-6 rounded shadow-lg w-2/3 min-h-[80vh] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Cập nhật đề cương chi tiết</h2>
                <form>
                    <div className="w-full d-flex flex-col">
                        <label className="block text-sm font-medium mb-1">Mã học phần</label>
                        <input
                            type="text"
                            name="maHp"
                            disabled={true}
                            value={selectedCourse?.maHp}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Tên học phần</label>
                        <input
                            type="text"
                            name="tenHp"
                            disabled={true}
                            value={selectedCourse.tenHp}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Mục tiêu</label>
                        <textarea
                            name="mucTieu"
                            value={formData.mucTieu}
                            onChange={onTextChanged}
                            className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Nội dung</label>
                        <textarea
                            name="noiDung"
                            value={content}
                            onChange={onTextChanged}
                            className="border border-gray-300 rounded px-3 py-2 w-full resize-none h-[300px]"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Phương pháp giảng dạy</label>
                        <textarea
                            name="phuongPhapGiangDay"
                            value={formData.phuongPhapGiangDay}
                            onChange={onTextChanged}
                            className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Tài liệu tham khảo</label>
                        <textarea
                            name="taiLieuThamKhao"
                            value={formData.taiLieuThamKhao}
                            onChange={onTextChanged}
                            className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Trạng thái</label>
                        <select
                            name="trangThai"
                            value={formData.trangThai}
                            onChange={onStatusChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
                            required>
                                <option>Đã duyệt</option>
                                <option>Chưa duyệt</option>
                        </select>
                    </div>
                    <label className="block text-base font-medium mb-1 mt-10">Cột điểm</label>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold mb-4"></h1>
                        <div className="mb-4">
                          <button className="bg-[#333333] text-white font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
                                  type="button"
                                  onClick={e => openAddScoreModal()}>
                            <FontAwesomeIcon icon={faSquarePlus} />
                            Thêm cột điểm
                          </button>
                        </div>
                    </div>
                    {ScoreTable}
                    <div className="flex gap-2 mt-3">
                        <button type="submit"
                                onClick={onSubmit}
                                disabled={isSubmit}
                                className="bg-[#333333] text-white px-4 py-2 rounded w-full">
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
            {isOpenAddScore && (
                <AddScoreModal data={{
                                    decuongId: model.id,
                                    remainPercentage: remainPercentage
                                }} 
                               onClose={ () => setIsOpenAddScore(false) }
                               onAdd={ () => {
                                setIsOpenAddScore(false);
                                setRefreshTrigger((prev) => prev + 1);
                               }}>

                </AddScoreModal>
            )}

            {isOpenUpdate && selectedModel && (
                <UpdateScoreModal data={selectedModel}
                                  onClose={ () => setIsOpenUpdate(false) }
                                  onUpdate={ () => {
                                   setIsOpenUpdate(false);
                                   setRefreshTrigger((prev) => prev + 1);
                                  }}>

                </UpdateScoreModal>
            )}

            {notification && (
                <Notification message={notification.message}
                              type={notification.type} />
            )}
        </div>
    )
}

export default UpdateDetailedSyllabusModal;
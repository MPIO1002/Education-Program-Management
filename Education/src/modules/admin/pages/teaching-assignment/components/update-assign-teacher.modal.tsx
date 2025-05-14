import React, { useEffect, useState } from "react";
import Notification from "../../../../../components/notification";

interface PlanGroupJSON {
    id: number,
    maNhom: string,
    trangThai: string
}

interface TeacherJSON {
    id: number,
    hoTen: string
}

interface UpdateAssignTeacherProps {
    model: {
        id: number,
        nhomId: number,
        planGroupName: string,
        giangVienId: number,
        vaiTro: string,
        soTiet: number
    }
    onClose: () => void;
    onUpdate: () => void;
}


const UpdateAssignTeacherModal: React.FC<UpdateAssignTeacherProps> = ({ model, onClose, onUpdate }) => {
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [isSubmit, setIsSubmit] = useState(true);
    

    // bruh i need get all method
    const planGroupsApi = "http://localhost:8080/api/plan-group?page=1&size=10000"
    const teacherApi = "http://localhost:8080/api/teachers?page=1&size=10000"
    const planGroupTeacherApi = "http://localhost:8080/api/plan-group-teacher?page=1&size=10000"

    const [formData, setFormData] = useState<{
        nhomId: number,
        giangVienId: number,
        vaiTro: string,
        soTiet: number
    }>({
        nhomId: model.nhomId,
        giangVienId: model.giangVienId,
        vaiTro: model.vaiTro,
        soTiet: model.soTiet
    });

    const [planGroups, setPlanGroups] = useState<PlanGroupJSON[]>();
    const [planGroupTeacher, setPlanGroupTeacher] = useState<string[]>();
    const [teachers, setTeachers] = useState<TeacherJSON[]>();

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if ((e.target as HTMLDivElement).id === 'modal-overlay') {
            onClose();
        }
    }

    useEffect(() => {
        fetchPlanGroups();
        fetchPlanGroupTeacher();
        fetchTeachers();

        setTimeout(() => setIsSubmit(false), 1000)
    }, [])

    useEffect(() => {
        var list = planGroups?.filter(item => {
            return !planGroupTeacher?.some(i => i === item.maNhom && i !== model.planGroupName);
        });
        setPlanGroups(list);
    }, [planGroupTeacher])

    useEffect(() => {
        if (!planGroups || planGroups.length == 0) return;
    }, [planGroups])

    useEffect(() => {
        if (!teachers || teachers.length == 0) return;
    }, [teachers])

    const fetchPlanGroups = async () => {
        try {
            const response = await fetch(planGroupsApi);
            if (!response.ok) {
              throw new Error('Failed to fetch plan groups');
            }
            const data = await response.json();

            if (data.listContent) {
                setPlanGroups(data.listContent.filter((item: any) => item.trangThai != "Đã kết thúc")
                                              .map((item: { id: number, maNhom: string, trangThai: string }) => ({
                    id: item.id,
                    maNhom: item.maNhom,
                    trangThai: item.trangThai
                })));
            } 
            else setPlanGroups([]);
        } 
        catch (error) {
            throw new Error('Failed to fetch plan groups');
        } 
    };

    const fetchPlanGroupTeacher = async () => {
        try {
            const response = await fetch(planGroupTeacherApi);
            if (!response.ok) {
              throw new Error('Failed to fetch plan group teacher');
            }
            const data = await response.json();

            if (data.listContent) {
                setPlanGroupTeacher(data.listContent.map((item: { planGroupName: string }) => item.planGroupName));
            } 
            else setPlanGroupTeacher([]);
        } 
        catch (error) {
            throw new Error('Failed to fetch plan group teacher');
        } 
    }

    const fetchTeachers = async () => {
        try {
            const response = await fetch(teacherApi);
            if (!response.ok) {
              throw new Error('Failed to fetch teacher');
            }
            const data = await response.json();

            if (data.listContent) {
                setTeachers(data.listContent.map((item: { id: number, hoTen: string }) => ({
                    id: item.id,
                    hoTen: item.hoTen
                })));
            } 
            else setTeachers([]);
        } 
        catch (error) {
            throw new Error('Failed to fetch teacher');
        } 
    }

    const onPlanGroupChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let id = parseInt(e.target.value);
        setFormData(prev => ({...prev, ["nhomId"]: id}))
    }

    const onTeacherChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let id = parseInt(e.target.value);
        setFormData(prev => ({...prev, ["giangVienId"]: id}))
    }

    const onRoleChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({...prev, ["vaiTro"]: e.target.value}))
    }

    const onSoTietChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value);
        value = value <= 0 ? 1 : value;

        setFormData(prev => ({...prev, ["soTiet"]: value}))
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmit(true);

        try {
            const response = await fetch(`http://localhost:8080/api/plan-group-teacher/${model.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Sửa thất bại');
            }

            setNotification({ message: result.message || 'Sửa thành công', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                onUpdate();
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

    return (
        <div id="modal-overlay"
             className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
             onClick={handleClose}>
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Phân công</h2>
                <form>
                    <label className="block text-sm font-medium mb-1">Mã Nhóm</label>
                    <select
                        name="maNhom"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={formData.nhomId}
                        onChange={onPlanGroupChanged}
                        required>
                            {planGroups?.map(item => (
                                <option key={item.id} value={item.id}>{item.maNhom}</option>
                            ))}
                    </select>
                    <label className="block text-sm font-medium mb-1 mt-4">Giảng viên</label>
                    <select
                        name="teacher"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        onChange={onTeacherChanged}
                        value={formData.giangVienId}
                        required>
                            {teachers?.map(item => (
                                <option key={item.id} value={item.id}>{item.hoTen}</option>
                            ))}
                    </select>
                    <label className="block text-sm font-medium mb-1 mt-4">Vai trò</label>
                    <select
                        name="role"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        onChange={onRoleChanged}
                        value={formData.vaiTro}
                        required>
                            <option key={"PT"} value={"Phụ trách"}>Phụ trách</option>
                            <option key={"S"} value={"Sửa"}>Sửa</option>
                    </select>
                    <label className="block text-sm font-medium mb-1 mt-4">Số tiết</label>
                    <input
                        name="role"
                        min={1}
                        type="number"
                        value={formData.soTiet}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        onChange={onSoTietChanged}
                        required>
                    </input>
                    <div className="flex gap-2 mt-3">
                        <button type="submit"
                                onClick={onSubmit}
                                disabled={isSubmit}
                                className="bg-[#333333] text-white px-4 py-2 rounded w-full">
                            Phân công
                        </button>
                    </div>
                </form>
            </div>
             {notification && (
                <Notification message={notification.message}
                              type={notification.type} />
            )}
        </div>
    )
}

export default UpdateAssignTeacherModal;
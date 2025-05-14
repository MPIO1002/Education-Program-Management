import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface UpdateTeachingPlanModalProps {
    teachingPlanData: {
        maHp: string | number | readonly string[] | undefined;
        id: number;
        generalInfoId: number;
        courseId: number;
        hocKy: string;
        namHoc: string;
    };
    onClose: () => void;
    onTeachingPlanUpdated: () => void;
}

const UpdateTeachingPlanModal: React.FC<UpdateTeachingPlanModalProps> = ({ teachingPlanData, onClose, onTeachingPlanUpdated }) => {
    const [formData, setFormData] = useState(teachingPlanData);
    const [generalInfoList, setGeneralInfoList] = useState<{ id: number; tenCtdt: string }[]>([]);
    const [courseName, setCourseName] = useState('');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    useEffect(() => {
        // Fetch danh sách CTDT
        const fetchGeneralInfo = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/general-info?page=1&size=100');
                if (!response.ok) {
                    throw new Error('Failed to fetch general info');
                }
                const result = await response.json();
                const generalInfo = result.listContent.map((info: { id: number; tenCtdt: string }) => ({
                    id: info.id,
                    tenCtdt: info.tenCtdt,
                }));
                setGeneralInfoList(generalInfo || []);
            } catch (error) {
                console.error('Error fetching general info:', error);
                setGeneralInfoList([]);
            }
        };

        fetchGeneralInfo();
    }, []);

    useEffect(() => {
        // Fetch course details when courseId changes
        const fetchCourseDetails = async () => {
            if (!formData.courseId) return;

            try {
                const response = await fetch(`http://localhost:8080/api/courses/${formData.courseId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch course details');
                }
                const result = await response.json();
                if (result.sucess && result.result) {
                    setCourseName(result.result.tenHp); // Hiển thị tên học phần
                } else {
                    setNotification({ message: 'Không tìm thấy thông tin học phần', type: 'warning' });
                    setCourseName('');
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
                setNotification({ message: 'Lỗi khi lấy thông tin học phần', type: 'error' });
                setCourseName('');
            }
        };

        fetchCourseDetails();
    }, [formData.courseId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { generalInfoId, courseId, hocKy, namHoc } = formData;
        if (!generalInfoId || !courseId || !hocKy || !namHoc) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/teaching-plan/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    generalInfoId,
                    courseId,
                    hocKy: parseInt(hocKy, 10),
                    namHoc: parseInt(namHoc, 10),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update teaching plan');
            }

            setNotification({ message: result.message || 'Cập nhật kế hoạch dạy học thành công!', type: 'success' });

            setTimeout(() => {
                onTeachingPlanUpdated(); // Notify parent to refresh the table
                onClose(); // Close the modal
            }, 2000);
        } catch (error: any) {
            console.error('Error updating teaching plan:', error);
            setNotification({ message: error.message || 'Cập nhật kế hoạch dạy học thất bại. Vui lòng thử lại.', type: 'error' });

            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <>
            <div
                id="modal-overlay"
                className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
                onClick={handleOutsideClick}
            >
                <div className="bg-white p-6 rounded shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl font-bold mb-4">Cập nhật kế hoạch dạy học</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Chương trình đào tạo</label>
                            <select
                                name="generalInfoId"
                                value={formData.generalInfoId}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            >
                                <option value={0}>Chọn CTĐT</option>
                                {generalInfoList.map((info) => (
                                    <option key={info.id} value={info.id}>
                                        {info.tenCtdt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mã học phần</label>
                            <input
                                type="text"
                                name="maHp"
                                value={formData.maHp}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tên học phần</label>
                            <input
                                type="text"
                                value={courseName}
                                readOnly
                                className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Học kỳ</label>
                            <input
                                type="number"
                                name="hocKy"
                                value={formData.hocKy}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Năm học</label>
                            <input
                                type="number"
                                name="namHoc"
                                value={formData.namHoc}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-[#333333] text-white px-4 py-2 rounded w-full"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}
        </>
    );
};

export default UpdateTeachingPlanModal;
import React, { useState } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface AddTeacherModalProps {
    onClose: () => void;
    onTeacherAdded: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ onClose, onTeacherAdded }) => {
    const [formData, setFormData] = useState({
        maGv: '',
        hoTen: '',
        boMon: '',
        khoa: '',
        trinhDo: '',
        chuyenMon: '',
        trangThai: '',
        namSinh: '',
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { maGv, hoTen, boMon, khoa, trinhDo, chuyenMon, trangThai, namSinh } = formData;
        if (!maGv || !hoTen || !boMon || !khoa || !trinhDo || !chuyenMon || !trangThai || !namSinh) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }
        const formattedNamSinh = new Date(namSinh).toISOString();

        const dataToSend = {
            ...formData,
            namSinh: formattedNamSinh, // Sử dụng định dạng ISO 8601
        };
        console.log('Data to send:', dataToSend);

        try {
            const response = await fetch('http://localhost:8080/api/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add teacher');
            }

            setNotification({ message: result.message || 'Thêm giảng viên thành công!', type: 'success' });

            setTimeout(() => {
                onTeacherAdded(); // Notify parent to refresh the table
                onClose(); // Close the modal
            }, 2000);
        } catch (error: any) {
            console.error('Error adding teacher:', error);
            setNotification({ message: error.message || 'Thêm thất bại. Vui lòng thử lại.', type: 'error' });

            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'modal-overlay') {
            onClose(); // Đóng modal nếu click ra ngoài
        }
    };

    return (
        <>
            <div
                id="modal-overlay"
                className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
                onClick={handleOutsideClick} // Xử lý click ra ngoài
            >
                <div className="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 className="text-xl font-bold mb-4">Thêm giảng viên</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mã GV</label>
                            <input
                                type="text"
                                name="maGv"
                                value={formData.maGv}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Họ tên</label>
                            <input
                                type="text"
                                name="hoTen"
                                value={formData.hoTen}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Bộ môn</label>
                            <input
                                type="text"
                                name="boMon"
                                value={formData.boMon}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Khoa</label>
                            <input
                                type="text"
                                name="khoa"
                                value={formData.khoa}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Trình độ</label>
                            <input
                                type="text"
                                name="trinhDo"
                                value={formData.trinhDo}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Chuyên môn</label>
                            <input
                                type="text"
                                name="chuyenMon"
                                value={formData.chuyenMon}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Trạng thái</label>
                            <input
                                type="text"
                                name="trangThai"
                                value={formData.trangThai}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Năm sinh</label>
                            <input
                                type="date"
                                name="namSinh"
                                value={formData.namSinh}
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
                                Thêm
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

export default AddTeacherModal;
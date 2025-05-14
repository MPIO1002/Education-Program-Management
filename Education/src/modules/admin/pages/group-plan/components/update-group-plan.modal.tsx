import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification';

interface UpdateGroupPlanModalProps {
    groupPlanData: {
        id: number;
        maNhom: string;
        hocPhanID: number;
        namHoc: string;
        hocKy: number;
        soLuongSv: number;
        thoiGianBatDau: string;
        thoiGianKetThuc: string;
        trangThai: string;
    };
    onClose: () => void;
    onGroupPlanUpdated: () => void;
}

const UpdateGroupPlanModal: React.FC<UpdateGroupPlanModalProps> = ({ groupPlanData, onClose, onGroupPlanUpdated }) => {
    const [formData, setFormData] = useState(groupPlanData);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // const today = new Date();
        // const startDate = new Date(formData.thoiGianBatDau);

        // // Validate thời gian bắt đầu và kết thúc
        // if (startDate < today) {
        //     setNotification({ message: 'Thời gian bắt đầu không được nằm trong quá khứ', type: 'warning' });
        //     return;
        // }
        // if (startDate >= new Date(formData.thoiGianKetThuc)) {
        //     setNotification({ message: 'Thời gian bắt đầu phải trước thời gian kết thúc', type: 'warning' });
        //     return;
        // }

        try {
            const response = await fetch(`http://localhost:8080/api/plan-group/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hocPhanID: formData.hocPhanID,
                    namHoc: formData.namHoc,
                    hocKy: parseInt(formData.hocKy.toString(), 10),
                    soLuongSv: parseInt(formData.soLuongSv.toString(), 10),
                    thoiGianBatDau: formData.thoiGianBatDau,
                    thoiGianKetThuc: formData.thoiGianKetThuc,
                    trangThai: formData.trangThai,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update group plan');
            }

            setNotification({ message: 'Cập nhật kế hoạch mở nhóm thành công!', type: 'success' });
            setTimeout(() => {
                onGroupPlanUpdated();
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error updating group plan:', error);
            setNotification({ message: 'Lỗi khi cập nhật kế hoạch mở nhóm', type: 'error' });
        }
    };

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
            onClick={(e) => {
                if ((e.target as HTMLDivElement).id === 'modal-overlay') onClose();
            }}
        >
            <div className="bg-white p-6 rounded shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Cập nhật kế hoạch mở nhóm</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Mã nhóm</label>
                        <input
                            type="text"
                            value={formData.maNhom}
                            readOnly
                            className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Năm học</label>
                        <input
                            type="text"
                            name="namHoc"
                            value={formData.namHoc}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
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
                            min={1}
                            max={3}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Số lượng sinh viên</label>
                        <input
                            type="number"
                            name="soLuongSv"
                            value={formData.soLuongSv}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            min={1}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Thời gian bắt đầu</label>
                        <input
                            type="date"
                            name="thoiGianBatDau"
                            value={formData.thoiGianBatDau}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Thời gian kết thúc</label>
                        <input
                            type="date"
                            name="thoiGianKetThuc"
                            value={formData.thoiGianKetThuc}
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
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        >
                            Cập nhật
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded w-full"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default UpdateGroupPlanModal;
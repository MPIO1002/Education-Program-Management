import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification';

interface AddGroupPlanModalProps {
    onClose: () => void;
    onGroupPlanAdded: () => void;
}

const AddGroupPlanModal: React.FC<AddGroupPlanModalProps> = ({ onClose, onGroupPlanAdded }) => {
    const [formData, setFormData] = useState({
        hocPhanID: 0,
        namHoc: '',
        hocKy: 0,
        soLuongSv: 0,
        thoiGianBatDau: '',
        thoiGianKetThuc: '',
        trangThai: '',
    });
    const [hocPhanList, setHocPhanList] = useState<{ id: number; maHp: string; tenHp: string }[]>([]);
    const [selectedHocPhan, setSelectedHocPhan] = useState('');
    const [soLuongNhom, setSoLuongNhom] = useState(1);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [existingGroups, setExistingGroups] = useState<string[]>([]);

    useEffect(() => {
        // Fetch danh sách học phần
        const fetchHocPhan = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/courses?page=1&size=100');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const result = await response.json();
                setHocPhanList(result.listContent || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setNotification({ message: 'Lỗi khi lấy danh sách học phần', type: 'error' });
            }
        };

        fetchHocPhan();
    }, []);

    useEffect(() => {
        // Fetch danh sách nhóm đã tồn tại cho học phần được chọn
        const fetchExistingGroups = async () => {
            if (!selectedHocPhan) return;

            try {
                const response = await fetch(`http://localhost:8080/api/plan-group?maHp=${selectedHocPhan}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch existing groups');
                }
                const result = await response.json();
                const groups = result.listContent
                    .filter(
                        (group: any) =>
                            group.thoiGianBatDau === formData.thoiGianBatDau &&
                            group.thoiGianKetThuc === formData.thoiGianKetThuc
                    )
                    .map((group: any) => group.maNhom);
                setExistingGroups(groups);
            } catch (error) {
                console.error('Error fetching existing groups:', error);
                setNotification({ message: 'Lỗi khi lấy danh sách nhóm đã tồn tại', type: 'error' });
            }
        };

        fetchExistingGroups();
    }, [selectedHocPhan, formData.thoiGianBatDau, formData.thoiGianKetThuc]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date();
        const startDate = new Date(formData.thoiGianBatDau);

        // Validate thời gian bắt đầu và kết thúc
        if (startDate < today) {
            setNotification({ message: 'Thời gian bắt đầu không được nằm trong quá khứ', type: 'warning' });
            return;
        }
        if (new Date(formData.thoiGianBatDau) >= new Date(formData.thoiGianKetThuc)) {
            setNotification({ message: 'Thời gian bắt đầu phải trước thời gian kết thúc', type: 'warning' });
            return;
        }

        if (!selectedHocPhan || soLuongNhom <= 0) {
            setNotification({ message: 'Hãy chọn học phần và số lượng nhóm hợp lệ', type: 'warning' });
            return;
        }

        const hocPhan = hocPhanList.find((hp) => hp.maHp === selectedHocPhan);
        if (!hocPhan) {
            setNotification({ message: 'Học phần không hợp lệ', type: 'error' });
            return;
        }

        // Tìm số thứ tự nhóm tiếp theo
        const existingNumbers = existingGroups.map((group) => {
            const parts = group.split('.');
            return parseInt(parts[1], 10);
        });
        const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

        const requests = Array.from({ length: soLuongNhom }, (_, index) => {
            const maNhom = `${selectedHocPhan}.${String(maxNumber + index + 1).padStart(2, '0')}`;
            return {
                maNhom,
                hocPhanID: hocPhan.id,
                namHoc: formData.namHoc,
                hocKy: parseInt(formData.hocKy.toString(), 10),
                soLuongSv: parseInt(formData.soLuongSv.toString(), 10),
                thoiGianBatDau: formData.thoiGianBatDau,
                thoiGianKetThuc: formData.thoiGianKetThuc,
                trangThai: formData.trangThai,
            };
        });

        try {
            const responses = await Promise.all(
                requests.map((request) =>
                    fetch('http://localhost:8080/api/plan-group', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(request),
                    })
                )
            );

            if (responses.every((res) => res.ok)) {
                setNotification({ message: 'Thêm kế hoạch mở nhóm thành công!', type: 'success' });
                setTimeout(() => {
                    onGroupPlanAdded(); // Notify parent to refresh the table
                    onClose(); // Close the modal
                }, 2000);

            } else {
                throw new Error('Failed to add some group plans');
            }
        } catch (error) {
            console.error('Error adding group plans:', error);
            setNotification({ message: 'Lỗi khi thêm kế hoạch mở nhóm', type: 'error' });
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
                <h2 className="text-xl font-bold mb-4">Thêm kế hoạch mở nhóm</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Học phần</label>
                        <select
                            value={selectedHocPhan}
                            onChange={(e) => setSelectedHocPhan(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        >
                            <option value="">Chọn học phần</option>
                            {hocPhanList.map((hp) => (
                                <option key={hp.id} value={hp.maHp}>
                                    {hp.maHp} - {hp.tenHp}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Số lượng nhóm</label>
                        <input
                            type="number"
                            value={soLuongNhom}
                            onChange={(e) => setSoLuongNhom(parseInt(e.target.value, 10))}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            min={1}
                            required
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
                            Thêm
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

export default AddGroupPlanModal;
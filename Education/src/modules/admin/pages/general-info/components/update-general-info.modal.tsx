import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface UpdateGeneralInfoModalProps {
    id: number;
    onClose: () => void;
    onGeneralInfoUpdated: () => void;
}

const UpdateGeneralInfoModal: React.FC<UpdateGeneralInfoModalProps> = ({ id, onClose, onGeneralInfoUpdated }) => {
    const [formData, setFormData] = useState({
        id: 0,
        maCtdt: '',
        tenCtdt: '',
        nganh: '',
        maNganh: '',
        khoaQuanLy: '',
        heDaoTao: '',
        trinhDo: '',
        tongTinChi: 0,
        thoiGianDaoTao: '',
        namBanHanh: 0,
        trangThai: '',
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    useEffect(() => {
        const fetchGeneralInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/general-info/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch general info');
                }
                const data = await response.json();
                if (data.sucess) {
                    setFormData(data.result);
                } else {
                    throw new Error(data.message || 'Failed to fetch general info');
                }
            } catch (error) {
                console.error('Error fetching general info:', error);
                setNotification({ message: 'Không thể tải thông tin chung', type: 'error' });
            }
        };

        fetchGeneralInfo();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { maCtdt, tenCtdt, nganh, maNganh, khoaQuanLy, heDaoTao, trinhDo, tongTinChi, thoiGianDaoTao, namBanHanh, trangThai } = formData;
    
        // Kiểm tra các trường bắt buộc
        if (!maCtdt || !tenCtdt || !nganh || !maNganh || !khoaQuanLy || !heDaoTao || !trinhDo || !tongTinChi || !thoiGianDaoTao || !namBanHanh || !trangThai) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }
    
        try {
            // Kiểm tra xem `maCtdt` đã tồn tại chưa (ngoại trừ chính nó)
            const checkResponse = await fetch(`http://localhost:8080/api/general-info/check?maCtdt=${maCtdt}`);
            const checkResult = await checkResponse.json();
    
            if (!checkResponse.ok || (checkResult.exists && checkResult.id !== formData.id)) {
                setNotification({ message: 'Mã CTĐT đã tồn tại', type: 'error' });
                return;
            }
    
            // Gửi dữ liệu nếu `maCtdt` chưa tồn tại hoặc là của chính nó
            const response = await fetch(`http://localhost:8080/api/general-info/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update general info');
            }
    
            setNotification({ message: result.message || 'Cập nhật thông tin chung thành công!', type: 'success' });
    
            setTimeout(() => {
                onGeneralInfoUpdated(); // Notify parent to refresh the table
                onClose(); // Close the modal
            }, 2000);
        } catch (error: any) {
            console.error('Error updating general info:', error);
            setNotification({ message: error.message || 'Cập nhật thất bại. Vui lòng thử lại.', type: 'error' });
    
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
                <div className="bg-white p-6 rounded shadow-lg w-2/3" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl font-bold mb-4">Cập nhật thông tin chung</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Mã CTĐT</label>
                                <input
                                    type="text"
                                    name="maCtdt"
                                    value={formData.maCtdt}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tên CTĐT</label>
                                <input
                                    type="text"
                                    name="tenCtdt"
                                    value={formData.tenCtdt}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Ngành</label>
                                <input
                                    type="text"
                                    name="nganh"
                                    value={formData.nganh}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Mã ngành</label>
                                <input
                                    type="text"
                                    name="maNganh"
                                    value={formData.maNganh}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Khoa quản lý</label>
                                <input
                                    type="text"
                                    name="khoaQuanLy"
                                    value={formData.khoaQuanLy}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Hệ đào tạo</label>
                                <input
                                    type="text"
                                    name="heDaoTao"
                                    value={formData.heDaoTao}
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
                                <label className="block text-sm font-medium mb-1">Tổng tín chỉ</label>
                                <input
                                    type="number"
                                    name="tongTinChi"
                                    value={formData.tongTinChi}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Thời gian đào tạo</label>
                                <input
                                    type="text"
                                    name="thoiGianDaoTao"
                                    value={formData.thoiGianDaoTao}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Năm ban hành</label>
                                <input
                                    type="number"
                                    name="namBanHanh"
                                    value={formData.namBanHanh}
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

export default UpdateGeneralInfoModal;
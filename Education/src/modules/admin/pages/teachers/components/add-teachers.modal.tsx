import React, { useState } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface AddTeacherModalProps {
    onClose: () => void;
    onTeacherAdded: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ onClose, onTeacherAdded }) => {
    const [formData, setFormData] = useState({
        account: {
            username: '',
            password: '',
            email: '',
            soDienThoai: '',
            vaiTro: 'admin', // Giá trị mặc định
        },
        teacher: {
            maGv: '',
            hoTen: '',
            boMon: '',
            khoa: '',
            trinhDo: 'Thạc sĩ', // Giá trị mặc định
            chuyenMon: '',
            trangThai: '',
            namSinh: '',
        },
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.'); // Tách `account.username` thành `account` và `username`
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section as 'account' | 'teacher'],
                [field]: value,
            },
        }));
    };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { account, teacher } = formData;
    
        // Kiểm tra các trường bắt buộc
        if (
            !account.username ||
            !account.password ||
            !account.email ||
            !account.soDienThoai ||
            !teacher.maGv ||
            !teacher.hoTen ||
            !teacher.boMon ||
            !teacher.khoa ||
            !teacher.trinhDo ||
            !teacher.chuyenMon ||
            !teacher.trangThai ||
            !teacher.namSinh
        ) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }
    
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(account.email)) {
            setNotification({ message: 'Email không hợp lệ', type: 'warning' });
            return;
        }
    
        // Validate số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(account.soDienThoai)) {
            setNotification({ message: 'Số điện thoại không hợp lệ', type: 'warning' });
            return;
        }
    
        try {
            // Kiểm tra xem `maGv`, `username`, `email`, và `soDienThoai` đã tồn tại chưa
            const checkResponse = await fetch('http://localhost:8080/api/teachers/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maGv: teacher.maGv,
                    username: account.username,
                    email: account.email,
                    soDienThoai: account.soDienThoai,
                }),
            });
    
            const checkResult = await checkResponse.json();
    
            if (!checkResponse.ok || checkResult.exists) {
                setNotification({ message: checkResult.message || 'Thông tin đã tồn tại', type: 'error' });
                return;
            }
    
            // Format ngày sinh
            const formattedNamSinh = new Date(teacher.namSinh).toISOString();
    
            const dataToSend = {
                account: {
                    ...account,
                    trangThai: 0, // Mặc định trạng thái là 0
                },
                teacher: {
                    ...teacher,
                    namSinh: formattedNamSinh, // Sử dụng định dạng ISO 8601
                },
            };
    
            // Gửi dữ liệu
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
                <div className="bg-white p-6 rounded shadow-lg w-2/3">
                    <h2 className="text-xl font-bold mb-4">Thêm giảng viên</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Cột 1: Thông tin tài khoản */}
                            <div>
                                <h3 className="text-lg font-bold mb-2">Thông tin tài khoản</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        name="account.username"
                                        value={formData.account.username}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="account.password"
                                        value={formData.account.password}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="account.email"
                                        value={formData.account.email}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="account.soDienThoai"
                                        value={formData.account.soDienThoai}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Vai trò</label>
                                    <input
                                        type="text"
                                        name="account.vaiTro"
                                        value={formData.account.vaiTro}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Cột 2: Thông tin giảng viên */}
                            <div>
                                <h3 className="text-lg font-bold mb-2">Thông tin giảng viên</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Mã GV</label>
                                    <input
                                        type="text"
                                        name="teacher.maGv"
                                        value={formData.teacher.maGv}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Họ tên</label>
                                    <input
                                        type="text"
                                        name="teacher.hoTen"
                                        value={formData.teacher.hoTen}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Bộ môn</label>
                                    <input
                                        type="text"
                                        name="teacher.boMon"
                                        value={formData.teacher.boMon}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Khoa</label>
                                    <input
                                        type="text"
                                        name="teacher.khoa"
                                        value={formData.teacher.khoa}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Trình độ</label>
                                    <select
                                        name="teacher.trinhDo"
                                        value={formData.teacher.trinhDo}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    >
                                        <option value="Thạc sĩ">Thạc sĩ</option>
                                        <option value="Tiến sĩ">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Chuyên môn</label>
                                    <input
                                        type="text"
                                        name="teacher.chuyenMon"
                                        value={formData.teacher.chuyenMon}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                    <input
                                        type="text"
                                        name="teacher.trangThai"
                                        value={formData.teacher.trangThai}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Năm sinh</label>
                                    <input
                                        type="date"
                                        name="teacher.namSinh"
                                        value={formData.teacher.namSinh}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                            </div>
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
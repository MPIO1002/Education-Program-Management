import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface UpdateTeacherModalProps {
    teacherData: {
        id: number;
        maGv: string;
        hoTen: string;
        boMon: string;
        khoa: string;
        trinhDo: string;
        chuyenMon: string;
        trangThai: string;
        namSinh: string;
        accountId: number; // Thêm accountId từ teacher
    };
    onClose: () => void;
    onTeacherUpdated: () => void;
}

const UpdateTeacherModal: React.FC<UpdateTeacherModalProps> = ({ teacherData, onClose, onTeacherUpdated }) => {
    const [formData, setFormData] = useState(teacherData);
    const [accountData, setAccountData] = useState({
        id: 0,
        username: '',
        email: '',
        soDienThoai: '',
        vaiTro: '',
        trangThai: 1,
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    // Lấy thông tin account khi modal mở
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/accounts`);
                const result = await response.json();

                if (response.ok && result.sucess) {
                    const account = result.result.find((acc: any) => acc.id === teacherData.accountId);
                    if (account) {
                        setAccountData(account);
                    }
                } else {
                    throw new Error(result.message || 'Không thể lấy thông tin tài khoản');
                }
            } catch (error: any) {
                console.error('Error fetching account data:', error);
                setNotification({ message: error.message || 'Lỗi khi lấy thông tin tài khoản', type: 'error' });
            }
        };

        fetchAccountData();
    }, [teacherData.accountId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('account.')) {
            const field = name.split('.')[1];
            setAccountData((prev) => ({ ...prev, [field]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { maGv, namSinh } = formData;
        const { email, soDienThoai } = accountData;

        // Kiểm tra các trường bắt buộc
        if (
            !maGv ||
            !formData.hoTen ||
            !formData.boMon ||
            !formData.khoa ||
            !formData.trinhDo ||
            !formData.chuyenMon ||
            !formData.trangThai ||
            !namSinh ||
            !accountData.username ||
            !email ||
            !soDienThoai
        ) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setNotification({ message: 'Email không hợp lệ', type: 'warning' });
            return;
        }

        // Validate số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(soDienThoai)) {
            setNotification({ message: 'Số điện thoại không hợp lệ', type: 'warning' });
            return;
        }

        try {
            // Cập nhật thông tin teacher
            const formattedNamSinh = new Date(namSinh).toISOString();
            const teacherResponse = await fetch(`http://localhost:8080/api/teachers/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    namSinh: formattedNamSinh,
                }),
            });

            const teacherResult = await teacherResponse.json();

            if (!teacherResponse.ok) {
                throw new Error(teacherResult.message || 'Failed to update teacher');
            }

            // Cập nhật thông tin account
            const accountResponse = await fetch(`http://localhost:8080/api/accounts/${accountData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountData),
            });

            const accountResult = await accountResponse.json();

            if (!accountResponse.ok) {
                throw new Error(accountResult.message || 'Failed to update account');
            }

            setNotification({ message: 'Cập nhật giảng viên và tài khoản thành công!', type: 'success' });

            setTimeout(() => {
                onTeacherUpdated(); // Notify parent to refresh the table
                onClose(); // Close the modal
            }, 2000);
        } catch (error: any) {
            console.error('Error updating teacher or account:', error);
            setNotification({ message: error.message || 'Cập nhật thất bại. Vui lòng thử lại.', type: 'error' });

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
                    <h2 className="text-xl font-bold mb-4">Cập nhật giảng viên</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Cột 2: Thông tin tài khoản */}
                            <div>
                                <h3 className="text-lg font-bold mb-2">Thông tin tài khoản</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        name="account.username"
                                        value={accountData.username}
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
                                        value={accountData.email}
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
                                        value={accountData.soDienThoai}
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
                                        value={accountData.vaiTro}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                    <input
                                        type="number"
                                        name="account.trangThai"
                                        value={accountData.trangThai}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Cột 1: Thông tin giảng viên */}
                            <div>
                                <h3 className="text-lg font-bold mb-2">Thông tin giảng viên</h3>
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

export default UpdateTeacherModal;
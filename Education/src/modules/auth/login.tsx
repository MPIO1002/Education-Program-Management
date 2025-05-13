import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyAnimation from '../../components/animation';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Gọi API để lấy danh sách tài khoản
            const response = await fetch('http://localhost:8080/accounts');
            const data = await response.json();
            console.log(data);

            // Sửa lỗi: Kiểm tra đúng trường "sucess" thay vì "success"
            if (data.sucess) {
                // Kiểm tra xem username có tồn tại không
                const user = data.result.find(
                    (account: { username: string }) => account.username === username
                );

                if (user) {
                    // So sánh mật khẩu (nếu không mã hóa)
                    if (user.password === password) {
                        // Lưu trạng thái đăng nhập vào localStorage
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('userRole', user.vaiTro); // Lưu vai trò người dùng (nếu cần)
                        navigate('/general-info'); // Điều hướng đến trang chính
                    } else {
                        setError('Tên đăng nhập hoặc mật khẩu không đúng!');
                    }
                } else {
                    setError('Tên đăng nhập hoặc mật khẩu không đúng!');
                }
            } else {
                setError('Không thể kết nối đến máy chủ!');
            }
        } catch (err) {
            console.error(err);
            setError('Đã xảy ra lỗi, vui lòng thử lại sau!');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#1b4587]">
            <div className="flex bg-white rounded-lg shadow-md w-[1200px] overflow-hidden">
                {/* Form bên trái */}
                <div className="w-1/3 p-8">
                    <MyAnimation />
                    <h1 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h1>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>

                {/* Ảnh bên phải */}
                <div className="w-2/3">
                    <img
                        src="/school.png"
                        alt="School"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
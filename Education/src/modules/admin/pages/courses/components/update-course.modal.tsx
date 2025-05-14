import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface UpdateCourseModalProps {
    courseData: {
        id: number;
        tenHp: string;
        maHp: string;
        soTinChi: string;
        soTietLyThuyet: string;
        soTietThucHanh: string;
        loaiHp: string;
        hocPhanTienQuyet: string;
    };
    onClose: () => void;
    onCourseUpdated: () => void;
}

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({ courseData, onClose, onCourseUpdated }) => {
    const [formData, setFormData] = useState(courseData);
    const [allCourses, setAllCourses] = useState<{ maHp: string; tenHp: string }[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/courses?page=1&size=100');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const result = await response.json();
                const courses = result.listContent.map((course: { maHp: string; tenHp: string }) => ({
                    maHp: course.maHp,
                    tenHp: course.tenHp,
                }));
                setAllCourses(courses || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setAllCourses([]);
            }
        };

        fetchAllCourses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'hocPhanTienQuyet' && value.trim() !== '') {
            const filteredSuggestions = allCourses.filter((course) =>
                course.maHp.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.map((course) => `${course.maHp} - ${course.tenHp}`));
        } else if (name === 'hocPhanTienQuyet') {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const selectedMaHp = suggestion.split(' - ')[0]; // Lấy maHp từ chuỗi "maHp - tenHp"
        setFormData((prev) => ({ ...prev, hocPhanTienQuyet: selectedMaHp })); // Chỉ lưu maHp
        setSuggestions([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { tenHp, maHp, soTinChi, soTietLyThuyet, soTietThucHanh, loaiHp, hocPhanTienQuyet } = formData;
        if (!tenHp || !maHp || !soTinChi || !soTietLyThuyet || !soTietThucHanh || !loaiHp) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }
        // if (allCourses.some((course) => course.tenHp === tenHp)) {
        //     setNotification({ message: 'Tên học phần đã tồn tại', type: 'error' });
        //     return;
        // }

        // if (allCourses.some((course) => course.maHp === maHp)) {
        //     setNotification({ message: 'Mã học phần đã tồn tại', type: 'error' });
        //     return;
        // }

        if (hocPhanTienQuyet && !allCourses.some((course) => `${course.maHp}` === hocPhanTienQuyet)) {
            setNotification({ message: 'Học phần tiên quyết không tồn tại', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/courses/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update course');
            }

            setNotification({ message: result.message || 'Course updated successfully!', type: 'success' });

            setTimeout(() => {
                onCourseUpdated(); // Notify parent to refresh the table
                onClose(); // Close the modal
            }, 2000);
        } catch (error: any) {
            console.error('Error updating course:', error);
            setNotification({ message: error.message || 'Failed to update course. Please try again.', type: 'error' });

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
                    <h2 className="text-xl font-bold mb-4">Cập nhật học phần</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tên học phần</label>
                            <input
                                type="text"
                                name="tenHp"
                                value={formData.tenHp}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
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
                            <label className="block text-sm font-medium mb-1">Số tín chỉ</label>
                            <input
                                type="number"
                                name="soTinChi"
                                value={formData.soTinChi}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Số tiết lý thuyết</label>
                            <input
                                type="number"
                                name="soTietLyThuyet"
                                value={formData.soTietLyThuyet}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Số tiết thực hành</label>
                            <input
                                type="number"
                                name="soTietThucHanh"
                                value={formData.soTietThucHanh}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Loại học phần</label>
                            <select
                                name="loaiHp"
                                value={formData.loaiHp}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            >
                                <option value="">Chọn loại học phần</option>
                                <option value="Bắt buộc">Bắt buộc</option>
                                <option value="Tự chọn">Tự chọn</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Học phần tiên quyết</label>
                            <input
                                type="text"
                                name="hocPhanTienQuyet"
                                value={formData.hocPhanTienQuyet}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 max-h-40 w-80 overflow-y-auto z-10">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
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

export default UpdateCourseModal;
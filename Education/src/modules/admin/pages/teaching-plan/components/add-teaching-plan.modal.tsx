import React, { useState, useEffect } from 'react';
import Notification from '../../../../../components/notification'; // Adjust the path as needed

interface AddTeachingPlanModalProps {
    onClose: () => void;
    onTeachingPlanAdded: () => void;
}

const AddTeachingPlanModal: React.FC<AddTeachingPlanModalProps> = ({ onClose, onTeachingPlanAdded }) => {
    const [formData, setFormData] = useState({
        maHp: '',
        tenHp: '',
        soTinChi: '',
        hocKy: '',
        maHpTruoc: '',
    });

    const [allCourses, setAllCourses] = useState<{ maHp: string; tenHp: string }[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    useEffect(() => {
        const fetchAllCourses = async () => {
            setIsLoadingCourses(true);
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
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchAllCourses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'maHpTruoc' && value.trim() !== '') {
            const filteredSuggestions = allCourses.filter((course) =>
                course.maHp.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.map((course) => `${course.maHp} - ${course.tenHp}`));
        } else if (name === 'maHpTruoc') {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const selectedMaHp = suggestion.split(' - ')[0]; // Lấy maHp từ chuỗi "maHp - tenHp"
        setFormData((prev) => ({ ...prev, maHpTruoc: selectedMaHp })); // Chỉ lưu maHp
        setSuggestions([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { maHp, tenHp, soTinChi, hocKy, maHpTruoc } = formData;
        if (!maHp || !tenHp || !soTinChi || !hocKy) {
            setNotification({ message: 'Hãy điền đầy đủ thông tin', type: 'warning' });
            return;
        }
        if (maHpTruoc && !allCourses.some((course) => `${course.maHp}` === maHpTruoc)) {
            setNotification({ message: 'Mã học phần trước không tồn tại', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/teaching-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add teaching plan');
            }

            setNotification({ message: result.message || 'Teaching plan added successfully!', type: 'success' });

            setTimeout(() => {
                onTeachingPlanAdded(); // Notify parent to refresh the table
                onClose(); // Close the modal
            }, 2000);
        } catch (error: any) {
            console.error('Error adding teaching plan:', error);
            setNotification({ message: error.message || 'Failed to add teaching plan. Please try again.', type: 'error' });

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
                    <h2 className="text-xl font-bold mb-4">Thêm kế hoạch dạy học</h2>
                    <form onSubmit={handleSubmit}>
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
                                name="tenHp"
                                value={formData.tenHp}
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
                            <label className="block text-sm font-medium mb-1">Học kỳ</label>
                            <input
                                type="text"
                                name="hocKy"
                                value={formData.hocKy}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mã học phần trước</label>
                            <input
                                type="text"
                                name="maHpTruoc"
                                value={formData.maHpTruoc}
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

export default AddTeachingPlanModal;
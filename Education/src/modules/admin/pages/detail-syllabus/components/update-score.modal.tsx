import React, { useEffect, useRef, useState } from "react";
import Notification from "../../../../../components/notification";

interface UpdateScoreModalProps {
    data: {
        id: number,
        decuongId: number,
        tenCotDiem: string,
        tyLePhanTram: number,
        hinhThuc: string,
        remainPercentage: number
    }

    onClose: () => void;
    onUpdate: () => void;
}


const UpdateScoreModal: React.FC<UpdateScoreModalProps> = ({ data, onClose, onUpdate }) => {
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const isAddPercent = useRef(false);

    const [formData, setFormData] = useState<{
        decuongId: number,
        tenCotDiem: string,
        tyLePhanTram: number,
        hinhThuc: string
    }>({
        decuongId: data.decuongId,
        tenCotDiem: data.tenCotDiem,
        tyLePhanTram: data.tyLePhanTram,
        hinhThuc: data.hinhThuc
    })

    useEffect(() => {
        if (isAddPercent.current) return;

        data.remainPercentage += data.tyLePhanTram;
        isAddPercent.current = true;
    }, [])

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if ((e.target as HTMLDivElement).id === 'modal-overlay') {
            onClose();
        }
    }
    
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let name = e.target.name;

        if (name == "tyLePhanTram") {
            let per = parseInt(value);
            per = per > data.remainPercentage ? data.remainPercentage : per;
            per = per <= 0 ? 1 : per;

            setFormData(prev => ({ ...prev, [name]: per }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const validate = () => {
        if (formData.tenCotDiem.length == 0) {
            setNotification({ message: 'Tên cột điểm bị trống', type: 'warning' });
            return false;
        }

        if (formData.hinhThuc.length == 0) {
            setNotification({ message: 'Hình thức bị trống', type: 'warning' });
            return false;
        }

        return true;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmit(true);

        if (!validate()) {
            setTimeout(() => {
                setNotification(null);
                setIsSubmit(false);
            }, 3000);
        }

        try {
            const response = await fetch(`http://localhost:8080/api/scores/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Thêm thất bại');
            }

            setNotification({ message: result.message || 'Thêm thành công', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                onUpdate();
            }, 3000);
        }
        catch (e: any) {
            setNotification({ message: e.message || 'Failed to crete. Please try again.', type: 'error' });
            setIsSubmit(false);

            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
        
    }

    return (
        <div id="modal-overlay"
             className="fixed inset-0 bg-[#0000003b] flex items-center justify-center"
             onClick={handleClose}>
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Cập nhật cột điểm</h2>
                <form>
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium mb-1">Tên cột điểm</label>
                        <input
                            type="text"
                            name="tenCotDiem"
                            onChange={onFieldChange}
                            value={formData.tenCotDiem}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Tỷ lệ phần trăm</label>
                        <input
                            type="number"
                            max={data.remainPercentage}
                            min={1}
                            name="tyLePhanTram"
                            onChange={onFieldChange}
                            value={formData.tyLePhanTram}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required />
                        <label className="block text-sm font-medium mb-1 mt-2">Hình thức</label>
                        <input
                            type="text"
                            name="hinhThuc"
                            value={formData.hinhThuc}
                            onChange={onFieldChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button type="submit"
                                onClick={onSubmit}
                                disabled={isSubmit}
                                className="bg-[#333333] text-white px-4 py-2 rounded w-full">
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
             {notification && (
                <Notification message={notification.message}
                              type={notification.type} />
            )}
        </div>
    )
}

export default UpdateScoreModal;
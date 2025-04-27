import React, { useEffect, useState } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number; // Duration in milliseconds
    onClose?: () => void; // Optional callback when notification closes
}

const Notification: React.FC<NotificationProps> = ({ message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border border-green-400 text-green-800';
            case 'error':
                return 'bg-red-50 border border-red-400 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border border-yellow-400 text-yellow-800';
            default:
                return 'bg-blue-50 border border-blue-400 text-blue-800';
        }
    };

    const getIcon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                />
            </svg>
        );
    };

    return (
        <div
            className={`fixed top-4 right-4 p-4 rounded shadow-lg text-sm flex justify-between items-center animate-slide-in ${getStyles()}`}
            style={{ animation: 'slide-in 0.5s ease-out' }}
        >
            <div className="flex items-center">
                {getIcon()}
                <p>
                    <span className="font-bold capitalize">{type}:</span> {message}
                </p>
            </div>
            <div
                className="cursor-pointer"
                onClick={() => {
                    setIsVisible(false);
                    if (onClose) onClose();
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Notification;
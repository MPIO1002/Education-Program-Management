import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
    return (
        <nav className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
            <div className="flex items-center">
                <img src="/src/assets/images/sgu-logo.png" alt="Logo" className="h-10" />
            </div>
            <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faGear} className="text-gray-600 text-xl cursor-pointer" />
                <img
                    src="/src/assets/images/avatar-admin.png"
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                />
            </div>
        </nav>
    );
};

export default Navbar;
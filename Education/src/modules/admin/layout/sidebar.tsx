import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTable, faBook, faScroll, faCalendarDays, faUserGroup, faPrint, faChalkboardUser, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: faEnvelope, text: 'Thông tin chung', path: '/general-info' },
    { icon: faBook, text: 'Học phần', path: '/courses' },
    { icon: faScroll, text: 'Đề cương chi tiết', path: '/detailed-syllabus' },
    { icon: faCalendarDays, text: 'Kế hoạch dạy học', path: '/teaching-plan' },
    { icon: faUserGroup, text: 'Kế hoạch mở nhóm', path: '/group-plan' },
    { icon: faTable, text: 'Phân công giảng dạy', path: '/teaching-assignment' },
    { icon: faPrint, text: 'Mẫu in', path: '/print-templates' },
    { icon: faChalkboardUser, text: 'Giảng viên', path: '/teachers' },
  ];

  return (
    <div
      className={`bg-[#1b4587] text-white transition-all duration-300 ${
        isExpanded ? 'w-60' : 'w-17'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col ml-1.5 mr-2 items-center py-4 gap-8">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex items-center w-full px-4 py-2 hover:bg-blue-950 rounded-lg cursor-pointer transition-colors duration-300"
          >
            <FontAwesomeIcon icon={item.icon} className="text-xl" />
            {isExpanded && <span className="ml-4 text-sm">{item.text}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
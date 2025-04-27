import React from 'react';
import Navbar from './layout/navbar';
import Sidebar from './layout/sidebar';
import { LayoutProps } from '../../types/layout';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
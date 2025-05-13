import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import các trang
import GeneralInfo from '../pages/general-info';
import Courses from '../pages/courses';
import DetailedSyllabus from '../pages/detail-syllabus';
import TeachingPlan from '../pages/teaching-plan';
import GroupPlan from '../pages/group-plan';
import PrintTemplates from '../pages/print';
import Teachers from '../pages/teachers';
import Login from '../../auth/login';
import ProtectedRoute from '../../../components/protected-route';

const Navigate: React.FC = () => {
  const location = useLocation();

  // Kiểm tra nếu đang ở trang login
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {isLoginPage ? (
        <Routes>
          {/* Route cho trang Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <div className="flex-1 p-4">
          <Routes>
            {/* Các route được bảo vệ */}
            <Route
              path="/general-info"
              element={
                <ProtectedRoute>
                  <GeneralInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail-syllabus"
              element={
                <ProtectedRoute>
                  <DetailedSyllabus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teaching-plan"
              element={
                <ProtectedRoute>
                  <TeachingPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group-plan"
              element={
                <ProtectedRoute>
                  <GroupPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/print"
              element={
                <ProtectedRoute>
                  <PrintTemplates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <ProtectedRoute>
                  <Teachers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
};

export default Navigate;
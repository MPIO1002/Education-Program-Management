import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your page components
import GeneralInfo from '../pages/general-info';
import ProgramFramework from '../pages/program-frame';
import Courses from '../pages/courses';
import DetailedSyllabus from '../pages/detail-syllabus';
import TeachingPlan from '../pages/teaching-plan';
import GroupPlan from '../pages/group-plan';
import PrintTemplates from '../pages/print';
import Lecturers from '../pages/teachers';

const Navigate: React.FC = () => {
  return (
    <div className="flex-1 p-4">
      <Routes>
        <Route path="/general-info" element={<GeneralInfo />} />
        <Route path="/program-frame" element={<ProgramFramework />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/detail-syllabus" element={<DetailedSyllabus />} />
        <Route path="/teaching-plan" element={<TeachingPlan />} />
        <Route path="/group-plan" element={<GroupPlan />} />
        <Route path="/print" element={<PrintTemplates />} />
        <Route path="/teachers" element={<Lecturers />} />
      </Routes>
    </div>
  );
};

export default Navigate;
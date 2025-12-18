
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ArchivePage from './components/ArchivePage';
import StudioPage from './components/StudioPage';
import { Project } from './types';
import { SAMPLE_PROJECTS } from './constants';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS as any);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#121212] text-white selection:bg-[#800020] selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/archive" element={<ArchivePage projects={projects} />} />
          <Route path="/studio/:projectId" element={<StudioPage projects={projects} />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;

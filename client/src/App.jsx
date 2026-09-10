import { Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';

import PublicLayout from './layouts/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Skills from './pages/Skills.jsx';
import Experience from './pages/Experience.jsx';
import Projects from './pages/Projects.jsx';
import Education from './pages/Education.jsx';
import Certifications from './pages/Certifications.jsx';
import Achievements from './pages/Achievements.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './admin/AdminLogin.jsx';
import ProtectedRoute from './admin/ProtectedRoute.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminProfile from './admin/AdminProfile.jsx';
import AdminSkills from './admin/AdminSkills.jsx';
import AdminExperience from './admin/AdminExperience.jsx';
import AdminProjects from './admin/AdminProjects.jsx';
import AdminEducation from './admin/AdminEducation.jsx';
import AdminCertifications from './admin/AdminCertifications.jsx';
import AdminAchievements from './admin/AdminAchievements.jsx';
import AdminMessages from './admin/AdminMessages.jsx';
import AdminResume from './admin/AdminResume.jsx';
import AdminSettings from './admin/AdminSettings.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="experience" element={<Experience />} />
          <Route path="projects" element={<Projects />} />
          <Route path="education" element={<Education />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="resume" element={<AdminResume />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

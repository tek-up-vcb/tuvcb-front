
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Index from './pages/index';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ManageUsers from './pages/manage-users';
import ManageStudents from './pages/manage-students';
import ManageDiplomas from './pages/manage-diplomas';
import About from './pages/about';
import Terms from './pages/terms/index';
import CheckDiplomaPage from './pages/check-diploma';
import './App.css';
import DashboardLayout from '@/components/DashboardLayout';
import NotFound from '@/pages/not-found';
import AccountSettings from './pages/account-settings';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />

          {/* Vérification de diplôme */}
          <Route path="/check-diploma" element={<CheckDiplomaPage />} />

          {/* Dashboard area with persistent sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/manage-diplomas" element={<ManageDiplomas />} />
            <Route path="/account-settings" element={<AccountSettings />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

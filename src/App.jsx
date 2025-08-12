import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/index'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import ManageUsers from './pages/manage-users'
import ManageStudents from './pages/manage-students'
import ManageDiplomas from './pages/manage-diplomas'
import About from './pages/about'
import Terms from './pages/terms/index'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/manage-diplomas" element={<ManageDiplomas />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignUpPage'
import BookInspectionPage from './pages/BookInspectionPage'
import ScriptEditPage from './pages/ScriptEditPage'
import ScriptListPage from './pages/ScriptListPage' // ✅ 추가

import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/scripts" replace />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/inspection" element={<BookInspectionPage />} />
        <Route path="/scripts" element={<ScriptListPage />} /> 
        <Route path="/script-edit/:id" element={<ScriptEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
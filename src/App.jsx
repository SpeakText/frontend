import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/inspection" element={<BookInspectionPage />} />
        <Route path="/scripts" element={<ScriptListPage />} /> {/* ✅ 추가 */}
        <Route path="/script-edit/:id" element={<ScriptEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
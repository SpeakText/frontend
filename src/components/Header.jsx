import { Link } from 'react-router-dom'

export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-display">
          SpeakText 작가 대시보드
        </h1>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/inspection" className="text-gray-700 hover:text-blue-600 transition">
            작품 등록
          </Link>
          <Link to="/scripts" className="text-gray-700 hover:text-blue-600 transition">
            스크립트 편집
          </Link>
          <Link to="/merge-publish" className="text-gray-700 hover:text-blue-600 transition">
            병합 및 출판
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
            내 정보
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 hover:text-red-600 transition"
          >
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  )
}
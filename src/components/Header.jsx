import { Link } from 'react-router-dom'

export default function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">SpeakText 작가 대시보드</h1>
        <nav className="flex gap-4">
          <Link to="/inspection" className="hover:text-blue-600">작품 등록</Link>
          <Link to="/scripts" className="hover:text-blue-600">스크립트 편집</Link>
          <Link to="/profile" className="hover:text-blue-600">내 정보</Link>
          <button onClick={() => {
            localStorage.removeItem('authToken')
            window.location.href = '/login'
          }} className="text-red-500 hover:text-red-700">로그아웃</button>
        </nav>
      </header>
    )
  } 
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InformationCircleIcon } from '@heroicons/react/24/outline' // Heroicons 사용

export default function Header() {
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)
  const modalRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  }

  // 배경 클릭 시 모달 닫기 (모달 내부 클릭은 무시)
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowHelp(false)
    }
  }

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate('/inspection')}
            className="text-2xl font-semibold tracking-tight text-gray-900 font-display cursor-pointer hover:text-blue-600 transition"
          >
            글을 말하다 - 작가 대시보드
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

        <div
          className="bg-blue-50 text-blue-800 text-sm text-center py-2 cursor-pointer hover:bg-blue-100 transition"
          onClick={() => setShowHelp(true)}
        >
          사용 방법 보기
        </div>
      </header>

      {/* 모달 */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="닫기"
            >
              ×
            </button>
            <div className="flex items-center justify-center mb-6">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">작가 대시보드 사용 방법</h2>
            </div>
            <ol className="list-decimal list-inside text-[16px] leading-relaxed text-gray-700 space-y-4">
              <li>
                <strong>작품 등록 및 검수:</strong> 제목, 설명, 커버 이미지, 가격, ISBN, 텍스트 원고 파일을 입력하여 검수 요청을 제출합니다.
                텍스트 원고는 본문 내용만 포함되어야 하며, 그렇지 않으면 검수가 거부될 수 있습니다.
              </li>
              <li>
                <strong>스크립트 자동 생성:</strong> 검수 승인을 받으면 자동 스크립트 생성이 진행되며, 편집 탭에서 확인할 수 있습니다.
              </li>
              <li>
                <strong>스크립트 편집:</strong> 생성된 스크립트를 확인하고 등장인물과 보이스를 설정합니다.
                나레이션 포함 모든 화자의 보이스를 설정해야 음성 생성을 할 수 있습니다.
              </li>
              <li>
                <strong>음성 생성 시작:</strong> 보이스 설정이 완료되면 우측 상단의 버튼으로 음성 생성을 시작할 수 있으며,
                작품 길이에 따라 수 분이 소요됩니다.
              </li>
              <li>
                <strong>병합 및 출판:</strong> 생성된 오디오를 병합하고 출판하여, 모바일 뷰어에서 오디오북으로 재생할 수 있습니다.
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  )
}
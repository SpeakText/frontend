import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'

export default function ScriptListPage() {
  const [inProgress, setInProgress] = useState([])
  const [completed, setCompleted] = useState([])
  const [inProgressPage, setInProgressPage] = useState(0)
  const [completedPage, setCompletedPage] = useState(0)
  const [inProgressLast, setInProgressLast] = useState(false)
  const [completedLast, setCompletedLast] = useState(false)
  const [inProgressTotalPages, setInProgressTotalPages] = useState(1)
  const [completedTotalPages, setCompletedTotalPages] = useState(1)
  const size = 8

  const navigate = useNavigate()

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const [inProgressRes, completedRes] = await Promise.all([
          axiosInstance.get('/api/script/progress/in-progress', {
            params: { page: inProgressPage, size }
          }),
          axiosInstance.get('/api/script/progress/completed', {
            params: { page: completedPage, size }
          })
        ])

        setInProgress(inProgressRes.data?.content ?? [])
        setInProgressLast(inProgressRes.data?.last ?? true)
        setInProgressTotalPages(inProgressRes.data?.totalPages ?? 1)

        setCompleted(completedRes.data?.content ?? [])
        setCompletedLast(completedRes.data?.last ?? true)
        setCompletedTotalPages(completedRes.data?.totalPages ?? 1)
      } catch (err) {
        console.error('스크립트 목록 불러오기 실패:', err)
        if (err.response?.status === 401) {
          navigate('/login')
        }
      }
    }

    fetchScripts()
  }, [inProgressPage, completedPage, navigate])

  const handleClick = (id) => {
    navigate(`/script-edit/${id}`)
  }

  const ScriptItem = ({ script }) => (
    <li
      onClick={() => handleClick(script.identificationNumber)}
      className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-gray-300 transition cursor-pointer"
    >
      <h2 className="text-[17px] font-normal text-gray-800 tracking-tight" style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}>{script.title}</h2>
    </li>
  )

  const Pagination = ({ page, last, setPage, totalPages }) => (
    <div className="mt-4 flex justify-between items-center">
      <button
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm disabled:opacity-50 transition"
        disabled={page === 0}
        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
      >
        이전
      </button>
      <span className="text-sm text-gray-700">{page + 1} / {totalPages}</span>
      <button
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm disabled:opacity-50 transition"
        disabled={last}
        onClick={() => setPage(prev => prev + 1)}
      >
        다음
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* 진행 중 */}
        <section className="bg-white rounded-2xl shadow-md px-6 py-8 space-y-6 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl text-gray-700 tracking-tight" style={{ fontFamily: 'Ownglyph_corncorn-Rg' }}>
            스크립트화 진행 중인 작품
          </h1>
          {inProgress.length === 0 ? (
            <p className="text-gray-500">진행 중인 작품이 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {inProgress.map(script => (
                  <ScriptItem key={script.identificationNumber} script={script} />
                ))}
              </ul>
              <Pagination
                page={inProgressPage}
                last={inProgressLast}
                setPage={setInProgressPage}
                totalPages={inProgressTotalPages}
              />
            </>
          )}
        </section>

        {/* 완료됨 */}
        <section className="bg-white rounded-2xl shadow-md px-6 py-8 space-y-6 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl text-gray-700 tracking-tight" style={{ fontFamily: 'Ownglyph_corncorn-Rg' }}>
            스크립트가 생성된 작품
          </h1>
          {completed.length === 0 ? (
            <p className="text-gray-500">완료된 스크립트가 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {completed.map(script => (
                  <ScriptItem key={script.identificationNumber} script={script} />
                ))}
              </ul>
              <Pagination
                page={completedPage}
                last={completedLast}
                setPage={setCompletedPage}
                totalPages={completedTotalPages}
              />
            </>
          )}
        </section>
      </main>
    </div>
  )
}
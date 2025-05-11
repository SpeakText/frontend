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

        const inProgressData = inProgressRes.data
        const completedData = completedRes.data

        setInProgress(inProgressData?.content ?? [])
        setInProgressLast(inProgressData?.last ?? true)
        setInProgressTotalPages(inProgressData?.totalPages ?? 1)

        setCompleted(completedData?.content ?? [])
        setCompletedLast(completedData?.last ?? true)
        setCompletedTotalPages(completedData?.totalPages ?? 1)
      } catch (err) {
        console.error('스크립트 목록 불러오기 실패:', err)
      }
    }

    fetchScripts()
  }, [inProgressPage, completedPage])

  const handleClick = (id) => {
    navigate(`/script-edit/${id}`)
  }

  const ScriptItem = ({ script }) => (
    <li
      className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
      onClick={() => handleClick(script.identificationNumber)}
    >
      <h2 className="text-lg font-semibold">{script.title}</h2>
      <p className="text-sm text-gray-600">
        총 문장 수: {script.totalFragments} / 현재 진행: {script.fragmentCount}
      </p>
    </li>
  )

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* 진행 중인 스크립트 */}
        <div>
          <h1 className="text-2xl font-bold mb-4">진행 중인 작품</h1>
          {inProgress.length === 0 ? (
            <p className="text-gray-500">진행 중인 작품이 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {inProgress.map(script => (
                  <ScriptItem key={script.identificationNumber} script={script} />
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  disabled={inProgressPage === 0}
                  onClick={() => setInProgressPage(prev => Math.max(prev - 1, 0))}
                >
                  이전
                </button>
                <span className="self-center text-gray-700">
                  {inProgressPage + 1} / {inProgressTotalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  disabled={inProgressLast}
                  onClick={() => setInProgressPage(prev => prev + 1)}
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>

        {/* 완료된 스크립트 */}
        <div>
          <h1 className="text-2xl font-bold mb-4">완료된 스크립트</h1>
          {completed.length === 0 ? (
            <p className="text-gray-500">완료된 스크립트가 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {completed.map(script => (
                  <ScriptItem key={script.identificationNumber} script={script} />
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  disabled={completedPage === 0}
                  onClick={() => setCompletedPage(prev => Math.max(prev - 1, 0))}
                >
                  이전
                </button>
                <span className="self-center text-gray-700">
                  {completedPage + 1} / {completedTotalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  disabled={completedLast}
                  onClick={() => setCompletedPage(prev => prev + 1)}
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

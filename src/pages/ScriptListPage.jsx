import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'

export default function ScriptListPage() {
  const [completed, setCompleted] = useState([])
  const [inProgress, setInProgress] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const res = await axiosInstance.get('/api/script/progress')
        const data = res.data

        if (Array.isArray(data)) {
          setCompleted(data.filter(item => item.isCompleted))
          setInProgress(data.filter(item => !item.isCompleted && item.fragmentCount > 0))
        } else {
          console.error('예상치 못한 응답 형식', data)
        }
      } catch (err) {
        console.error('스크립트 목록 불러오기 실패:', err)
      }
    }

    fetchScripts()
  }, [])

  const handleClick = (id) => {
    navigate(`/script-edit/${id}`)
  }

  const ScriptItem = ({ script }) => (
    <li
      key={script.identificationNumber}
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
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">진행 중인 작품</h1>
          {inProgress.length === 0 ? (
            <p className="text-gray-500">진행 중인 작품이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {inProgress.map(script => <ScriptItem key={script.identificationNumber} script={script} />)}
            </ul>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">완료된 스크립트</h1>
          {completed.length === 0 ? (
            <p className="text-gray-500">완료된 스크립트가 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {completed.map(script => <ScriptItem key={script.identificationNumber} script={script} />)}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import axiosInstance from '../lib/axiosInstance'

export default function ScriptEditPage() {
  const { id: identificationNumber } = useParams()
  const [fragments, setFragments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await axiosInstance.post('/api/script/generated', {
          identificationNumber,
        })

        setFragments(response.data)
      } catch (err) {
        const message = err.response?.data?.message || '스크립트 데이터를 불러오지 못했습니다.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchScript()
  }, [identificationNumber])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">스크립트 편집</h1>

        {loading && <p className="text-gray-500">불러오는 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-6">
          {fragments.map((fragment, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow">
              <span className="inline-block text-xs font-semibold mb-1 px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                {fragment.speaker === '나레이션 - narration'
                  ? '나레이션'
                  : `등장인물 ${fragment.speaker.replace('character-', '')}`}
              </span>
              <textarea
                className="w-full border rounded p-2 mt-1 resize-y"
                defaultValue={fragment.utterance}
                rows={3}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
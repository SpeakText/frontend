import React, { useEffect, useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'

export default function MergePublishPage() {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBooks = async (pageNum) => {
    if (loading || pageNum >= totalPages) return
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `/api/script/progress/completed?page=${pageNum}&size=10`
      )
      const newBooks = response.data.content

      const updated = await Promise.all(
        newBooks.map(async (book) => {
          const mergeStatus = await fetchMergeStatus(book.identificationNumber)
          return { ...book, mergeStatus }
        })
      )

      setBooks((prev) => {
        const existingIds = new Set(prev.map((b) => b.identificationNumber))
        const merged = [...prev, ...updated.filter((b) => !existingIds.has(b.identificationNumber))]
        return merged
      })

      setTotalPages(response.data.totalPages)
      setPage(pageNum)
    } catch {
      setError('작품 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMergeStatus = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/voice/${id}/voice-status`)
      return response.data.status
    } catch {
      return 'UNKNOWN'
    }
  }

  useEffect(() => {
    fetchBooks(0)
  }, [])

  const handleMergeRequest = async (id) => {
    try {
      await axiosInstance.post('/api/voice/merge', {
        identificationNumber: id,
      })
      alert('병합 요청이 전송되었습니다.')
      setBooks([]) // 초기화 후 재요청
      fetchBooks(0)
    } catch {
      alert('병합 요청 실패')
    }
  }

  const handlePublish = async (id) => {
    try {
      await axiosInstance.post('/api/selling-book', {
        identificationNumber: id,
      })
      alert('출판 요청 완료')
      setBooks([]) // 초기화 후 재요청
      fetchBooks(0)
    } catch {
      alert('출판 요청 실패')
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'NOT_GENERATED':
        return '음성 생성 대기 중'
      case 'FRAGMENTS_VOICE_GENERATED':
        return '병합 가능'
      case 'MERGE_REQUESTED':
        return '병합 요청 완료'
      case 'MERGED_VOICE_GENERATED':
        return '출판 가능'
      default:
        return '알 수 없음'
    }
  }

  const BookItem = ({ book }) => (
    <li
      key={book.identificationNumber}
      className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{book.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            상태: {getStatusText(book.mergeStatus)}
          </p>
        </div>
        <div className="flex gap-3">
          {book.mergeStatus === 'FRAGMENTS_VOICE_GENERATED' && (
            <button
              onClick={() => handleMergeRequest(book.identificationNumber)}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              병합 요청
            </button>
          )}
          {book.mergeStatus === 'MERGED_VOICE_GENERATED' && (
            <button
              onClick={() => handlePublish(book.identificationNumber)}
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              출판하기
            </button>
          )}
          {book.mergeStatus === 'MERGE_REQUESTED' && (
            <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded">
              병합 진행 중
            </span>
          )}
        </div>
      </div>
    </li>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">오디오북 병합 및 출판</h1>
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-gray-500">로딩 중...</p>}
        <ul className="space-y-4">
          {books.map((book) => (
            <BookItem key={book.identificationNumber} book={book} />
          ))}
        </ul>
        {page + 1 < totalPages && (
          <div className="flex justify-center pt-6">
            <button
              onClick={() => fetchBooks(page + 1)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              더 보기
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
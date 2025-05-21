import React, { useEffect, useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'

export default function MergePublishPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMergeableBooks = async () => {
      try {
        const response = await axiosInstance.get('/api/merge-publish/list')
        setBooks(response.data ?? [])
      } catch (error) {
        console.error('병합 가능한 오디오북 목록 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMergeableBooks()
  }, [])

  const handleMergeRequest = async (bookId) => {
    try {
      await axiosInstance.post(`/api/merge-publish/merge/${bookId}`)
      alert('병합 요청이 성공적으로 전송되었습니다.')
      window.location.reload()
    } catch (error) {
      console.error('병합 요청 실패:', error)
      alert('병합 요청 중 오류가 발생했습니다.')
    }
  }

  const handlePublish = async (bookId) => {
    try {
      await axiosInstance.post(`/api/merge-publish/publish/${bookId}`)
      alert('출판 요청이 성공적으로 완료되었습니다.')
      window.location.reload()
    } catch (error) {
      console.error('출판 요청 실패:', error)
      alert('출판 요청 중 오류가 발생했습니다.')
    }
  }

  const BookItem = ({ book }) => (
    <li className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{book.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            상태: {book.status === 'MERGEABLE' ? '병합 대기 중' : book.status === 'MERGED' ? '병합 완료됨' : '알 수 없음'}
          </p>
        </div>
        <div className="flex gap-3">
          {book.status === 'MERGEABLE' && (
            <button
              onClick={() => handleMergeRequest(book.id)}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              병합 요청
            </button>
          )}
          {book.status === 'MERGED' && (
            <button
              onClick={() => handlePublish(book.id)}
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              출판하기
            </button>
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
        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">현재 병합 가능한 작품이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {books.map(book => (
              <BookItem key={book.id} book={book} />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
import React, { useEffect, useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

export default function MergePublishPage() {
  const [completedBooks, setCompletedBooks] = useState([])
  const [completedPage, setCompletedPage] = useState(0)
  const [completedTotalPages, setCompletedTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [audioModal, setAudioModal] = useState({ isOpen: false, src: null, title: null })

  const fetchBooks = async (pageNum, refresh = false) => {
    if (loading && !refresh) return
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `/api/script/progress/completed?page=${pageNum}&size=10`
      )
      const books = response.data.content

      const updated = await Promise.all(
        books.map(async book => {
          try {
            const res = await axiosInstance.get(`/api/voice/${book.identificationNumber}/voice-status`)
            return { ...book, mergeStatus: res.data.status }
          } catch {
            return { ...book, mergeStatus: 'UNKNOWN' }
          }
        })
      )

      setCompletedBooks(prev => (refresh ? updated : [...prev, ...updated]))
      setCompletedTotalPages(response.data.totalPages)
      setCompletedPage(pageNum)
    } catch {
      setError('작품 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleMergeRequest = async (id) => {
    try {
      await axiosInstance.post('/api/voice/merge', {
        identificationNumber: id,
      })
      alert('병합 요청이 전송되었습니다.')
      fetchBooks(0, true)
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
      fetchBooks(0, true)
    } catch {
      alert('출판 요청 실패')
    }
  }

  const handlePreview = async (book) => {
    try {
      const response = await axiosInstance.get(`/api/voice/preview/${book.identificationNumber}`, {
        responseType: 'blob',
      })
      const audioUrl = URL.createObjectURL(response.data)
      setAudioModal({ isOpen: true, src: audioUrl, title: book.title })
    } catch (err) {
      alert('미리듣기 파일을 불러오는데 실패했습니다.')
    }
  }

  const closeAudioModal = () => {
    if (audioModal.src) {
      URL.revokeObjectURL(audioModal.src)
    }
    setAudioModal({ isOpen: false, src: null, title: null })
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
      case 'DONE':
        return '출판 완료'
      default:
        return '알 수 없음'
    }
  }

  const BookItem = ({ book }) => {
    return (
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
              <>
                <button
                  onClick={() => handleMergeRequest(book.identificationNumber)}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  title="병합 요청"
                >
                  병합 요청
                </button>
              </>
            )}
            {book.mergeStatus === 'MERGE_REQUESTED' && (
              <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded">
                병합 진행 중
              </span>
            )}
            {book.mergeStatus === 'MERGED_VOICE_GENERATED' && (
              <>
                <button
                  onClick={() => handlePublish(book.identificationNumber)}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  출판하기
                </button>
                <button
                  onClick={() => handlePreview(book)}
                  className="px-4 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                  미리 듣기
                </button>
              </>
            )}
            {book.mergeStatus === 'DONE' && (
              <span className="px-4 py-1 bg-green-100 text-green-800 rounded">
                출판 완료
              </span>
            )}
          </div>
        </div>
      </li>
    )
  }

  const BookList = ({ books, title, onLoadMore, hasMore }) => (
    <section className="bg-white rounded-xl shadow-lg px-6 py-8 space-y-6">
      <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}>
        {title}
      </h2>
      {books.length === 0 ? (
        <p className="text-gray-500">작품이 없습니다.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {books.map((book) => (
              <BookItem key={book.identificationNumber} book={book} />
            ))}
          </ul>
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onLoadMore}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm transition"
                disabled={loading}
              >
                {loading ? '로딩 중...' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )

  const AudioPreviewModal = ({ isOpen, src, title, onClose }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <audio src={src} controls autoPlay className="w-full">
            Your browser does not support the audio element.
          </audio>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            닫기
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchBooks(0, true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}>
          오디오북 병합 및 출판
        </h1>
        {error && <p className="text-red-500">{error}</p>}

        <BookList
          books={completedBooks}
          title="스크립트 생성 완료된 작품"
          onLoadMore={() => fetchBooks(completedPage + 1, false)}
          hasMore={completedPage + 1 < completedTotalPages}
        />
      </main>
      <AudioPreviewModal
        isOpen={audioModal.isOpen}
        src={audioModal.src}
        title={audioModal.title}
        onClose={closeAudioModal}
      />
    </div>
  )
}

import React, { useEffect, useState, useCallback } from 'react'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'
import { SpeakerWaveIcon, XMarkIcon } from '@heroicons/react/24/solid'

// 시간 포맷 함수 mm:ss
function formatTime(sec) {
  if (!sec) return '00:00'
  const minutes = Math.floor(sec / 60)
  const seconds = Math.floor(sec % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function MergePublishPage() {
  const [inProgressBooks, setInProgressBooks] = useState([])
  const [completedBooks, setCompletedBooks] = useState([])
  const [inProgressPage, setInProgressPage] = useState(0)
  const [completedPage, setCompletedPage] = useState(0)
  const [inProgressTotalPages, setInProgressTotalPages] = useState(1)
  const [completedTotalPages, setCompletedTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Audio modal 상태
  const [audioModalOpen, setAudioModalOpen] = useState(false)
  const [audioSrc, setAudioSrc] = useState('')
  const [audioText, setAudioText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // 기존 API로 책 데이터 불러오기
  const fetchBooks = async (pageNum, isCompleted = true) => {
    if (loading) return
    setLoading(true)
    try {
      const endpoint = isCompleted
        ? '/api/script/progress/completed'
        : '/api/script/progress/in-progress'
      const response = await axiosInstance.get(
        `${endpoint}?page=${pageNum}&size=10`
      )
      const newBooks = response.data.content
  
      // 각 책에 대해 mergeStatus API 호출 후 병합
      const updated = await Promise.all(
        newBooks.map(async (book) => {
          try {
            const res = await axiosInstance.get(`/api/voice/${book.identificationNumber}/voice-status`)
            return { ...book, mergeStatus: res.data.status }
          } catch {
            return { ...book, mergeStatus: 'UNKNOWN' }
          }
        })
      )
  
      if (isCompleted) {
        setCompletedBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.identificationNumber))
          const merged = [...prev, ...updated.filter((b) => !existingIds.has(b.identificationNumber))]
          return merged
        })
        setCompletedTotalPages(response.data.totalPages)
        setCompletedPage(pageNum)
      } else {
        setInProgressBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.identificationNumber))
          const merged = [...prev, ...updated.filter((b) => !existingIds.has(b.identificationNumber))]
          return merged
        })
        setInProgressTotalPages(response.data.totalPages)
        setInProgressPage(pageNum)
      }
    } catch {
      setError('작품 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks(0, true)  // 완료된 작품
    fetchBooks(0, false) // 진행 중인 작품
  }, [])

  // 더미 오디오 및 텍스트로 모달 열기 (병합된 음성 듣기)
  const openAudioModal = useCallback((id, title) => {
    // 실제 오디오 URL 및 텍스트 대신 더미 사용
    setAudioSrc('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
    setAudioText(`작품 제목: ${title}\n\n여기는 더미 텍스트 영역입니다. 실제 텍스트가 여기에 표시됩니다.`)
    setAudioModalOpen(true)
  }, [])

  // 오디오 재생 및 이벤트 관리
  useEffect(() => {
    if (!audioSrc) return
    const audioEl = new Audio(audioSrc)
    setAudio(audioEl)

    const updateTime = () => setCurrentTime(audioEl.currentTime)
    const setAudioDuration = () => setDuration(audioEl.duration)
    const endedHandler = () => setIsPlaying(false)

    audioEl.addEventListener('timeupdate', updateTime)
    audioEl.addEventListener('loadedmetadata', setAudioDuration)
    audioEl.addEventListener('ended', endedHandler)

    return () => {
      audioEl.pause()
      audioEl.removeEventListener('timeupdate', updateTime)
      audioEl.removeEventListener('loadedmetadata', setAudioDuration)
      audioEl.removeEventListener('ended', endedHandler)
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      setAudio(null)
    }
  }, [audioSrc])

  const togglePlay = () => {
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const seek = (e) => {
    if (!audio) return
    audio.currentTime = e.target.value
    setCurrentTime(e.target.value)
  }

  const closeAudioModal = () => {
    if (audio) audio.pause()
    setAudioModalOpen(false)
    setAudioSrc('')
    setAudioText('')
  }

  // 병합 요청 (API 호출, 임시 alert)
  const handleMergeRequest = async (id) => {
    try {
      await axiosInstance.post('/api/voice/merge', {
        identificationNumber: id,
      })
      alert('병합 요청이 전송되었습니다.')
      setCompletedBooks([]) // 초기화 후 재요청
      fetchBooks(0, true)
    } catch {
      alert('병합 요청 실패')
    }
  }

  // 출판 요청 (API 호출, 임시 alert)
  const handlePublish = async (id) => {
    try {
      await axiosInstance.post('/api/selling-book', {
        identificationNumber: id,
      })
      alert('출판 요청 완료')
      setCompletedBooks([]) // 초기화 후 재요청
      fetchBooks(0, true)
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
      case 'DONE':
        return '출판 완료'
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
          <h2
            className="text-lg text-gray-900"
            style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}
          >
            {book.title}
          </h2>
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
            <>
              <button
                onClick={() => openAudioModal(book.identificationNumber, book.title)}
                className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center gap-1"
                aria-label="병합된 음성 들어보기"
              >
                <SpeakerWaveIcon className="w-5 h-5" />
                병합된 음성 듣기
              </button>
              <button
                onClick={() => handlePublish(book.identificationNumber)}
                className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800 transition"
              >
                출판하기
              </button>
            </>
          )}
          {book.mergeStatus === 'MERGE_REQUESTED' && (
            <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded">
              병합 진행 중
            </span>
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

  const BookList = ({ books, title, onLoadMore, hasMore }) => (
    <section className="bg-white rounded-xl shadow-lg px-6 py-8 space-y-6">
      <h2
        className="text-xl text-gray-900"
        style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}
      >
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
              >
                더 보기
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <h1
          className="text-3xl text-gray-900"
          style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}
        >
          오디오북 병합 및 출판
        </h1>

        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-gray-500">로딩 중...</p>}

        <BookList
          books={inProgressBooks}
          title="스크립트 생성 진행 중인 작품"
          onLoadMore={() => fetchBooks(inProgressPage + 1, false)}
          hasMore={inProgressPage + 1 < inProgressTotalPages}
        />

        <BookList
          books={completedBooks}
          title="스크립트 생성 완료된 작품"
          onLoadMore={() => fetchBooks(completedPage + 1, true)}
          hasMore={completedPage + 1 < completedTotalPages}
        />
      </main>

      {/* Audio Modal */}
      {audioModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col md:flex-row justify-center items-center p-4 overflow-auto">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md md:max-w-3xl w-full max-h-[90vh] overflow-auto flex flex-col">
            <button
              onClick={closeAudioModal}
              className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 text-3xl font-bold z-10"
              aria-label="닫기"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="p-6 flex flex-col flex-grow">
              <h3
                className="text-xl mb-4 text-gray-900"
                style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}
              >
                병합된 음성 듣기
              </h3>

              <div className="flex flex-col md:flex-row gap-6 flex-grow">
                <div
                  className="flex-grow overflow-y-auto bg-gray-50 rounded p-4 text-gray-700 whitespace-pre-line"
                  style={{ maxHeight: 'calc(90vh - 220px)' }}
                >
                  {audioText || '텍스트가 없습니다.'}
                </div>

                <div className="flex flex-col justify-center items-center gap-4 md:w-1/3 p-4 bg-gray-100 rounded">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-3 font-semibold shadow transition"
                    aria-label={isPlaying ? '일시정지' : '재생'}
                  >
                    {isPlaying ? '일시정지' : '재생'}
                    <SpeakerWaveIcon className="w-6 h-6" />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={seek}
                    className="w-full"
                  />
                  <div className="w-full flex justify-between text-xs text-gray-600 select-none">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
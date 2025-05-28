import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function VoiceEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [fragments, setFragments] = useState([])
  const [audioUrls, setAudioUrls] = useState({})

  const [playingIndex, setPlayingIndex] = useState(null)
  const audioRef = useRef(null)

  // Pagination state
  const [page, setPage] = useState(0)
  const [pageInput, setPageInput] = useState(1)
  const size = 3
  const [totalPages, setTotalPages] = useState(1)

  // Filter state: 'all', 'narration', 'character'
  const [filter, setFilter] = useState('all')

  // Load dummy data for fragments
  useEffect(() => {
    // 전체 더미 데이터
    const dummyFragmentsAll = [
      { index: 0, text: '안녕하세요, 여기는 첫 번째 대사입니다.', speakerKey: 'char1' },
      { index: 1, text: '두 번째 대사가 이어집니다.', speakerKey: 'char2' },
      { index: 2, text: '마지막 대사입니다. 감사합니다!', speakerKey: 'narration' },
      { index: 3, text: '추가된 네 번째 대사입니다.', speakerKey: 'char1' },
      { index: 4, text: '다섯 번째 대사입니다.', speakerKey: 'narration' },
      { index: 5, text: '여섯 번째 대사입니다.', speakerKey: 'char2' },
    ]

    const dummyAudioUrlsAll = {
      0: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      4: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      5: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    }

    // 필터링에 따라 보여줄 데이터 결정
    let filteredFragments = []
    if (filter === 'all') {
      filteredFragments = dummyFragmentsAll
    } else if (filter === 'narration') {
      filteredFragments = dummyFragmentsAll.filter(f => f.speakerKey === 'narration')
    } else if (filter === 'character') {
      filteredFragments = dummyFragmentsAll.filter(f => f.speakerKey !== 'narration')
    }

    // 페이지네이션 처리
    const startIdx = page * size
    const pagedFragments = filteredFragments.slice(startIdx, startIdx + size)
    setFragments(pagedFragments)
    setTotalPages(Math.ceil(filteredFragments.length / size))
    setPageInput(page + 1)

    setAudioUrls(dummyAudioUrlsAll)
    setLoading(false)
    setPlayingIndex(null)
  }, [id, page, filter])

  const handlePlayPause = (index) => {
    if (playingIndex === index) {
      audioRef.current.pause()
      setPlayingIndex(null)
    } else {
      if (audioRef.current) audioRef.current.pause()
      setPlayingIndex(index)
      setTimeout(() => audioRef.current.play(), 0)
    }
  }

  const handleEnded = () => {
    setPlayingIndex(null)
  }

  const onPageInputChange = (e) => {
    let val = Number(e.target.value)
    if (val < 1) val = 1
    if (val > totalPages) val = totalPages
    setPageInput(val)
  }

  const goToPage = () => {
    setPage(pageInput - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <h1
          className="text-2xl font-bold text-gray-800"
          style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}
        >
          음성 편집 - 작품 ID: {id}
        </h1>

        {/* 필터 탭 */}
        <div className="flex gap-4 mb-4">
          {['all', 'narration', 'character'].map((f) => (
            <button
              key={f}
              onClick={() => { setPage(0); setFilter(f) }}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                filter === f
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-green-50'
              }`}
            >
              {f === 'all' ? '전체' : f === 'narration' ? '나레이션' : '등장인물'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600">불러오는 중...</p>
        ) : fragments.length === 0 ? (
          <p className="text-center text-gray-500">해당 조건에 맞는 프래그먼트가 없습니다.</p>
        ) : (
          <>
            <div className="space-y-4">
            {fragments.map((frag) => (
                <div
                    key={frag.index}
                    className="bg-white rounded-lg shadow p-2 border border-gray-200 flex items-center justify-between gap-4 hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => handlePlayPause(frag.index)}
                    style={{ minHeight: '48px' }}  // 최소 높이 지정 (원하는 높이로 조절 가능)
                >
                    <div className="flex-1 text-gray-800 font-medium">{frag.text}</div>
                    <div className="flex items-center gap-3">
                    <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        onClick={(e) => {
                        e.stopPropagation()
                        handlePlayPause(frag.index)
                        }}
                        aria-label={playingIndex === frag.index ? '일시정지' : '재생'}
                    >
                        {playingIndex === frag.index ? '일시정지' : '재생'}
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center gap-4 mt-10 border-t pt-6">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{page + 1}</span> / {totalPages}
                </span>
                <input
                  type="number"
                  value={pageInput}
                  min={1}
                  max={totalPages}
                  onChange={onPageInputChange}
                  className="w-16 px-2 py-1 bg-slate-100 rounded-md text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={goToPage}
                  className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition"
                >
                  이동
                </button>
              </div>

              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRightIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <audio
              ref={audioRef}
              src={playingIndex !== null ? audioUrls[playingIndex] : ''}
              onEnded={handleEnded}
              onPause={() => setPlayingIndex(null)}
              className="hidden"
              preload="auto"
            />
          </>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            뒤로 가기
          </button>
        </div>
      </main>
    </div>
  )
}
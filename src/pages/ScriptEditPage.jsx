import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import axiosInstance from '../lib/axiosInstance'
import CharacterSettingsEditor from '../components/CharacterSettingsEditor'
import NarrationVoiceEditor from '../components/NarrationVoiceEditor'
import ScriptFragmentListItem from '../components/ScriptFragmentListItem'
import FragmentEditModal from '../components/FragmentEditModal'

export default function ScriptEditPage() {
  const { id: identificationNumber } = useParams()
  const [fragments, setFragments] = useState([])
  const [characters, setCharacters] = useState([])
  const [narrationVoice, setNarrationVoice] = useState('')
  const [speakerOptions, setSpeakerOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const [editingFragment, setEditingFragment] = useState(null)
  const size = 40 // ✅ 페이지당 40개 보여주도록 설정

  const updateSpeakerOptions = (characterData, narrationVoiceType) => {
    const narrationOption = { label: '나레이션 - narration', value: '나레이션 - narration' }
    const characterOptions = characterData.map(char => ({
      label: `등장인물 ${char.name} (${char.characterKey})`,
      value: char.characterKey,
    }))
    setSpeakerOptions([narrationOption, ...characterOptions])
  }

  const fetchData = async (pageNum = 0) => {
    setLoading(true)
    try {
      const [scriptRes, characterRes, narrationRes] = await Promise.all([
        axiosInstance.post(`/api/script/generated?page=${pageNum}&size=${size}`, {
          identificationNumber,
        }),
        axiosInstance.get(`/api/character/${identificationNumber}`),
        axiosInstance.get(`/api/script/narration/${identificationNumber}`),
      ])

      setFragments(scriptRes.data.content)
      setTotalPages(scriptRes.data.totalPages)
      setCharacters(characterRes.data)
      setNarrationVoice(narrationRes.data.voiceType)
      updateSpeakerOptions(characterRes.data, narrationRes.data.voiceType)
    } catch (err) {
      setError(err.response?.data?.message || '데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [identificationNumber, page])

  useEffect(() => {
    setPageInput(page + 1)
  }, [page])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6 space-y-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">스크립트 편집</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded shadow transition"
            >
              🎧 음성 생성 시작
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">불러오는 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <CharacterSettingsEditor
              identificationNumber={identificationNumber}
              characters={characters}
              onSuccess={() => fetchData(page)}
            />

            <NarrationVoiceEditor
              identificationNumber={identificationNumber}
              voiceType={narrationVoice}
              onSuccess={() => fetchData(page)}
            />

            <div className="border rounded-lg bg-white shadow-sm divide-y">
              {fragments.map(fragment => (
                <ScriptFragmentListItem
                  key={fragment.index}
                  fragment={fragment}
                  speakerOptions={speakerOptions}
                  onEdit={() => setEditingFragment({ ...fragment, identificationNumber })}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-10 border-t pt-4">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 shadow"
              >
                ◀ 이전 페이지
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">
                  {page + 1} / {totalPages} 페이지
                </span>
                <input
                  type="number"
                  value={pageInput}
                  min={1}
                  max={totalPages}
                  onChange={e => setPageInput(Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center text-sm"
                />
                <button
                  onClick={() =>
                    setPage(Math.min(Math.max(pageInput - 1, 0), totalPages - 1))
                  }
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded shadow"
                >
                  이동
                </button>
              </div>

              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 shadow"
              >
                다음 페이지 ▶
              </button>
            </div>
          </>
        )}
      </main>

      {editingFragment && (
        <FragmentEditModal
          isOpen={!!editingFragment}
          fragment={editingFragment}
          speakerOptions={speakerOptions}
          onClose={() => setEditingFragment(null)}
          onSuccess={() => {
            setEditingFragment(null)
            fetchData(page)
          }}
        />
      )}

      {isStartModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">음성 생성을 시작할까요?</h2>
            <p className="text-sm text-gray-600">
              생성이 시작되면 취소할 수 없습니다. 정말 진행하시겠습니까?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsStartModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await axiosInstance.post('/api/voice/generate', {
                      identificationNumber,
                    })
                    alert('음성 생성이 시작되었습니다.')
                    console.log('응답:', res.data)
                  } catch (err) {
                    console.error('음성 생성 실패:', err)
                    alert('음성 생성에 실패했습니다. 다시 시도해주세요.')
                  } finally {
                    setIsStartModalOpen(false)
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
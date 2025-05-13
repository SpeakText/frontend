import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import axiosInstance from '../lib/axiosInstance'
import ScriptFragmentEditor from '../components/ScriptFragmentEditor'
import CharacterSettingsEditor from '../components/CharacterSettingsEditor'
import NarrationVoiceEditor from '../components/NarrationVoiceEditor'
import VoiceInfoModal from '../components/VoiceInfoModal'

export default function ScriptEditPage() {
  const { id: identificationNumber } = useParams()
  const [fragments, setFragments] = useState([])
  const [characters, setCharacters] = useState([])
  const [narrationVoice, setNarrationVoice] = useState('')
  const [speakerOptions, setSpeakerOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const size = 5

  const updateSpeakerOptions = (characterData, narrationVoiceType) => {
    const narrationOption = { label: '나레이션', value: 'narration' }
    const characterOptions = characterData.map(char => ({ label: `등장인물 ${char.name}`, value: char.characterKey }))
    setSpeakerOptions([narrationOption, ...characterOptions])
  }

  const normalizeSpeaker = (speakerString) => speakerString === '나레이션 - narration' ? 'narration' : speakerString

  const fetchData = async (pageNum = 0) => {
    setLoading(true)
    try {
      const [scriptRes, characterRes, narrationRes] = await Promise.all([
        axiosInstance.post(`/api/script/generated?page=${pageNum}&size=${size}`, {
          identificationNumber
        }),
        axiosInstance.get(`/api/character/${identificationNumber}`),
        axiosInstance.get(`/api/script/narration/${identificationNumber}`),
      ])
      console.log(`📦 page: ${pageNum}`, scriptRes.data.content)
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6 space-y-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">스크립트 편집</h1>
          <button onClick={() => setIsModalOpen(true)} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded shadow">
            🎤 보이스 설명
          </button>
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

            <div className="space-y-6">
              {fragments.map(fragment => (
                <ScriptFragmentEditor
                  key={fragment.index}
                  identificationNumber={identificationNumber}
                  fragment={{
                    ...fragment,
                    speaker: normalizeSpeaker(fragment.speaker)
                  }}
                  index={fragment.index}
                  speakerOptions={speakerOptions}
                  onSuccess={() => fetchData(page)}
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
              <span className="text-gray-600 text-sm">
                {page + 1} / {totalPages} 페이지
              </span>
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

      <VoiceInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
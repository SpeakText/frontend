import React, { useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'

const VOICE_OPTIONS = [
    'NO_VOICE',  // 기본값 (음성 없음)
    'ALL0Y',     // 부드럽고 중성적 (기존)
    'ASH',       // 감성적이고 섬세한 남성형 (기존)
    'BALLAD',    // 서사적이고 드라마틱한 여성형 (신규)
    'CORAL',     // 청명하고 맑은 여성형 (기존)
    'ECHO',      // 따뜻하고 친근한 남성형 (추가)
    'FABLE',     // 동화적이고 서정적인 여성형 (추가)
    'NOVA',      // 밝고 에너지 넘치는 여성형 (추가)
    'ONYX',      // 저음의 카리스마 있는 남성형 (기존)
    'SAGE',      // 지혜롭고 차분한 남성형 (추가)
    'SHIMMER',   // 감정 표현이 풍부한 여성형 (추가)
    'VERSE'      // 시적이고 리드미컬한 중성형 (추가)
  ]
export default function NarrationVoiceEditor({ scriptId, voiceType, onSuccess }) {
  const [selectedVoice, setSelectedVoice] = useState(voiceType)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
        await axiosInstance.put('/api/script/narration', {
            identificationNumber: '9788930705479',
            voiceType: 'coral',
        })
      onSuccess()
    } catch (err) {
      alert(err.response?.data?.message || '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold">나레이션 설정</h2>
      <CustomSelect
        options={VOICE_OPTIONS.map(v => ({ label: v, value: v }))}
        value={selectedVoice}
        onChange={setSelectedVoice}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}
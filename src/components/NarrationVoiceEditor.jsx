import React, { useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'

const VOICE_OPTIONS = [
  { label: '부드러운 여성 음성 (FEMALE_SOFT)', value: 'FEMALE_SOFT' },
  { label: '명확한 여성 음성 (FEMALE_CLEAR)', value: 'FEMALE_CLEAR' },
  { label: '캐주얼한 여성 음성 (FEMALE_CASUAL)', value: 'FEMALE_CASUAL' },
  { label: '밝은 여성 음성 (FEMALE_BRIGHT)', value: 'FEMALE_BRIGHT' },
  { label: '어린이 여성 음성 (FEMALE_CHILD)', value: 'FEMALE_CHILD' },
  { label: '중후한 남성 음성 (MALE_DEEP)', value: 'MALE_DEEP' },
  { label: '부드러운 남성 음성 (MALE_SOFT)', value: 'MALE_SOFT' },
  { label: '중립적인 남성 음성 (MALE_NEUTRAL)', value: 'MALE_NEUTRAL' },
  { label: '음성 없음 (NO_VOICE)', value: 'NO_VOICE' }
]

export default function NarrationVoiceEditor({ identificationNumber, voiceType, onSuccess }) {
  const [selectedVoice, setSelectedVoice] = useState(voiceType)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
        await axiosInstance.put('/api/script/narration', {
            identificationNumber: identificationNumber,
            voiceType: selectedVoice,
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
        options={VOICE_OPTIONS}
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
import React, { useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'

const VOICE_OPTIONS = [
    'NO_VOICE',
    'ALL0Y',
    'ASH',
    'BALLAD',
    'CORAL',
    'ECHO',
    'FABLE',
    'NOVA',
    'ONYX',
    'SAGE',
    'SHIMMER',
    'VERSE'
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
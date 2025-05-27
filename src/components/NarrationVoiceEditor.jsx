// ✅ NarrationVoiceEditor.jsx (foldable section like CharacterSettingsEditor)

import React, { useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'
import { ChevronDownIcon, ChevronUpIcon, MicrophoneIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline' // 기존 CircleIcon → TriangleIcon

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
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await axiosInstance.put('/api/script/narration', {
        identificationNumber,
        voiceType: selectedVoice,
      })
      onSuccess()
    } catch (err) {
      alert(err.response?.data?.message || '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const isVoiceMissing = selectedVoice === 'NO_VOICE'

  return (
    <div className="bg-[#f6f7fb] border border-slate-200 rounded-2xl shadow-md p-6 space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="flex items-center gap-2 text-slate-700">
          <MicrophoneIcon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold">나레이션 보이스 설정</h2>
        </div>
        <div className="flex items-center gap-2">
        {isVoiceMissing && !isOpen && (
          <div className="flex items-center gap-1 text-xs text-red-500">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>보이스 미설정</span>
          </div>
        )}
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-2">
          <CustomSelect
            options={VOICE_OPTIONS}
            value={selectedVoice}
            onChange={setSelectedVoice}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
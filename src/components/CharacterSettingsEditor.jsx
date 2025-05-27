import React, { useState, useEffect } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'
import { UsersIcon, ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const VOICE_OPTIONS = [
  { label: '남성 저음 (MALE_LOW)', value: 'MALE_LOW' },
  { label: '남성 중간음 (MALE_MID)', value: 'MALE_MID' },
  { label: '남성 고음 (MALE_HIGH)', value: 'MALE_HIGH' },
  { label: '남성 독특한 음색 (MALE_UNIQUE)', value: 'MALE_UNIQUE' },
  { label: '여성 저음 (FEMALE_LOW)', value: 'FEMALE_LOW' },
  { label: '여성 중간음 (FEMALE_MID)', value: 'FEMALE_MID' },
  { label: '여성 고음 (FEMALE_HIGH)', value: 'FEMALE_HIGH' },
  { label: '할머니 음색 (FEMALE_ELDERLY)', value: 'FEMALE_ELDERLY' },
  { label: '중성 독특한 음색 (NEUTRAL_UNIQUE)', value: 'NEUTRAL_UNIQUE' },
  { label: '음성 없음 (NO_VOICE)', value: 'NO_VOICE' }
]

export default function CharacterSettingsEditor({ identificationNumber, characters, onSuccess }) {
  const [characterList, setCharacterList] = useState(characters)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // default to collapsed

  useEffect(() => {
    setCharacterList(characters)
  }, [characters])

  const handleChange = (index, field, value) => {
    const updated = [...characterList]
    updated[index] = { ...updated[index], [field]: value }
    setCharacterList(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await axiosInstance.put('/api/character', {
        identificationNumber: String(identificationNumber),
        characters: characterList,
      })
      setSuccessMessage(true)
      onSuccess()
      setTimeout(() => setSuccessMessage(false), 2000)
    } catch (err) {
      alert(err.response?.data?.message || '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const hasUnassignedVoice = characterList.some(c => c.voiceType === 'NO_VOICE')

  return (
    <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="flex items-center gap-2 text-slate-800">
          <UsersIcon className="w-5 h-5 text-green-600" />
          <h2 className="text-xl" style={{ fontFamily: 'Ownglyph_corncorn-Rg, sans-serif' }}>등장인물 설정</h2>
        </div>
        <div className="flex items-center gap-2">
          {!isOpen && hasUnassignedVoice && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" /> 보이스 미설정
            </span>
          )}
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-green-600" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 mt-2">
          {characterList.map((char, idx) => (
            <div
              key={char.characterKey}
              className="flex gap-4 items-center bg-white p-3 rounded-md border border-slate-200 shadow-sm"
            >
              <input
                type="text"
                value={char.name}
                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                className="w-full border border-slate-300 bg-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="이름 입력"
              />
              <CustomSelect
                options={VOICE_OPTIONS}
                value={char.voiceType}
                onChange={(val) => handleChange(idx, 'voiceType', val)}
              />
            </div>
          ))}

          <div className="flex justify-end items-center gap-4 pt-2">
            {successMessage && <span className="text-green-600 text-sm">저장 완료</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm border border-green-600 text-green-700 rounded-md hover:bg-green-100 disabled:opacity-50 transition"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
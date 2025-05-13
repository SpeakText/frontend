import React, { useState, useEffect } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'

const VOICE_OPTIONS = ['NO_VOICE', 'ASH', 'ALLOY', 'CORAL', 'ONYX']

export default function CharacterSettingsEditor({ identificationNumber, characters, onSuccess }) {
  const [characterList, setCharacterList] = useState(characters)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

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

      // ✅ 2초 후 사라지게
      setTimeout(() => setSuccessMessage(false), 2000)
    } catch (err) {
      alert(err.response?.data?.message || '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold">등장인물 설정</h2>
      {characterList.map((char, idx) => (
        <div key={char.characterKey} className="flex gap-4 items-center">
          <input
            type="text"
            value={char.name}
            onChange={(e) => handleChange(idx, 'name', e.target.value)}
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-gray-600 focus:border-gray-600"
          />
          <CustomSelect
            options={VOICE_OPTIONS.map(v => ({ label: v, value: v }))}
            value={char.voiceType}
            onChange={(val) => handleChange(idx, 'voiceType', val)}
          />
        </div>
      ))}
      <div className="flex justify-end items-center gap-4">
        {successMessage && <span className="text-green-600 text-sm">저장 완료</span>}
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
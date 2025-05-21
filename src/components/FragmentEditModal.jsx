import React, { useState, useEffect } from 'react'
import CustomSelect from './CustomSelect'
import axiosInstance from '../lib/axiosInstance'

export default function FragmentEditModal({ isOpen, fragment, speakerOptions, onClose, onSuccess }) {
  const [speaker, setSpeaker] = useState(fragment?.speaker || '')
  const [utterance, setUtterance] = useState(fragment?.utterance || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSpeaker(fragment?.speaker || '')
    setUtterance(fragment?.utterance || '')
  }, [fragment])

  if (!isOpen || !fragment) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await axiosInstance.put('/api/script/script-fragment', {
        identificationNumber: fragment.identificationNumber,
        updates: [{ index: fragment.index, speaker, utterance }],
      })
      onSuccess()
      onClose()
    } catch (err) {
      alert('저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">스크립트 편집</h2>
        <CustomSelect options={speakerOptions} value={speaker} onChange={setSpeaker} />
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={utterance}
          onChange={(e) => setUtterance(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-gray-600">닫기</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
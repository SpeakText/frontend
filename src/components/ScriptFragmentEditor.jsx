import React, { useState, useEffect } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'

export default function ScriptFragmentEditor({
  identificationNumber,
  fragment,
  index,
  speakerOptions,
  onSuccess,
}) {
  const [speaker, setSpeaker] = useState(fragment.speaker)
  const [utterance, setUtterance] = useState(fragment.utterance)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

  useEffect(() => {
    if (!speakerOptions.find(opt => opt.value === speaker)) {
      setSpeaker(speakerOptions[0]?.value || '')
    }
  }, [speakerOptions])

  const handleSave = async () => {
    setSaving(true)
    try {
      await axiosInstance.put('/api/script/script-fragment', {
        identificationNumber: String(identificationNumber),
        updates: [
          {
            index: Number(index),
            speaker,
            utterance,
          },
        ],
      })

      setSuccessMessage(true)
      onSuccess()

      // ✅ 2초 후 저장 완료 메시지 사라지게
      setTimeout(() => setSuccessMessage(false), 2000)
    } catch (err) {
      alert(err.response?.data?.message || '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-gray-600 font-medium">{index}번째 문장</h3> {/* ✅ 몇 번째 문장 표시 */}
        {successMessage && <span className="text-green-600 text-sm">✅ 저장 완료</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">화자</label>
        <CustomSelect
          options={speakerOptions}
          value={speaker}
          onChange={setSpeaker}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">대사</label>
        <textarea
          value={utterance}
          onChange={(e) => setUtterance(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 resize-y focus:ring-gray-600 focus:border-gray-600"
          rows={3}
        />
      </div>
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
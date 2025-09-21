import React, { useState, useEffect } from 'react'
import axiosInstance from '../lib/axiosInstance'
import CustomSelect from './CustomSelect'
import { UsersIcon, ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

// Voice name to ID mapping
const VOICE_NAME_TO_ID = {
  'RACHEL': '21m00Tcm4TlvDq8ikWAM',
  'BELLA': 'EXAVITQu4vr4xnSDxMaL',
  'ELLI': 'MF3mGyEYCl7XYWbV9V6O',
  'DOMI': 'AZnzlk1XvdvUeBnXmlld',
  'DOROTHY': 'ThT5KcBeYPX3keUQqHPh',
  'FREYA': 'jsCqWAovK2LkecY7zXl4',
  'GIGI': 'jBpfuIE2acCO8z3wKNLl',
  'GLINDA': 'z9fAnlkpzviPz146aGWa',
  'GRACE': 'oWAxZDx7w5VEj9dCyTzz',
  'MATILDA': 'XrExE9yKIg1WjnnlVkGX',
  'SERENA': 'pMsXgVXv3BLzUgSXRplE',
  'EMILY': 'LcfcDJNUP1GQjkzn1xUU',
  'MIMI': 'zrHiDhphv9ZnVXBqCLjz',
  'NICOLE': 'piTKgcLEGmPE4e6mEKli',
  'JESSIE': 't0jbNlBVZ17f02VDIeMI',
  'ADAM': 'pNInz6obpgDQGcFmaJgB',
  'ANTONI': 'ErXwobaYiN019PkySvjV',
  'ARNOLD': 'VR6AewLTigWG4xSOukaG',
  'JOSH': 'TxGEqnHWrfWFTfGW9XjX',
  'SAM': 'yoZ06aMxZJJ28mfd3POQ',
  'CALLUM': 'N2lVS1w4EtoT3dr4eOWO',
  'CHARLIE': 'IKne3meq5aSn9XLyUdCD',
  'CLYDE': '2EiwWnXFnvU5JabPnv8n',
  'DANIEL': 'onwK4e9ZLuTAKqWW03F9',
  'DAVE': 'CYw3kZ02Hs0563khs1Fj',
  'ETHAN': 'g5CIjZEefAph4nQFvHAz',
  'FIN': 'D38z5RcWu1voky8WS1ja',
  'GIOVANNI': 'zcAOhNBS3c14rBihAFp1',
  'HARRY': 'SOYHLrjzK2X1ezoPC6cr',
  'JAMES': 'ZQe5CZNOzWyzPSCn5a3c',
  'JEREMY': 'bVMeCyTHy58xNoL34h3p',
  'JOSEPH': 'Zlb1dXrM653N07WRdFW3',
  'LIAM': 'TX3LPaxmHKxFdv7VOQHJ',
  'MATTHEW': 'Yko7PKHZNXotIFUBG7I9',
  'MICHAEL': 'flq6f7yk4E4fJM5XTYuZ',
  'PATRICK': 'ODq5zmih8GrVes37Dizd',
  'RYAN': 'wViXBPUzp2ZZixB1xQuM',
  'THOMAS': 'GBv7mTt0atIp3Br8iCZE',
  'NO_VOICE': 'NO_VOICE'
}

// Voice ID to name mapping (reverse)
const VOICE_ID_TO_NAME = Object.fromEntries(
  Object.entries(VOICE_NAME_TO_ID).map(([name, id]) => [id, name])
)

const VOICE_OPTIONS = [
  // 여성 음성
  { label: '여성, 차분하고 나레이션에 적합 (Rachel)', value: 'RACHEL' },
  { label: '여성, 부드럽고 따뜻한 음색 (Bella)', value: 'BELLA' },
  { label: '여성, 감정적이고 명확한 음색 (Elli)', value: 'ELLI' },
  { label: '여성, 자신감 있고 강인한 음색 (Domi)', value: 'DOMI' },
  { label: '여성, 활기차고 젊은 음색 (Dorothy)', value: 'DOROTHY' },
  { label: '여성, 신비롭고 우아한 음색 (Freya)', value: 'FREYA' },
  { label: '여성, 밝고 경쾌한 음색 (Gigi)', value: 'GIGI' },
  { label: '여성, 마법적이고 신비한 음색 (Glinda)', value: 'GLINDA' },
  { label: '여성, 우아하고 세련된 음색 (Grace)', value: 'GRACE' },
  { label: '여성, 성숙하고 지적인 음색 (Matilda)', value: 'MATILDA' },
  { label: '여성, 부드럽고 달콤한 음색 (Serena)', value: 'SERENA' },
  { label: '여성, 활발하고 친근한 음색 (Emily)', value: 'EMILY' },
  { label: '여성, 쾌활하고 귀여운 음색 (Mimi)', value: 'MIMI' },
  { label: '여성, 세련되고 모던한 음색 (Nicole)', value: 'NICOLE' },
  { label: '여성, 따뜻하고 친숙한 음색 (Jessie)', value: 'JESSIE' },

  // 남성 음성
  { label: '남성, 깊고 명확한 음색 (Adam)', value: 'ADAM' },
  { label: '남성, 조절되고 중성적인 음색 (Antoni)', value: 'ANTONI' },
  { label: '남성, 진중하고 나레이션 전용 (Arnold)', value: 'ARNOLD' },
  { label: '남성, 깊고 은빛 음색 (Josh)', value: 'JOSH' },
  { label: '남성, 라디오 진행자 스타일 (Sam)', value: 'SAM' },
  { label: '남성, 친근하고 대화적인 음색 (Callum)', value: 'CALLUM' },
  { label: '남성, 젊고 활기찬 음색 (Charlie)', value: 'CHARLIE' },
  { label: '남성, 중년의 성숙한 음색 (Clyde)', value: 'CLYDE' },
  { label: '남성, 따뜻하고 신뢰감 있는 음색 (Daniel)', value: 'DANIEL' },
  { label: '남성, 편안하고 일상적인 음색 (Dave)', value: 'DAVE' },
  { label: '남성, 젊고 에너지 넘치는 음색 (Ethan)', value: 'ETHAN' },
  { label: '남성, 부드럽고 차분한 음색 (Fin)', value: 'FIN' },
  { label: '남성, 이탈리아 억양의 매력적 음색 (Giovanni)', value: 'GIOVANNI' },
  { label: '남성, 영국 억양의 귀족적 음색 (Harry)', value: 'HARRY' },
  { label: '남성, 신뢰감 있고 전문적인 음색 (James)', value: 'JAMES' },
  { label: '남성, 젊고 캐주얼한 음색 (Jeremy)', value: 'JEREMY' },
  { label: '남성, 따뜻하고 부드러운 음색 (Joseph)', value: 'JOSEPH' },
  { label: '남성, 역동적이고 현대적인 음색 (Liam)', value: 'LIAM' },
  { label: '남성, 성숙하고 안정감 있는 음색 (Matthew)', value: 'MATTHEW' },
  { label: '남성, 깊고 카리스마 있는 음색 (Michael)', value: 'MICHAEL' },
  { label: '남성, 활발하고 친근한 음색 (Patrick)', value: 'PATRICK' },
  { label: '남성, 시원하고 현대적인 음색 (Ryan)', value: 'RYAN' },
  { label: '남성, 안정되고 신뢰감 있는 음색 (Thomas)', value: 'THOMAS' },

  { label: '음성 없음 (NO_VOICE)', value: 'NO_VOICE' }
]

export default function CharacterSettingsEditor({ identificationNumber, characters, onSuccess }) {
  const [characterList, setCharacterList] = useState(characters)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // default to collapsed

  useEffect(() => {
    // Characters from server already have voice names, no conversion needed
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
      // Characters already have voice names, send directly to server
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
import React from 'react'

const VOICE_DETAILS = [
  { name: 'Alloy', gender: '중성형', description: '다목적, 중립적인 톤', character: '냉철한 탐정, 사색하는 주인공' },
  { name: 'Ash', gender: '남성형', description: '감성적이고 섬세한 표현', character: '감성적인 시인, 섬세한 인물' },
  { name: 'Ballad', gender: '여성형', description: '서사적이고 드라마틱', character: '영웅담을 전하는 이야기꾼' },
  { name: 'Coral', gender: '여성형', description: '맑고 청명한 내레이터 톤', character: '맑은 분위기의 내레이터' },
  { name: 'Echo', gender: '남성형', description: '따뜻하고 친근한 대화형', character: '정 많은 친구, 소탈한 조연' },
  { name: 'Fable', gender: '여성형', description: '동화적이고 서정적인 분위기', character: '판타지 세계의 안내자' },
  { name: 'Nova', gender: '여성형', description: '밝고 에너지 넘치는 고음', character: '활발한 소녀 캐릭터' },
  { name: 'Onyx', gender: '남성형', description: '저음, 권위적이고 진중함', character: '악역 보스, 지휘관' },
  { name: 'Sage', gender: '남성형', description: '지혜롭고 차분한 분위기', character: '조언자, 스승' },
  { name: 'Shimmer', gender: '여성형', description: '맑고 감정 풍부한 톤', character: '감성적인 내레이터, 로맨스 인물' },
  { name: 'Verse', gender: '중성형', description: '시적이고 리드미컬한 표현', character: '시적인 캐릭터, 리듬감 있는 인물' },
]

export default function VoiceInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">보이스 특성 안내</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">닫기 ✖</button>
        </div>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border">보이스</th>
              <th className="py-2 px-3 border">성별 느낌</th>
              <th className="py-2 px-3 border">특징</th>
              <th className="py-2 px-3 border">어울리는 캐릭터</th>
            </tr>
          </thead>
          <tbody>
            {VOICE_DETAILS.map((voice) => (
              <tr key={voice.name} className="border-b">
                <td className="py-2 px-3 border">{voice.name}</td>
                <td className="py-2 px-3 border">{voice.gender}</td>
                <td className="py-2 px-3 border">{voice.description}</td>
                <td className="py-2 px-3 border">{voice.character}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
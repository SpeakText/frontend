// ✅ ScriptFragmentListItem.jsx (업데이트 버전)

const AVAILABLE_COLORS = [
  'bg-blue-50 text-blue-800',
  'bg-green-50 text-green-800',
  'bg-pink-50 text-pink-800',
  'bg-purple-50 text-purple-800',
  'bg-yellow-50 text-yellow-800',
  'bg-rose-50 text-rose-800',
  'bg-lime-50 text-lime-800',
  'bg-sky-50 text-sky-800',
  'bg-orange-50 text-orange-800',
  'bg-cyan-50 text-cyan-800',
  'bg-teal-50 text-teal-800',
]

const speakerColorCache = {}
let colorIndex = 0

function getColorClass(speaker) {
  if (speakerColorCache[speaker]) return speakerColorCache[speaker]

  // 나레이션은 고정 색상
  if (speaker === '나레이션 - narration') {
    speakerColorCache[speaker] = 'bg-gray-50 text-gray-700'
    return speakerColorCache[speaker]
  }

  const color = AVAILABLE_COLORS[colorIndex % AVAILABLE_COLORS.length]
  colorIndex++
  speakerColorCache[speaker] = color
  return color
}

export default function ScriptFragmentListItem({ fragment, speakerOptions, onEdit }) {
  const label = speakerOptions.find(opt => opt.value === fragment.speaker)?.label || fragment.speaker
  const colorClass = getColorClass(fragment.speaker)

  return (
    <div className={`flex justify-between items-center ${colorClass} border-b border-gray-200 py-2 px-3 rounded hover:shadow-sm transition`}>
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium">
          <span className="mr-2">{label}:</span>
          <span className="truncate">{fragment.utterance}</span>
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        <button
          onClick={() => onEdit(fragment)}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200"
        >
          편집
        </button>
      </div>
    </div>
  )
}

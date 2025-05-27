export default function ScriptFragmentListItem({ fragment, speakerOptions, onEdit }) {
  const label = speakerOptions.find(opt => opt.value === fragment.speaker)?.label || fragment.speaker

  return (
    <div className="flex justify-between items-center border-b border-gray-200 py-2 px-1 hover:bg-gray-50 transition">
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm text-gray-800">
          <strong className="text-gray-500 mr-2">{label}:</strong>
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
export default function ScriptFragmentListItem({ fragment, speakerOptions, onEdit }) {
    const label = speakerOptions.find(opt => opt.value === fragment.speaker)?.label || fragment.speaker
  
    return (
      <div className="flex justify-between items-center border-b py-2 px-1 hover:bg-gray-50">
        <div className="truncate text-sm text-gray-800">
          <strong className="text-gray-600 mr-2">{label}:</strong>
          <span className="truncate">{fragment.utterance}</span>
        </div>
        <button
          onClick={() => onEdit(fragment)}
          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          편집
        </button>
      </div>
    )
  }
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CustomSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        <span>{selectedOption ? selectedOption.label : '선택'}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                opt.value === value ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
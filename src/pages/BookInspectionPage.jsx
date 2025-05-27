import React, { useState } from 'react'
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'

export default function BookInspectionPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: null,
    price: '',
    identificationNumber: '',
    txtFile: null,
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({ ...prev, [name]: files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const payload = new FormData()
    for (const key in formData) {
      payload.append(key, formData[key])
    }

    try {
      await axiosInstance.post('/api/book/inspection', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess(true)
      alert('검수 요청이 성공적으로 전송되었습니다.')
    } catch (err) {
      console.error(err)
      setError('❌ 검수 요청 실패: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Noto_Sans_KR']">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 space-y-8 border border-gray-100">
          <div className="flex items-center space-x-3">
            <DocumentArrowUpIcon className="w-6 h-6 text-green-600" />
            <h1
              className="text-2xl sm:text-3xl text-gray-800 tracking-tight"
              style={{ fontFamily: "'Ownglyph_corncorn-Rg', cursive" }}
            >
              작품 등록 및 검수 요청
            </h1>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">요청 완료!</div>}

          <form onSubmit={handleSubmit} className="space-y-6 text-[15px] text-gray-700">
            <div>
              <label className="block mb-1 font-medium text-gray-600">제목</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="책 제목을 입력하세요"
                required
                className="w-full rounded-lg px-4 py-2 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="책에 대한 설명을 입력하세요"
                required
                className="w-full rounded-lg px-4 py-2 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">커버 이미지</label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">가격 (₩)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="예: 12000"
                required
                className="w-full rounded-lg px-4 py-2 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">식별자 (ISBN)</label>
              <input
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleChange}
                placeholder="예: 978-89-01-23456-7"
                required
                className="w-full rounded-lg px-4 py-2 border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-400 focus:outline-none placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">텍스트 파일 (.txt)</label>
              <input
                type="file"
                name="txtFile"
                accept=".txt"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
              />
            </div>

            <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg shadow-md transition duration-200"
            >
              검수 요청 제출
            </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
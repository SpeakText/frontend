import React, { useState } from 'react'
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
      alert('✅ 검수 요청이 성공적으로 전송되었습니다.')
    } catch (err) {
      console.error(err)
      setError('❌ 검수 요청 실패: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-xl shadow-lg px-6 py-8 space-y-6">
            <h1 className="text-3xl font-bold mb-2">작품 등록 및 검수 요청</h1>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">요청 완료!</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder:text-gray-400"
                  placeholder="책 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder:text-gray-400"
                  placeholder="책에 대한 설명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">커버 이미지</label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가격 (₩)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder:text-gray-400"
                  placeholder="예: 12000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">식별자 (ISBN)</label>
                <input
                  name="identificationNumber"
                  value={formData.identificationNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder:text-gray-400"
                  placeholder="예: 978-89-01-23456-7"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">텍스트 파일 (.txt)</label>
                <input
                  type="file"
                  name="txtFile"
                  accept=".txt"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-md shadow-md transition"
                >
                  검수 요청 제출
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
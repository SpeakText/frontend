import React, { useState } from 'react'
import axiosInstance from '../lib/axiosInstance'
import Header from '../components/Header'
import Input from '../components/Input'
import TextArea from '../components/TextArea'

export default function BookInspectionPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverUrl: '',
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
    setFormData(prev => ({ ...prev, txtFile: e.target.files[0] }))
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
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">작품 등록 및 검수 요청</h1>

        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-sm">요청 완료!</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="제목" name="title" value={formData.title} onChange={handleChange} />
          <TextArea label="설명" name="description" value={formData.description} onChange={handleChange} />
          <Input label="커버 이미지 URL" name="coverUrl" value={formData.coverUrl} onChange={handleChange} />
          <Input label="가격 (₩)" name="price" type="number" value={formData.price} onChange={handleChange} />
          <Input label="식별자 (ISBN)" name="identificationNumber" value={formData.identificationNumber} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium">텍스트 파일 (.txt)</label>
            <input
              type="file"
              name="txtFile"
              accept=".txt"
              onChange={handleFileChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            검수 요청 제출
          </button>
        </form>
      </div>
    </>
  )
}
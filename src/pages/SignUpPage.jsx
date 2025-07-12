import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../lib/axiosInstance'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    id: '',
    password: '',
    name: '',
    email: '',
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async () => {
    try {
      await axiosInstance.post('/api/author/signup', form)
      navigate('/login')
    } catch (err) {
      const message = err.response?.data?.message || '회원가입 실패'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <InputField label="아이디" name="id" value={form.id} onChange={handleChange} />
          <InputField label="비밀번호" name="password" type="password" value={form.password} onChange={handleChange} />
          <InputField label="이름" name="name" value={form.name} onChange={handleChange} />
          <InputField label="이메일" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <button
          onClick={handleSignup}
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

function InputField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`${label} 입력`}
      />
    </div>
  )
}
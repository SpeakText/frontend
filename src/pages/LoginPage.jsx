import React, { useState } from 'react'
import axiosInstance from '../lib/axiosInstance'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    setError(null)
    try {
      const res = await axiosInstance.post('/api/author/signin', {
        id,
        password,
      })

      alert('✅ 로그인 성공!')
      // 예: 페이지 이동
      // window.location.href = "/script-list"

    } catch (err) {
      const message = err.response?.data?.message || '로그인 실패'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">로그인</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="아이디 입력"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="비밀번호 입력"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
        >
          로그인
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          계정이 없으신가요? <a href="/signup" className="text-blue-600 hover:underline">회원가입</a>
        </p>
      </div>
    </div>
  )
}
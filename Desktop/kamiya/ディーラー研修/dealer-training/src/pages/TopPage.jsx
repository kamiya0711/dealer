import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const INSTRUCTOR_PASSWORD = 'dealer2024'

export default function TopPage() {
  const [name, setName] = useState('')
  const [mode, setMode] = useState('trainee') // 'trainee' | 'instructor'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useUser()
  const navigate = useNavigate()

  const handleLogin = () => {
    if (!name.trim()) {
      setError('名前を入力してください')
      return
    }
    if (mode === 'instructor') {
      if (password !== INSTRUCTOR_PASSWORD) {
        setError('パスワードが違います')
        return
      }
      login(name.trim(), true)
      navigate('/instructor')
    } else {
      login(name.trim(), false)
      navigate('/study')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-emerald-50 to-slate-100">
      {/* ロゴ */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🃏</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">ディーラー研修</h1>
        <p className="text-slate-500 text-sm">ポーカーディーラーになるための学習アプリ</p>
      </div>

      {/* モード切替 */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => { setMode('trainee'); setError('') }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'trainee'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            研修生
          </button>
          <button
            onClick={() => { setMode('instructor'); setError('') }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'instructor'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            インストラクター
          </button>
        </div>
      </div>

      {/* フォーム */}
      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">名前</label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="山田 太郎"
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-colors shadow-sm"
          />
        </div>

        {mode === 'instructor' && (
          <div>
            <label className="block text-sm text-slate-600 mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-colors shadow-sm"
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg transition-colors active:scale-95 shadow-md"
        >
          {mode === 'instructor' ? 'ダッシュボードへ' : '学習を始める'}
        </button>
      </div>
    </div>
  )
}

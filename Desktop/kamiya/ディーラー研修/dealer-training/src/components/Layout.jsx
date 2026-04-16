import { useUser } from '../context/UserContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = user?.isInstructor
    ? [{ path: '/instructor', label: 'ダッシュボード', icon: '📊' }]
    : [
        { path: '/study', label: '教科書', icon: '📖' },
        { path: '/quiz', label: 'クイズ', icon: '✏️' },
        { path: '/progress', label: '進捗', icon: '📈' },
      ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f1f5f9' }}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm">
        <button onClick={() => navigate(user?.isInstructor ? '/instructor' : '/study')} className="font-bold text-lg text-emerald-600">
          🃏 ディーラー研修
        </button>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user.name}</span>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              退出
            </button>
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* ボトムナビ */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-lg">
          <div className="flex">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'text-emerald-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { GAMES } from '../data/games'
import { supabase } from '../lib/supabase'

const availableGames = GAMES.filter(g => g.available)

export default function InstructorPage() {
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [quizRes, studyRes] = await Promise.all([
      supabase.from('quiz_results').select('*'),
      supabase.from('study_progress').select('*'),
    ])

    const map = {}

    for (const row of quizRes.data || []) {
      if (!map[row.user_name]) map[row.user_name] = { name: row.user_name, quiz: {}, study: {} }
      const prev = map[row.user_name].quiz[row.game_id]?.[row.level]
      const pct = row.score / row.total
      const prevPct = prev ? prev.score / prev.total : -1
      if (pct > prevPct) {
        if (!map[row.user_name].quiz[row.game_id]) map[row.user_name].quiz[row.game_id] = {}
        map[row.user_name].quiz[row.game_id][row.level] = row
      }
    }

    for (const row of studyRes.data || []) {
      if (!map[row.user_name]) map[row.user_name] = { name: row.user_name, quiz: {}, study: {} }
      map[row.user_name].study[row.game_id] = true
    }

    setUsers(map)
    setLoading(false)
  }

  const getDotColor = (u, game) => {
    const levels = u.quiz[game.id]
    if (!levels) return 'bg-slate-200'
    const scores = Object.values(levels)
    const best = Math.max(...scores.map(s => s.score / s.total))
    return best >= 0.8 ? 'bg-emerald-500' : 'bg-amber-400'
  }

  const userList = Object.values(users)

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold text-slate-800">インストラクター</h2>
        <button onClick={fetchAll} className="text-xs text-emerald-600 hover:underline">更新</button>
      </div>
      <p className="text-slate-500 text-sm mb-6">研修生の進捗一覧（全国）</p>

      {loading ? (
        <div className="text-center py-20 text-slate-400">読み込み中...</div>
      ) : userList.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-slate-500">まだ研修生が登録されていません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userList.map(u => {
            const studyCount = availableGames.filter(g => u.study[g.id]).length
            const quizCount = availableGames.filter(g => u.quiz[g.id]).length
            const isOpen = selected === u.name
            return (
              <div key={u.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setSelected(isOpen ? null : u.name)}
                  className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      教科書 {studyCount}/{availableGames.length} ・ クイズ {quizCount}/{availableGames.length}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap max-w-[120px] justify-end">
                    {availableGames.map(g => (
                      <div key={g.id} className={`w-2 h-2 rounded-full ${getDotColor(u, g)}`} />
                    ))}
                  </div>
                  <span className="text-slate-400 ml-1">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <div className="pt-3 space-y-2">
                      {availableGames.map(g => {
                        const levels = u.quiz[g.id] || {}
                        const studyDone = u.study[g.id]
                        const bestEntry = Object.values(levels).sort((a, b) => b.score / b.total - a.score / a.total)[0]
                        return (
                          <div key={g.id} className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 flex-1 truncate">{g.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${studyDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                              📖 {studyDone ? '読了' : '未読'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              bestEntry
                                ? bestEntry.score / bestEntry.total >= 0.8
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              ✏️ {bestEntry ? `${Math.round(bestEntry.score / bestEntry.total * 100)}%` : '未実施'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-3">凡例</h3>
        <div className="flex gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span>80%以上</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /><span>80%未満</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-200" /><span>未実施</span></div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { GAMES } from '../data/games'
import { getAllUsersProgress } from '../lib/progress'

export default function InstructorPage() {
  const { user } = useUser()
  const [selected, setSelected] = useState(null)
  const allUsers = getAllUsersProgress()
  const userList = Object.values(allUsers)
  const availableGames = GAMES.filter(g => g.available)

  const getStatusColor = (p, game) => {
    if (!p?.[game.id]?.quizDone) return 'bg-slate-700'
    const score = p[game.id].bestScore / p[game.id].quizTotal
    return score >= 0.8 ? 'bg-emerald-500' : 'bg-yellow-500'
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">インストラクター</h2>
      <p className="text-slate-400 text-sm mb-6">研修生の進捗一覧</p>

      {userList.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-slate-400">まだ研修生が登録されていません</p>
          <p className="text-slate-600 text-sm mt-2">研修生がログインすると自動的に表示されます</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userList.map(u => {
            const p = u.progress || {}
            const studyCount = availableGames.filter(g => p[g.id]?.studyDone).length
            const quizCount = availableGames.filter(g => p[g.id]?.quizDone).length
            const isOpen = selected === u.name

            return (
              <div
                key={u.name}
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setSelected(isOpen ? null : u.name)}
                  className="w-full px-4 py-4 flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      教科書 {studyCount}/{availableGames.length} ・ クイズ {quizCount}/{availableGames.length}
                    </div>
                  </div>
                  {/* ミニ進捗ドット */}
                  <div className="flex gap-1">
                    {availableGames.map(g => (
                      <div
                        key={g.id}
                        className={`w-2 h-2 rounded-full ${getStatusColor(p, g)}`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-600 ml-1">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-slate-700">
                    <div className="pt-3 space-y-2">
                      {availableGames.map(g => {
                        const gp = p[g.id] || {}
                        const score = gp.bestScore
                        const total = gp.quizTotal
                        return (
                          <div key={g.id} className="flex items-center gap-3">
                            <span className="text-sm text-slate-300 flex-1">{g.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${gp.studyDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                              📖 {gp.studyDone ? '読了' : '未読'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              gp.quizDone
                                ? score/total >= 0.8
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-slate-700 text-slate-500'
                            }`}>
                              ✏️ {gp.quizDone ? `${score}/${total}` : '未実施'}
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

      <div className="mt-6 bg-slate-800 rounded-2xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">凡例</h3>
        <div className="flex gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>クイズ80%以上</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>クイズ完了（80%未満）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <span>未完了</span>
          </div>
        </div>
      </div>
    </div>
  )
}

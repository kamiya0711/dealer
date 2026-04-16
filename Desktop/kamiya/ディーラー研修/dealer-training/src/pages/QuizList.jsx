import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { GAMES, CATEGORIES } from '../data/games'
import { getProgress } from '../lib/progress'

const LEVELS = [
  { key: 'beginner',     label: '初級', desc: '基礎ルール',           color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', dot: 'bg-emerald-500' },
  { key: 'intermediate', label: '中級', desc: 'シチュエーション',     color: 'text-yellow-400',  bg: 'bg-yellow-500/20',  border: 'border-yellow-500/40',  dot: 'bg-yellow-500'  },
  { key: 'advanced',     label: '上級', desc: 'TDAルール',             color: 'text-red-400',     bg: 'bg-red-500/20',     border: 'border-red-500/40',     dot: 'bg-red-500'     },
]

export default function QuizList() {
  const navigate = useNavigate()
  const { user } = useUser()
  const progress = getProgress(user?.name)
  const categoryOrder = ['community', 'stud', 'draw', 'hybrid', 'mixed']

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">クイズ</h2>
      <p className="text-slate-400 text-sm mb-6">難易度を選んで挑戦しよう</p>

      {categoryOrder.map(cat => {
        const games = GAMES.filter(g => g.category === cat)
        return (
          <div key={cat} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {CATEGORIES[cat]}
            </h3>
            <div className="space-y-3">
              {games.map(game => {
                const gp = progress[game.id] || {}
                return (
                  <div
                    key={game.id}
                    className={`rounded-2xl border overflow-hidden ${
                      game.available ? 'border-slate-700 bg-slate-800' : 'border-slate-800 bg-slate-900 opacity-50'
                    }`}
                  >
                    {/* ゲーム名 */}
                    <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                      <span className={`font-medium ${game.available ? 'text-white' : 'text-slate-500'}`}>
                        {game.name}
                      </span>
                      {!game.available && (
                        <span className="text-xs text-slate-600 ml-auto">準備中</span>
                      )}
                    </div>

                    {/* 難易度ボタン */}
                    <div className="flex gap-2 px-3 pb-3">
                      {LEVELS.map(lv => {
                        const lp = gp[lv.key]
                        const done = lp?.done
                        const pct = done ? Math.round(lp.bestScore / lp.total * 100) : null
                        const pass = pct != null && pct >= 80

                        return (
                          <button
                            key={lv.key}
                            onClick={() => game.available && navigate(`/quiz/${game.id}/${lv.key}`)}
                            disabled={!game.available}
                            className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border transition-all active:scale-95 ${
                              game.available
                                ? done
                                  ? `${lv.bg} ${lv.border} hover:opacity-80`
                                  : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                : 'bg-slate-800 border-slate-700 cursor-not-allowed'
                            }`}
                          >
                            <span className={`text-xs font-bold ${game.available ? lv.color : 'text-slate-600'}`}>
                              {lv.label}
                            </span>
                            {done ? (
                              <span className={`text-xs mt-0.5 font-semibold ${pass ? lv.color : 'text-slate-400'}`}>
                                {pct}%
                              </span>
                            ) : (
                              <span className="text-xs mt-0.5 text-slate-500">
                                {game.available ? '未挑戦' : '－'}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* 凡例 */}
      <div className="mt-4 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
        <div className="flex gap-4 justify-center text-xs text-slate-400">
          {LEVELS.map(lv => (
            <div key={lv.key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${lv.dot}`} />
              <span>{lv.label}：{lv.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

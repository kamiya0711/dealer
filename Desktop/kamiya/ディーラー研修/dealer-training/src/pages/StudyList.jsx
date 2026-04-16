import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { GAMES, CATEGORIES } from '../data/games'
import { getProgress } from '../lib/progress'

export default function StudyList() {
  const navigate = useNavigate()
  const { user } = useUser()
  const progress = getProgress(user?.name)

  const categoryOrder = ['community', 'stud', 'draw', 'hybrid', 'mixed']

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">教科書</h2>
      <p className="text-slate-400 text-sm mb-6">ゲームを選んでルールを学ぼう</p>

      {categoryOrder.map(cat => {
        const games = GAMES.filter(g => g.category === cat)
        return (
          <div key={cat} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {CATEGORIES[cat]}
            </h3>
            <div className="space-y-2">
              {games.map(game => {
                const p = progress[game.id]
                const studyDone = p?.studyDone
                return (
                  <button
                    key={game.id}
                    onClick={() => game.available && navigate(`/study/${game.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                      game.available
                        ? 'border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-slate-700 active:scale-99'
                        : 'border-slate-800 bg-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      studyDone ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {studyDone ? '✓' : '○'}
                    </span>
                    <span className={`font-medium ${game.available ? 'text-white' : 'text-slate-500'}`}>
                      {game.name}
                    </span>
                    {!game.available && (
                      <span className="ml-auto text-xs text-slate-600">準備中</span>
                    )}
                    {game.available && (
                      <span className="ml-auto text-slate-600">›</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

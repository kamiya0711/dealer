import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { GAMES, CATEGORIES } from '../data/games'
import { getProgress } from '../lib/progress'

export default function StudyList() {
  const navigate = useNavigate()
  const { user } = useUser()
  const progress = getProgress(user?.name)

  const categoryOrder = ['bet_structure', 'community', 'stud', 'draw', 'hybrid', 'mixed']

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">教科書</h2>
      <p className="text-slate-500 text-sm mb-6">ゲームを選んでルールを学ぼう</p>

      {categoryOrder.map(cat => {
        const games = GAMES.filter(g => g.category === cat)
        return (
          <div key={cat} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left shadow-sm ${
                      game.available
                        ? 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 active:scale-99'
                        : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      studyDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {studyDone ? '✓' : '○'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`font-medium block ${game.available ? 'text-slate-800' : 'text-slate-400'}`}>
                        {game.name}
                      </span>
                      {game.nameEn && (
                        <span className="text-xs text-slate-400">{game.nameEn}</span>
                      )}
                    </div>
                    {!game.available && (
                      <span className="ml-auto text-xs text-slate-400 flex-shrink-0">準備中</span>
                    )}
                    {game.available && (
                      <span className="ml-auto text-slate-400 flex-shrink-0">›</span>
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

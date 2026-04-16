import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { GAMES } from '../data/games'
import { getProgress } from '../lib/progress'

export default function ProgressPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const progress = getProgress(user?.name)

  const availableGames = GAMES.filter(g => g.available)
  const studyDoneCount = availableGames.filter(g => progress[g.id]?.studyDone).length
  const quizDoneCount = availableGames.filter(g => progress[g.id]?.quizDone).length

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">進捗確認</h2>
      <p className="text-slate-500 text-sm mb-6">{user?.name} さんの学習状況</p>

      {/* サマリー */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-3xl font-black text-emerald-500">{studyDoneCount}<span className="text-base text-slate-400">/{availableGames.length}</span></div>
          <div className="text-sm text-slate-500 mt-1">教科書 完了</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-3xl font-black text-emerald-500">{quizDoneCount}<span className="text-base text-slate-400">/{availableGames.length}</span></div>
          <div className="text-sm text-slate-500 mt-1">クイズ 完了</div>
        </div>
      </div>

      {/* ゲーム別進捗 */}
      <h3 className="text-sm font-semibold text-slate-500 mb-3">ゲーム別</h3>
      <div className="space-y-3">
        {GAMES.filter(g => g.available).map(game => {
          const p = progress[game.id] || {}
          const studyDone = p.studyDone
          const quizDone = p.quizDone
          const score = p.bestScore
          const total = p.quizTotal
          return (
            <div key={game.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-800">{game.name}</span>
                {quizDone && score != null && (
                  <span className={`text-sm font-bold ${score/total >= 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {score}/{total}問
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                  studyDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <span>📖</span>
                  <span>教科書 {studyDone ? '完了' : '未読'}</span>
                </div>
                <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                  quizDone
                    ? score/total >= 0.8
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <span>✏️</span>
                  <span>クイズ {quizDone ? '完了' : '未実施'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => navigate('/study')}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-colors shadow-md"
        >
          教科書を読む
        </button>
        <button
          onClick={() => navigate('/quiz')}
          className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors shadow-sm"
        >
          クイズに挑戦
        </button>
      </div>
    </div>
  )
}

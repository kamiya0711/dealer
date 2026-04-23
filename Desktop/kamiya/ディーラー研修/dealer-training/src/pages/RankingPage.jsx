import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'

const GAME_LABELS = {
  holdem: 'ホールデム',
  omaha: 'オマハ',
  omaha_hilo: 'オマハ Hi-Lo',
  pineapple: 'パイナップル',
  crazy_pineapple: 'クレイジーパイナップル',
  stud: 'スタッド',
  stud_hilo: 'スタッド Hi-Lo',
  five_stud: 'ファイブスタッド',
  five_draw: 'ファイブドロー',
  razz: 'ラズ',
  triple_draw_27: 'トリプルドロー 2-7',
  triple_draw_a5: 'トリプルドロー A-5',
  badugi: 'バドゥーギ',
  nl: 'ノーリミット',
  pl: 'ポットリミット',
  fl: 'フィクストリミット',
}

const LEVEL_LABELS = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [gameFilter, setGameFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('score', { ascending: false })
      .order('avg_time_seconds', { ascending: true })
      .limit(500)

    if (!error && data) {
      // ユーザー×ゲーム×レベルごとにベストスコアを集計
      const bestMap = {}
      for (const row of data) {
        const key = `${row.user_name}__${row.game_id}__${row.level}`
        if (!bestMap[key]) {
          bestMap[key] = row
        } else {
          const prev = bestMap[key]
          const prevPct = prev.score / prev.total
          const newPct = row.score / row.total
          if (newPct > prevPct || (newPct === prevPct && row.avg_time_seconds < prev.avg_time_seconds)) {
            bestMap[key] = row
          }
        }
      }
      setRankings(Object.values(bestMap))
    }
    setLoading(false)
  }

  const filtered = rankings.filter(r => {
    if (gameFilter !== 'all' && r.game_id !== gameFilter) return false
    if (levelFilter !== 'all' && r.level !== levelFilter) return false
    return true
  }).sort((a, b) => {
    const pctA = a.score / a.total
    const pctB = b.score / b.total
    if (pctB !== pctA) return pctB - pctA
    return (a.avg_time_seconds ?? 999) - (b.avg_time_seconds ?? 999)
  })

  const myRank = user ? filtered.findIndex(r => r.user_name === user.name) + 1 : 0

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/study')} className="text-sm text-slate-500 hover:text-slate-800">
          ← 戻る
        </button>
        <h1 className="text-xl font-bold text-slate-800">🏆 ランキング</h1>
      </div>

      {/* フィルター */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          value={gameFilter}
          onChange={e => setGameFilter(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-emerald-400"
        >
          <option value="all">全ゲーム</option>
          {Object.entries(GAME_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-emerald-400"
        >
          <option value="all">全レベル</option>
          {Object.entries(LEVEL_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      </div>

      {/* 自分の順位 */}
      {user && myRank > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4 text-center">
          <span className="text-emerald-700 font-bold">あなたの順位: {myRank}位</span>
          <span className="text-emerald-500 text-sm ml-2">/ {filtered.length}人中</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">まだデータがありません</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row, i) => {
            const pct = Math.round(row.score / row.total * 100)
            const isMe = user?.name === row.user_name
            const rank = i + 1
            return (
              <div
                key={row.id}
                className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border shadow-sm ${
                  isMe ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <div className="w-8 text-center text-lg font-bold text-slate-400">
                  {rank <= 3 ? MEDAL[rank - 1] : `${rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">
                    {row.user_name} {isMe && <span className="text-emerald-500 text-xs">（あなた）</span>}
                  </div>
                  <div className="text-xs text-slate-400">
                    {GAME_LABELS[row.game_id] ?? row.game_id} / {LEVEL_LABELS[row.level] ?? row.level}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-slate-800">{pct}%</div>
                  <div className="text-xs text-slate-400">
                    {row.score}/{row.total}問 · {row.avg_time_seconds ?? '-'}秒/問
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

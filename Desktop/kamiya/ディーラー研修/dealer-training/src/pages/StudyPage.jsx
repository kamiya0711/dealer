import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { holdemStudy } from '../data/holdem'
import { omahaStudy } from '../data/omaha'
import { razzStudy } from '../data/razz'
import { tripleDraw27Study } from '../data/triple_draw_27'
import { tripleDrawA5Study } from '../data/triple_draw_a5'
import { badugiStudy } from '../data/badugi'
import { markStudyDone } from '../lib/progress'

const STUDY_DATA = {
  holdem: holdemStudy,
  omaha: omahaStudy,
  razz: razzStudy,
  triple_draw_27: tripleDraw27Study,
  triple_draw_a5: tripleDrawA5Study,
  badugi: badugiStudy,
}

export default function StudyPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const [activeSection, setActiveSection] = useState(0)

  const data = STUDY_DATA[gameId]

  useEffect(() => {
    setActiveSection(0)
  }, [gameId])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">このゲームはまだ準備中です</p>
      </div>
    )
  }

  const section = data.sections[activeSection]
  const isLast = activeSection === data.sections.length - 1

  const handleNext = () => {
    if (isLast) {
      markStudyDone(user.name, gameId)
      navigate(`/quiz/${gameId}`)
    } else {
      setActiveSection(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* 戻るボタン */}
      <button
        onClick={() => navigate('/study')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
      >
        ← 一覧に戻る
      </button>

      {/* タイトル */}
      <h2 className="text-xl font-bold text-slate-800 mb-1">{data.name}</h2>

      {/* 進捗バー */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${((activeSection + 1) / data.sections.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 flex-shrink-0">
          {activeSection + 1} / {data.sections.length}
        </span>
      </div>

      {/* セクションナビ（横スクロール） */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {data.sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === activeSection
                ? 'bg-emerald-500 text-white'
                : i < activeSection
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-500'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* コンテンツカード */}
      <div className="bg-white rounded-2xl p-5 mb-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-emerald-600 mb-4">{section.title}</h3>
        <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
          {section.content}
        </div>
      </div>

      {/* ナビボタン */}
      <div className="flex gap-3">
        {activeSection > 0 && (
          <button
            onClick={() => { setActiveSection(prev => prev - 1); window.scrollTo(0, 0) }}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors shadow-sm"
          >
            ← 前へ
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-colors active:scale-95 shadow-md"
        >
          {isLast ? 'クイズに挑戦！ →' : '次へ →'}
        </button>
      </div>
    </div>
  )
}

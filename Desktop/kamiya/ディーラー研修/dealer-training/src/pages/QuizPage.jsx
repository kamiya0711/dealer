import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { holdemQuiz } from '../data/holdem'
import { saveQuizResult } from '../lib/progress'

const QUIZ_DATA = {
  holdem: holdemQuiz,
}

const LEVEL_META = {
  beginner:     { label: '初級', color: 'text-emerald-400', bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  intermediate: { label: '中級', color: 'text-yellow-400',  bg: 'bg-yellow-500',  bgLight: 'bg-yellow-500/10',  border: 'border-yellow-500/30'  },
  advanced:     { label: '上級', color: 'text-red-400',      bg: 'bg-red-500',      bgLight: 'bg-red-500/10',      border: 'border-red-500/30'      },
}

export default function QuizPage() {
  const { gameId, level } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const quiz = QUIZ_DATA[gameId]
  const meta = LEVEL_META[level]

  // 70問からランダムに20問選ぶ
  const pickQuestions = () => {
    if (!quiz?.levels?.[level]) return []
    const all = quiz.levels[level].questions
    const shuffled = [...all].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 20)
  }
  const [questions, setQuestions] = useState(pickQuestions)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)

  if (!quiz || !quiz.levels[level]) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">このクイズはまだ準備中です</p>
      </div>
    )
  }

  const q = questions[current]
  const total = questions.length

  const handleAnswer = (value) => {
    if (answered) return
    setSelected(value)
    setAnswered(true)
  }

  const handleNext = () => {
    const correct = selected === q.answer
    const newResults = [...results, { correct, selected }]

    if (current + 1 >= total) {
      const finalScore = newResults.filter(r => r.correct).length
      saveQuizResult(user.name, gameId, level, finalScore, total)
      setResults(newResults)
      setFinished(true)
    } else {
      setResults(newResults)
      setCurrent(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
      window.scrollTo(0, 0)
    }
  }

  if (finished) {
    const finalScore = results.filter(r => r.correct).length
    const pct = Math.round(finalScore / total * 100)
    const pass = pct >= 80
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">{pct >= 90 ? '🎉' : pct >= 70 ? '👍' : '💪'}</div>
        <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${meta.bgLight} ${meta.color}`}>
          {meta.label}
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {pct >= 90 ? '優秀！' : pct >= 70 ? 'もう少し！' : '再挑戦しよう'}
        </h2>

        <div className="my-4">
          <div className="text-5xl font-black text-white">
            {finalScore}<span className="text-xl text-slate-400">/{total}</span>
          </div>
          <div className={`text-lg font-bold mt-1 ${pass ? meta.color : 'text-slate-400'}`}>{pct}%</div>
          {pass && <div className="text-sm text-slate-400 mt-1">合格！（80%以上）</div>}
        </div>

        {/* 正誤詳細 */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6 text-left space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="flex gap-2 items-start text-sm">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                results[i].correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {results[i].correct ? '○' : '×'}
              </span>
              <div>
                <p className={results[i].correct ? 'text-slate-300' : 'text-slate-400'}>{q.question}</p>
                {!results[i].correct && (
                  <p className="text-slate-500 text-xs mt-1">💡 {q.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setQuestions(pickQuestions()); setCurrent(0); setSelected(null); setAnswered(false); setResults([]); setFinished(false) }}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className={`flex-1 py-3 rounded-xl ${meta.bg} text-white font-bold transition-colors hover:opacity-90`}
          >
            クイズ一覧へ
          </button>
        </div>
      </div>
    )
  }

  const isCorrect = selected === q.answer

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* 戻る＋難易度バッジ */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/quiz')}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← 一覧に戻る
        </button>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.bgLight} ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      {/* 進捗バー */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${meta.bg}`}
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{current + 1} / {total}</span>
      </div>

      {/* 問題カード */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-5 border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Q{current + 1}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
            {q.type === 'truefalse' ? '○ × 問題' : '選択問題'}
          </span>
          {q.situation && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              状況判断
            </span>
          )}
        </div>

        {/* 状況説明 */}
        {q.situation && (
          <div className="mb-4 p-3 rounded-xl bg-slate-700/60 border-l-2 border-blue-400">
            <p className="text-xs font-semibold text-blue-400 mb-1">【状況】</p>
            <p className="text-slate-200 text-sm leading-relaxed">{q.situation}</p>
          </div>
        )}

        <p className="text-white font-medium leading-relaxed">{q.question}</p>
      </div>

      {/* 選択肢 */}
      {q.type === 'truefalse' ? (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[true, false].map(val => {
            const label = val ? '○ 正しい' : '× 間違い'
            const isSelected = selected === val
            const isAnswer = answered && val === q.answer
            const isWrong = answered && isSelected && !isCorrect
            return (
              <button
                key={String(val)}
                onClick={() => handleAnswer(val)}
                className={`py-5 rounded-2xl text-lg font-bold transition-all active:scale-95 border-2 ${
                  !answered
                    ? 'border-slate-700 bg-slate-800 text-white hover:border-slate-500'
                    : isAnswer
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isWrong
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3 mb-5">
          {q.choices.map((choice, i) => {
            const isSelected = selected === i
            const isAnswer = answered && i === q.answer
            const isWrong = answered && isSelected && !isCorrect
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border-2 ${
                  !answered
                    ? 'border-slate-700 bg-slate-800 text-white hover:border-slate-500'
                    : isAnswer
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : isWrong
                        ? 'border-red-500 bg-red-500/20 text-red-300'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + i)}. </span>
                {choice}
              </button>
            )
          })}
        </div>
      )}

      {/* 解説 */}
      {answered && (
        <div className={`rounded-2xl p-4 mb-5 border ${
          isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className={`font-bold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCorrect ? '✓ 正解！' : '✗ 不正解'}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className={`w-full py-3 rounded-xl ${meta.bg} text-white font-bold transition-colors hover:opacity-90 active:scale-95`}
        >
          {current + 1 >= total ? '結果を見る' : '次の問題へ →'}
        </button>
      )}
    </div>
  )
}

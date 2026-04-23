import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import { saveQuizResult } from '../lib/progress'

import { holdemQuiz } from '../data/holdem'
import { omahaQuiz } from '../data/omaha'
import { razzQuiz } from '../data/razz'
import { tripleDraw27Quiz } from '../data/triple_draw_27'
import { tripleDrawA5Quiz } from '../data/triple_draw_a5'
import { badugiQuiz } from '../data/badugi'
import { nlQuiz, plQuiz, flQuiz } from '../data/bet_structures'
import { omahaHiloQuiz } from '../data/omaha_hilo'
import { pineappleQuiz, crazyPineappleQuiz } from '../data/pineapple'
import { studHiloQuiz, fiveDrawQuiz } from '../data/stud_variants'
import { studQuiz, fiveStudQuiz } from '../data/stud'

const QUIZ_DATA = {
  holdem: holdemQuiz, omaha: omahaQuiz, omaha_hilo: omahaHiloQuiz,
  pineapple: pineappleQuiz, crazy_pineapple: crazyPineappleQuiz,
  stud: studQuiz, stud_hilo: studHiloQuiz, five_stud: fiveStudQuiz,
  five_draw: fiveDrawQuiz, razz: razzQuiz,
  triple_draw_27: tripleDraw27Quiz, triple_draw_a5: tripleDrawA5Quiz,
  badugi: badugiQuiz, nl: nlQuiz, pl: plQuiz, fl: flQuiz,
}

const GAME_LABELS = {
  holdem: 'ホールデム', omaha: 'オマハ', omaha_hilo: 'オマハ Hi-Lo',
  pineapple: 'パイナップル', crazy_pineapple: 'クレイジーパイナップル',
  stud: 'スタッド', stud_hilo: 'スタッド Hi-Lo', five_stud: 'ファイブスタッド',
  five_draw: 'ファイブドロー', razz: 'ラズ',
  triple_draw_27: '2-7トリプルドロー', triple_draw_a5: 'A-5トリプルドロー',
  badugi: 'バドゥギ', nl: 'ノーリミット', pl: 'ポットリミット', fl: 'フィックスリミット',
}

const LEVEL_LABELS = { beginner: '初級', intermediate: '中級', advanced: '上級' }
const LEVEL_COLORS = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
}

const QUESTION_COUNT = 20

function buildPool() {
  const pool = []
  for (const [gameId, quiz] of Object.entries(QUIZ_DATA)) {
    if (!quiz?.levels) continue
    for (const [level, data] of Object.entries(quiz.levels)) {
      if (!data?.questions) continue
      for (const q of data.questions) {
        pool.push({ ...q, _gameId: gameId, _level: level })
      }
    }
  }
  return pool.sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT)
}

export default function RandomQuizPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [questions] = useState(buildPool)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const startTime = useRef(Date.now())

  const q = questions[current]
  const total = questions.length
  const isCorrect = selected === q?.answer

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
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000)
      saveQuizResult(user.name, 'random', 'all', finalScore, total)
      supabase.from('quiz_results').insert({
        user_name: user.name,
        game_id: 'random',
        level: 'all',
        score: finalScore,
        total,
        avg_time_seconds: parseFloat((elapsed / total).toFixed(1)),
      })
      setResults(newResults)
      setElapsedSec(elapsed)
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
    const mins = Math.floor(elapsedSec / 60)
    const secs = elapsedSec % 60
    const timeStr = mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`
    const appUrl = 'https://dealer-eta-henna.vercel.app'
    const shareText = [
      `【ポーカーディーラー研修】`,
      `全問ランダムクイズ`,
      `${finalScore}/${total}問正解（${pct}%）${pct >= 90 ? '🎉' : pct >= 70 ? '👍' : '💪'}`,
      `⏱ タイム：${timeStr}`,
      `#ポーカーディーラー #ポーカー`,
      appUrl,
    ].join('\n')
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`

    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">{pct >= 90 ? '🎉' : pct >= 70 ? '👍' : '💪'}</div>
        <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 bg-purple-100 text-purple-700">
          全問ランダム
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {pct >= 90 ? '優秀！' : pct >= 70 ? 'もう少し！' : '再挑戦しよう'}
        </h2>
        <div className="my-4">
          <div className="text-5xl font-black text-slate-800">
            {finalScore}<span className="text-xl text-slate-400">/{total}</span>
          </div>
          <div className="text-lg font-bold mt-1 text-purple-600">{pct}%</div>
          <div className="text-sm text-slate-400 mt-1">⏱ {timeStr}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-6 text-left space-y-3 border border-slate-200 shadow-sm">
          {questions.map((q, i) => (
            <div key={i} className="flex gap-2 items-start text-sm">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                results[i].correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {results[i].correct ? '○' : '×'}
              </span>
              <div className="min-w-0">
                <div className="flex gap-1 mb-0.5 flex-wrap">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${LEVEL_COLORS[q._level] || 'bg-slate-100 text-slate-500'}`}>
                    {LEVEL_LABELS[q._level]}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {GAME_LABELS[q._gameId] || q._gameId}
                  </span>
                </div>
                <p className={results[i].correct ? 'text-slate-700' : 'text-slate-500'}>{q.question}</p>
                {!results[i].correct && (
                  <p className="text-slate-400 text-xs mt-1">💡 {q.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-black text-white font-bold mb-3 hover:opacity-80 transition-opacity shadow-md"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          結果をポストする
        </a>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors shadow-sm"
          >
            クイズ一覧へ
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 rounded-xl bg-purple-500 text-white font-bold transition-colors hover:opacity-90 shadow-md"
          >
            もう一度
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/quiz')} className="text-sm text-slate-500 hover:text-slate-800">
          ← 一覧に戻る
        </button>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
          全問ランダム
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-500 transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 flex-shrink-0">{current + 1} / {total}</span>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Q{current + 1}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${LEVEL_COLORS[q._level] || 'bg-slate-100 text-slate-500'}`}>
            {LEVEL_LABELS[q._level]}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {GAME_LABELS[q._gameId] || q._gameId}
          </span>
          {q.type !== 'truefalse' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">選択問題</span>
          )}
          {q.type === 'truefalse' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">○ × 問題</span>
          )}
        </div>

        {q.situation && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border-l-2 border-blue-400">
            <p className="text-xs font-semibold text-blue-600 mb-1">【状況】</p>
            <p className="text-slate-700 text-sm leading-relaxed">{q.situation}</p>
          </div>
        )}
        <p className="text-slate-800 font-medium leading-relaxed">{q.question}</p>
      </div>

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
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                    : isAnswer
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isWrong
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3 mb-5">
          {q.choices?.map((choice, i) => {
            const isSelected = selected === i
            const isAnswer = answered && i === q.answer
            const isWrong = answered && isSelected && !isCorrect
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border-2 ${
                  !answered
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                    : isAnswer
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : isWrong
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + i)}. </span>
                {choice}
              </button>
            )
          })}
        </div>
      )}

      {answered && (
        <div className={`rounded-2xl p-4 mb-5 border ${
          isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className={`font-bold mb-1 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
            {isCorrect ? '✓ 正解！' : '✗ 不正解'}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold transition-colors hover:opacity-90 active:scale-95 shadow-md"
        >
          {current + 1 >= total ? '結果を見る' : '次の問題へ →'}
        </button>
      )}
    </div>
  )
}

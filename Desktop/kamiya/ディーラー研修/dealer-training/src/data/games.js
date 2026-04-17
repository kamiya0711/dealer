// ゲーム一覧マスタ
export const GAMES = [
  // フェーズ1
  { id: 'holdem', name: 'テキサスホールデム', category: 'community', phase: 1, available: true },

  // フェーズ2（準備中）
  { id: 'omaha', name: 'オマハ', category: 'community', phase: 2, available: true },
  { id: 'omaha_hilo', name: 'オマハハイロー', category: 'community', phase: 2, available: false },
  { id: 'pineapple', name: 'パイナップル', category: 'community', phase: 2, available: false },
  { id: 'crazy_pineapple', name: 'クレイジーパイナップル', category: 'community', phase: 2, available: false },
  { id: 'stud', name: 'セブンカードスタッド', category: 'stud', phase: 2, available: false },
  { id: 'stud_hilo', name: 'スタッドハイロー', category: 'stud', phase: 2, available: false },
  { id: 'razz', name: 'ラズ', category: 'stud', phase: 2, available: true },
  { id: 'five_stud', name: 'ファイブカードスタッド', category: 'stud', phase: 2, available: false },
  { id: 'five_draw', name: 'ファイブカードドロー', category: 'draw', phase: 2, available: false },
  { id: 'triple_draw_27', name: '2-7トリプルドロー', category: 'draw', phase: 2, available: true },
  { id: 'single_draw_27', name: '2-7シングルドロー', category: 'draw', phase: 2, available: false },
  { id: 'triple_draw_a5', name: 'A-5トリプルドロー', category: 'draw', phase: 2, available: true },
  { id: 'badugi', name: 'バドゥギ', category: 'draw', phase: 2, available: true },
  { id: 'badacey', name: 'バダシー', category: 'draw', phase: 2, available: false },
  { id: 'baducy', name: 'バデュシー', category: 'draw', phase: 2, available: false },
  { id: 'dramaha', name: 'ドラマハ', category: 'hybrid', phase: 2, available: false },
  { id: 'dramaha49', name: 'ドラマハ49', category: 'hybrid', phase: 2, available: false },
  { id: 'horse', name: 'H.O.R.S.E.', category: 'mixed', phase: 2, available: false },
  { id: 'eight_game', name: '8ゲームミックス', category: 'mixed', phase: 2, available: false },
  { id: 'ten_game', name: '10ゲームミックス', category: 'mixed', phase: 2, available: false },
]

export const CATEGORIES = {
  community: 'コミュニティカード系',
  stud: 'スタッド系',
  draw: 'ドロー系',
  hybrid: 'ハイブリッド系',
  mixed: 'ミックスゲーム',
}

export function getGame(id) {
  return GAMES.find(g => g.id === id)
}

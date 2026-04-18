// ゲーム一覧マスタ
export const GAMES = [
  // ベット形式
  { id: 'nl',  name: 'ノーリミット',      nameEn: 'No-Limit (NL)',      category: 'bet_structure', phase: 1, available: true },
  { id: 'pl',  name: 'ポットリミット',    nameEn: 'Pot-Limit (PL)',     category: 'bet_structure', phase: 1, available: true },
  { id: 'fl',  name: 'フィックスリミット', nameEn: 'Fixed-Limit (FL)',   category: 'bet_structure', phase: 1, available: true },

  // フェーズ1
  { id: 'holdem', name: 'テキサスホールデム', nameEn: "Texas Hold'em", category: 'community', phase: 1, available: true },

  // フェーズ2（準備中）
  { id: 'omaha',          name: 'オマハ',                 nameEn: 'Omaha',                  category: 'community', phase: 2, available: true },
  { id: 'omaha_hilo',     name: 'オマハハイロー',         nameEn: 'Omaha Hi-Lo',            category: 'community', phase: 2, available: true },
  { id: 'pineapple',      name: 'パイナップル',           nameEn: 'Pineapple',              category: 'community', phase: 2, available: false },
  { id: 'crazy_pineapple',name: 'クレイジーパイナップル', nameEn: 'Crazy Pineapple',        category: 'community', phase: 2, available: false },
  { id: 'stud',           name: 'セブンカードスタッド',   nameEn: '7-Card Stud',            category: 'stud',      phase: 2, available: false },
  { id: 'stud_hilo',      name: 'スタッドハイロー',       nameEn: 'Stud Hi-Lo',             category: 'stud',      phase: 2, available: false },
  { id: 'razz',           name: 'ラズ',                   nameEn: 'Razz',                   category: 'stud',      phase: 2, available: true },
  { id: 'five_stud',      name: 'ファイブカードスタッド', nameEn: '5-Card Stud',            category: 'stud',      phase: 2, available: false },
  { id: 'five_draw',      name: 'ファイブカードドロー',   nameEn: '5-Card Draw',            category: 'draw',      phase: 2, available: false },
  { id: 'triple_draw_27', name: '2-7トリプルドロー',      nameEn: '2-7 Triple Draw',        category: 'draw',      phase: 2, available: true },
  { id: 'single_draw_27', name: '2-7シングルドロー',      nameEn: '2-7 Single Draw',        category: 'draw',      phase: 2, available: false },
  { id: 'triple_draw_a5', name: 'A-5トリプルドロー',      nameEn: 'A-5 Triple Draw',        category: 'draw',      phase: 2, available: true },
  { id: 'badugi',         name: 'バドゥギ',               nameEn: 'Badugi',                 category: 'draw',      phase: 2, available: true },
  { id: 'badacey',        name: 'バダシー',               nameEn: 'Badacey',                category: 'draw',      phase: 2, available: false },
  { id: 'baducy',         name: 'バデュシー',             nameEn: 'Baducy',                 category: 'draw',      phase: 2, available: false },
  { id: 'dramaha',        name: 'ドラマハ',               nameEn: 'Dramaha',                category: 'hybrid',    phase: 2, available: false },
  { id: 'dramaha49',      name: 'ドラマハ49',             nameEn: 'Dramaha 49',             category: 'hybrid',    phase: 2, available: false },
  { id: 'horse',          name: 'H.O.R.S.E.',             nameEn: 'H.O.R.S.E.',             category: 'mixed',     phase: 2, available: false },
  { id: 'eight_game',     name: '8ゲームミックス',        nameEn: '8-Game Mix',             category: 'mixed',     phase: 2, available: false },
  { id: 'ten_game',       name: '10ゲームミックス',       nameEn: '10-Game Mix',            category: 'mixed',     phase: 2, available: false },
]

export const CATEGORIES = {
  bet_structure: 'ベット形式の種類',
  community: 'コミュニティカード系',
  stud: 'スタッド系',
  draw: 'ドロー系',
  hybrid: 'ハイブリッド系',
  mixed: 'ミックスゲーム',
}

export function getGame(id) {
  return GAMES.find(g => g.id === id)
}

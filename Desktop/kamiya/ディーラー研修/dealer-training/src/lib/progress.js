// LocalStorageベースの進捗管理
// Supabase移行時はこのファイルの関数を置き換えるだけでOK

export function getProgress(userName) {
  const users = JSON.parse(localStorage.getItem('dealer_training_users') || '{}')
  return users[userName]?.progress || {}
}

export function saveQuizResult(userName, gameId, level, score, total) {
  const users = JSON.parse(localStorage.getItem('dealer_training_users') || '{}')
  if (!users[userName]) {
    users[userName] = { name: userName, joinedAt: new Date().toISOString(), progress: {} }
  }
  if (!users[userName].progress[gameId]) {
    users[userName].progress[gameId] = {}
  }
  const prev = users[userName].progress[gameId][level] || {}
  users[userName].progress[gameId][level] = {
    ...prev,
    score,
    total,
    done: true,
    date: new Date().toISOString(),
    bestScore: Math.max(prev.bestScore || 0, score),
  }
  localStorage.setItem('dealer_training_users', JSON.stringify(users))
}

export function markStudyDone(userName, gameId) {
  const users = JSON.parse(localStorage.getItem('dealer_training_users') || '{}')
  if (!users[userName]) {
    users[userName] = { name: userName, joinedAt: new Date().toISOString(), progress: {} }
  }
  if (!users[userName].progress[gameId]) {
    users[userName].progress[gameId] = {}
  }
  users[userName].progress[gameId].studyDone = true
  users[userName].progress[gameId].studyDate = new Date().toISOString()
  localStorage.setItem('dealer_training_users', JSON.stringify(users))
}

export function getAllUsersProgress() {
  return JSON.parse(localStorage.getItem('dealer_training_users') || '{}')
}

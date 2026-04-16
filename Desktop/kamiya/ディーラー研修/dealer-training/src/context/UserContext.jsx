import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dealer_training_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (name, isInstructor = false) => {
    const userData = { name, isInstructor, loginAt: new Date().toISOString() }
    setUser(userData)
    localStorage.setItem('dealer_training_user', JSON.stringify(userData))

    // 研修生リストに登録
    if (!isInstructor) {
      const users = JSON.parse(localStorage.getItem('dealer_training_users') || '{}')
      if (!users[name]) {
        users[name] = { name, joinedAt: new Date().toISOString(), progress: {} }
      }
      localStorage.setItem('dealer_training_users', JSON.stringify(users))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dealer_training_user')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import Layout from './components/Layout'
import TopPage from './pages/TopPage'
import StudyList from './pages/StudyList'
import StudyPage from './pages/StudyPage'
import QuizList from './pages/QuizList'
import QuizPage from './pages/QuizPage'
import ProgressPage from './pages/ProgressPage'
import InstructorPage from './pages/InstructorPage'
import RankingPage from './pages/RankingPage'
import RandomQuizPage from './pages/RandomQuizPage'

function RequireAuth({ children }) {
  const { user } = useUser()
  if (!user) return <Navigate to="/" replace />
  return children
}

function RequireInstructor({ children }) {
  const { user } = useUser()
  if (!user || !user.isInstructor) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useUser()
  return (
    <Layout>
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.isInstructor ? '/instructor' : '/study'} replace /> : <TopPage />} />
        <Route path="/study" element={<RequireAuth><StudyList /></RequireAuth>} />
        <Route path="/study/:gameId" element={<RequireAuth><StudyPage /></RequireAuth>} />
        <Route path="/quiz" element={<RequireAuth><QuizList /></RequireAuth>} />
        <Route path="/quiz/:gameId/:level" element={<RequireAuth><QuizPage /></RequireAuth>} />
        <Route path="/progress" element={<RequireAuth><ProgressPage /></RequireAuth>} />
        <Route path="/ranking" element={<RequireAuth><RankingPage /></RequireAuth>} />
        <Route path="/quiz/random" element={<RequireAuth><RandomQuizPage /></RequireAuth>} />
        <Route path="/instructor" element={<RequireInstructor><InstructorPage /></RequireInstructor>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  )
}

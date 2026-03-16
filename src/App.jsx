import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ScoreboardProvider } from './context/ScoreboardContext'
import ScoreboardDisplay from './components/ScoreboardDisplay'
import AdminPanel from './components/AdminPanel'
import './index.css'

export default function App() {
  return (
    <ScoreboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScoreboardDisplay />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ScoreboardProvider>
  )
}

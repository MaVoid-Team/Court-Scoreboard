import { Link } from 'react-router-dom'
import { useScoreboard, initialState } from '../../context/ScoreboardContext'
import TeamControls from './TeamControls'
import ScoreControls from './ScoreControls'
import UploadControls from './UploadControls'
import EventManager from '../EventManager'

export default function AdminPanel() {
  const { state, updateState } = useScoreboard()

  const resetMatch = () => {
    updateState(prev => ({
      ...prev,
      teamA: { ...prev.teamA, score: 0, sets: 0 },
      teamB: { ...prev.teamB, score: 0, sets: 0 },
      serve: 'A',
      timer: 0,
      timerRunning: false,
    }))
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <span className="admin-header-title">🏟 Court Scoreboard — Admin</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-header-badge">Control Panel</span>
          <Link to="/admin/players" className="view-display-link">👤 Players</Link>
          <Link to="/" className="view-display-link" target="_blank" rel="noopener noreferrer">
            Open Display ↗
          </Link>
        </div>
      </header>

      <div className="admin-body">
        <div className="admin-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TeamControls />
            <ScoreControls />
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <UploadControls />

            {/* Reset Match */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-icon red">⚠️</div>
                <span className="admin-card-title">Match Reset</span>
              </div>
              <div className="admin-card-body">
                <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                  Resets all scores, sets, timer, and serve indicator. Team names, logos, and sponsor images are kept.
                </p>
                <button className="btn-reset-match" onClick={resetMatch}>
                  🔄 Reset Match
                </button>
              </div>
            </div>
          </div>

          {/* Match Events — full width */}
          <EventManager />

        </div>
      </div>
    </div>
  )
}

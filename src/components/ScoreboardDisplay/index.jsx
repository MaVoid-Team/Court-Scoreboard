import { useScoreboard } from '../../context/ScoreboardContext'
import TeamScore from './TeamScore'
import Timer from './Timer'
import Carousel from './Carousel'

export default function ScoreboardDisplay() {
  const { state } = useScoreboard()
  const { teamA, teamB, serve } = state

  const servingName = serve === 'A' ? teamA.name : teamB.name

  return (
    <div className="display-root">
      <main className="display-main">
        {/* Score card */}
        <div className="scoreboard-card">
          <TeamScore team={teamA} teamKey="A" />
          <TeamScore team={teamB} teamKey="B" />
        </div>

        {/* Status bar */}
        <div className="status-bar">
          {/* Sets */}
          <div className="status-segment">
            <span className="status-label">Sets</span>
            <div className="sets-container">
              <div className="sets-item">
                <span className="sets-team-label">{teamA.name}</span>
                <span className="sets-number">{teamA.sets}</span>
              </div>
              <span className="sets-separator">—</span>
              <div className="sets-item">
                <span className="sets-team-label">{teamB.name}</span>
                <span className="sets-number">{teamB.sets}</span>
              </div>
            </div>
          </div>

          {/* Serve indicator */}
          <div className="status-segment">
            <span className="status-label">Serving</span>
            <div className="serve-indicator">
              <span className="serve-dot" />
              <span className="serve-text">{servingName}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="status-segment">
            <span className="status-label">Match Time</span>
            <Timer />
          </div>
        </div>
      </main>

      {/* Sponsor carousel */}
      <Carousel />
    </div>
  )
}

import { useScoreboard } from '../../context/ScoreboardContext'
import TeamScore from './TeamScore'
import Timer from './Timer'
import Carousel from './Carousel'
import EventFeed from '../EventManager/EventFeed'

export default function ScoreboardDisplay() {
  const { state } = useScoreboard()
  const { teamA, teamB, serve, players, events, lineups } = state

  const servingName = serve === 'A' ? teamA.name : teamB.name

  const lineupA = lineups.teamA.map(id => players.find(p => p.id === id)).filter(Boolean)
  const lineupB = lineups.teamB.map(id => players.find(p => p.id === id)).filter(Boolean)
  const hasInfo = lineupA.length > 0 || lineupB.length > 0 || events.length > 0

  return (
    <div className="display-root">
      <main className="display-main">
        <div className="scoreboard-split">
          <TeamScore team={teamA} side="left" />

          {/* Center divider */}
          <div className="split-center">
            <div className="split-sets">
              <span className="split-sets-score">{teamA.sets}</span>
              <span className="split-sets-label">Sets</span>
              <span className="split-sets-score">{teamB.sets}</span>
            </div>
            <div className="split-timer">
              <span className="split-timer-label">Match Time</span>
              <Timer />
            </div>
            <div className="split-serve">
              <span className="serve-dot" />
              <span className="split-serve-text">{servingName}</span>
            </div>
          </div>

          <TeamScore team={teamB} side="right" />
        </div>
      </main>

      {/* Info bar — lineups + events */}
      {hasInfo && (
        <div className="display-info-bar">
          {/* Team A lineup */}
          <div className="display-lineup display-lineup--left">
            <span className="display-lineup-title">{teamA.name}</span>
            {lineupA.length > 0 ? (
              <div className="display-lineup-list">
                {lineupA.map(p => (
                  <span key={p.id} className="display-lineup-player">
                    <span className="display-lineup-num">#{p.number}</span> {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="display-lineup-empty">—</span>
            )}
          </div>

          {/* Events */}
          <div className="display-events">
            <EventFeed events={events} players={players} limit={6} compact />
          </div>

          {/* Team B lineup */}
          <div className="display-lineup display-lineup--right">
            <span className="display-lineup-title">{teamB.name}</span>
            {lineupB.length > 0 ? (
              <div className="display-lineup-list">
                {lineupB.map(p => (
                  <span key={p.id} className="display-lineup-player">
                    <span className="display-lineup-num">#{p.number}</span> {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="display-lineup-empty">—</span>
            )}
          </div>
        </div>
      )}

      <Carousel />
    </div>
  )
}
